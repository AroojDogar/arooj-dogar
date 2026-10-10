// Translates the visitor-facing text in src/data/profile.ts into every site
// language and saves it to src/i18n/translations.json.
//
//   npm run translate
//
// Only new or changed sentences are sent to the AI, so re-running is cheap.
// Runs automatically before `npm run build`; it never fails the build — any
// sentence without a translation simply shows in English.

import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { readFile, writeFile } from "node:fs/promises";
import { z } from "zod";
import { profile } from "../src/data/profile.ts";

const OUT = new URL("../src/i18n/translations.json", import.meta.url);

const LANGUAGES: Record<string, string> = {
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  nl: "Dutch",
  ar: "Arabic",
};

/** Keep in sync with englishContent() in src/i18n/content.ts */
function sourceStrings(): string[] {
  const strings = [
    profile.role,
    profile.tagline,
    profile.about,
    profile.availability,
    profile.location,
    profile.whatsappMessage,
    ...profile.services.flatMap((s) => [s.title, s.description]),
    ...profile.featured.flatMap((p) => [p.description, ...(p.highlights ?? [])]),
    ...profile.process.flatMap((s) => [s.title, s.description]),
  ];
  return [...new Set(strings.filter((s) => s.trim()))];
}

function model() {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google(process.env.GEMINI_MODEL || "gemini-flash-lite-latest");
  }
  if (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL) {
    return process.env.AI_MODEL || "anthropic/claude-sonnet-5.5";
  }
  return null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function translate(strings: string[], language: string): Promise<string[]> {
  const m = model()!;
  for (let attempt = 1; ; attempt++) {
    try {
      const { output } = await generateText({
        model: m,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(90_000),
        reasoning: "minimal",
        output: Output.object({ schema: z.object({ translations: z.array(z.string()) }) }),
        instructions: `You translate website copy for a freelance web developer's portfolio into ${language}.
Rules:
- Return "translations": one translation per input string, in the same order (exactly ${strings.length} items).
- Write natural, professional marketing copy a native speaker would use for business clients. Use the polite/formal form of address where the language has one, except for a message a client writes to the developer (e.g. "Hi …! I saw your portfolio…").
- Keep product, brand and technology names in English (Next.js, TypeScript, Tailwind CSS, Vercel, GitHub, SaaS, AI SDK, WhatsApp, Three.js, WebGL, CI/CD, …).
- Keep prices, numbers and people's names unchanged.`,
        prompt: JSON.stringify(strings),
      });
      if (output.translations.length !== strings.length) {
        throw new Error(
          `expected ${strings.length} translations, got ${output.translations.length}`,
        );
      }
      return output.translations;
    } catch (error) {
      if (attempt >= 4) throw error;
      // Free AI tiers allow only a few requests per minute — wait and retry.
      const wait = 20_000 * attempt;
      console.log(`  ${language}: ${(error as Error).message.split("\n")[0].slice(0, 120)}`);
      console.log(`  retrying in ${wait / 1000}s…`);
      await sleep(wait);
    }
  }
}

async function main() {
  if (!model()) {
    console.log("translate: no AI key set (GOOGLE_GENERATIVE_AI_API_KEY) — skipping.");
    return;
  }

  let saved: Record<string, Record<string, string>> = {};
  try {
    saved = JSON.parse(await readFile(OUT, "utf8"));
  } catch {}

  const source = sourceStrings();
  const result: Record<string, Record<string, string>> = {};
  let changed = false;

  for (const [code, language] of Object.entries(LANGUAGES)) {
    const existing = saved[code] ?? {};
    const missing = source.filter((s) => !existing[s]);
    // Drop sentences that no longer exist in profile.ts
    result[code] = Object.fromEntries(
      source.filter((s) => existing[s]).map((s) => [s, existing[s]]),
    );
    if (Object.keys(existing).length !== Object.keys(result[code]).length) changed = true;

    if (missing.length === 0) {
      console.log(`translate: ${language} is up to date`);
      continue;
    }
    console.log(`translate: ${language} — translating ${missing.length} sentence(s)…`);
    try {
      const started = Date.now();
      const translated = await translate(missing, language);
      missing.forEach((s, i) => (result[code][s] = translated[i]));
      changed = true;
      // Save after every language so progress is never lost
      await writeFile(OUT, JSON.stringify({ ...saved, ...result }, null, 2) + "\n", "utf8");
      console.log(`  done in ${Math.round((Date.now() - started) / 1000)}s`);
    } catch (error) {
      console.warn(`translate: ${language} failed, English will be shown for now.`, error);
    }
  }

  if (changed) {
    await writeFile(OUT, JSON.stringify(result, null, 2) + "\n", "utf8");
    console.log("translate: saved src/i18n/translations.json");
  }
}

main().catch((error) => {
  console.warn("translate: skipped because of an error —", error);
});
