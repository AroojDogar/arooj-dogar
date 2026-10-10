import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { buildInstructions, getModel, isAssistantConfigured } from "@/lib/assistant";
import { isEmailConfigured, isRateLimited, sendInquiry } from "@/lib/email";
import { getRepos } from "@/lib/github";
import { isLocale } from "@/i18n/config";

export const maxDuration = 30;

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 2000;

export async function POST(req: Request) {
  if (!isAssistantConfigured()) {
    return Response.json(
      {
        error:
          "The AI assistant is not configured yet. Set GOOGLE_GENERATIVE_AI_API_KEY or AI_GATEWAY_API_KEY.",
      },
      { status: 503 },
    );
  }

  let messages: UIMessage[];
  let lang: unknown;
  try {
    ({ messages, lang } = (await req.json()) as { messages: UIMessage[]; lang?: unknown });
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // Keep requests small: recent history only, user text capped in length.
  const recent = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      ...m,
      parts: m.parts.map((part) =>
        part.type === "text" ? { ...part, text: part.text.slice(0, MAX_MESSAGE_CHARS) } : part,
      ),
    }));

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  const sendInquiryTool = tool({
    description:
      "Send the visitor's project inquiry to the portfolio owner by email. Only call this after the visitor has given their name, email and project details AND explicitly confirmed they want it sent.",
    inputSchema: z.object({
      name: z.string().min(1).max(100).describe("Visitor's name"),
      email: z.email().describe("Visitor's email address"),
      projectSummary: z
        .string()
        .min(10)
        .max(3000)
        .describe("Summary of what the visitor wants built, in their words"),
      budget: z.string().max(60).optional().describe("Budget, if the visitor mentioned one"),
    }),
    execute: async ({ name, email, projectSummary, budget }) => {
      if (isRateLimited(ip)) return { sent: false, reason: "Too many messages, try again later." };
      const result = await sendInquiry({
        name,
        email,
        budget,
        message: projectSummary,
        source: "AI assistant",
      });
      return result.ok ? { sent: true } : { sent: false, reason: result.error };
    },
  });

  const result = streamText({
    model: getModel(),
    instructions: buildInstructions(await getRepos(), {
      canSendInquiry: isEmailConfigured(),
      locale: isLocale(lang) ? lang : "en",
    }),
    messages: await convertToModelMessages(recent),
    tools: isEmailConfigured() ? { sendInquiry: sendInquiryTool } : {},
    stopWhen: isStepCount(2),
    maxOutputTokens: 800,
    // Portfolio Q&A doesn't need deep thinking; keeps replies fast.
    reasoning: "minimal",
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
