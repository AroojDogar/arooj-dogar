"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/ui";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent/60 focus:ring-4 focus:ring-accent/10";

export function ContactForm({ t, locale }: { t: Dictionary["contact"]["form"]; locale: Locale }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, {
    status: "idle",
  });

  if (state.status === "success") {
    return (
      <div className="animate-fade-up flex h-full flex-col items-center justify-center rounded-2xl border border-mint/30 bg-mint/5 p-10 text-center">
        <CheckCircle2 className="size-12 text-mint" />
        <h3 className="mt-4 text-xl font-semibold">{t.sentTitle}</h3>
        <p className="mt-2 text-sm text-muted">{t.sentDescription}</p>
      </div>
    );
  }

  const err = state.errors ?? {};
  const v = state.values ?? {};

  return (
    <form key={state.submittedAt} action={action} className="space-y-4 text-start" noValidate>
      <input type="hidden" name="lang" value={locale} />
      {/* Honeypot — hidden from people, filled by bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.name} error={err.name}>
          <input
            name="name"
            defaultValue={v.name}
            required
            autoComplete="name"
            placeholder={t.namePlaceholder}
            className={inputClass}
          />
        </Field>
        <Field label={t.email} error={err.email}>
          <input
            name="email"
            defaultValue={v.email}
            type="email"
            required
            autoComplete="email"
            placeholder="name@company.com"
            dir="ltr"
            className={inputClass}
          />
        </Field>
        <Field label={t.projectType} error={err.projectType}>
          <select name="projectType" defaultValue={v.projectType ?? ""} className={inputClass}>
            <option value="">{t.select}</option>
            {Object.entries(t.projectTypes).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.budget} error={err.budget}>
          <select name="budget" defaultValue={v.budget ?? ""} className={inputClass}>
            <option value="">{t.select}</option>
            {Object.entries(t.budgets).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={t.details} error={err.message}>
        <textarea
          name="message"
          defaultValue={v.message}
          required
          rows={5}
          placeholder={t.detailsPlaceholder}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {state.message && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4 rtl:-scale-x-100" />
        )}
        {pending ? t.sending : t.send}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
