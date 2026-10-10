"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { defaultLocale, isLocale, localeNames } from "@/i18n/config";
import { getDictionary } from "@/i18n/ui";
import { isRateLimited, sendInquiry } from "@/lib/email";

type Field = "name" | "email" | "projectType" | "budget" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  /** What the visitor typed, so the form can be refilled after an error. */
  values?: Record<string, string>;
  /** Changes on every submission so the form remounts with the refilled values. */
  submittedAt?: number;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const lang = formData.get("lang");
  const locale = isLocale(lang) ? lang : defaultLocale;
  const errorText = getDictionary(locale).contact.form.errors;
  // Emails to the owner always use the English labels.
  const english = getDictionary("en").contact.form;

  const schema = z.object({
    name: z.string().trim().min(2, errorText.name).max(100, errorText.tooLong),
    email: z.email(errorText.email).max(200, errorText.email),
    projectType: z.enum(Object.keys(english.projectTypes) as [string, ...string[]]).optional(),
    budget: z.enum(Object.keys(english.budgets) as [string, ...string[]]).optional(),
    message: z.string().trim().min(10, errorText.message).max(5000, errorText.tooLong),
  });

  const values = Object.fromEntries(
    ["name", "email", "projectType", "budget", "message"].map((k) => [
      k,
      String(formData.get(k) ?? ""),
    ]),
  );
  const fail = (rest: Omit<ContactState, "status" | "values" | "submittedAt">): ContactState => ({
    status: "error",
    values,
    submittedAt: Date.now(),
    ...rest,
  });

  // Honeypot: real visitors never see or fill this field.
  if (formData.get("website")) return { status: "success" };

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    projectType: formData.get("projectType") || undefined,
    budget: formData.get("budget") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as Field;
      errors[key] ??= issue.message;
    }
    return fail({ errors });
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) return fail({ message: errorText.rateLimited });

  const { projectType, budget, ...rest } = parsed.data;
  const result = await sendInquiry({
    ...rest,
    projectType:
      projectType && english.projectTypes[projectType as keyof typeof english.projectTypes],
    budget: budget && english.budgets[budget as keyof typeof english.budgets],
    language: locale === defaultLocale ? undefined : localeNames[locale].english,
    source: "Contact form",
  });
  if (!result.ok) return fail({ message: errorText.failed });
  return { status: "success" };
}
