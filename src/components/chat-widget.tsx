"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart } from "ai";
import { Bot, Mail, MailCheck, Send, Sparkles, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { fmt, type Dictionary } from "@/i18n/ui";
import { ChatMarkdown } from "@/components/chat-markdown";
import { OPEN_CHAT_EVENT } from "@/components/open-chat-button";

type ChatText = Dictionary["chat"];

export function ChatWidget({
  ownerName,
  locale,
  t,
}: {
  ownerName: string;
  locale: Locale;
  t: ChatText;
}) {
  const [open, setOpen] = useState(false);
  // The chat panel mounts on first open (useChat can't be prerendered) and then
  // stays mounted so the conversation survives closing and reopening.
  const [mounted, setMounted] = useState(false);
  // A question typed elsewhere on the page (e.g. the hero), sent once the panel is ready
  const [queued, setQueued] = useState<{ text: string; id: number } | null>(null);

  const setChatOpen = (next: boolean) => {
    setOpen(next);
    if (next) setMounted(true);
  };

  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      setMounted(true);
      const message = (e as CustomEvent<{ message?: string }>).detail?.message;
      if (message) setQueued({ text: message, id: Date.now() });
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  return (
    <>
      {mounted && (
        <ChatPanel
          ownerName={ownerName}
          locale={locale}
          t={t}
          open={open}
          queued={queued}
          onClose={() => setChatOpen(false)}
        />
      )}

      <button
        type="button"
        onClick={() => setChatOpen(!open)}
        aria-label={open ? t.close : t.open}
        className="group fixed end-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-2 to-accent px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-accent/30 transition-transform hover:scale-105 sm:end-6 sm:bottom-6"
      >
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-accent/30 [animation-duration:2.5s]" />
        )}
        {open ? (
          <X className="size-5" />
        ) : (
          <Sparkles className="size-5 transition-transform group-hover:rotate-12" />
        )}
        <span className="hidden sm:inline">{open ? t.closeShort : t.askAi}</span>
      </button>
    </>
  );
}

function ChatPanel({
  ownerName,
  locale,
  t,
  open,
  queued,
  onClose,
}: {
  ownerName: string;
  locale: Locale;
  t: ChatText;
  open: boolean;
  queued: { text: string; id: number } | null;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [transport] = useState(
    () => new DefaultChatTransport({ api: "/api/chat", body: { lang: locale } }),
  );
  const { messages, sendMessage, status, stop, error } = useChat({ transport });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = status === "submitted" || status === "streaming";
  const name = { name: ownerName };

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sentQueued = useRef(0);
  useEffect(() => {
    if (!queued || queued.id === sentQueued.current || busy) return;
    // Deferred so a remount (e.g. React Strict Mode in dev) cancels it and
    // only the final, live chat instance sends the message.
    const timer = setTimeout(() => {
      sentQueued.current = queued.id;
      sendMessage({ text: queued.text });
    }, 0);
    return () => clearTimeout(timer);
  }, [queued, busy, sendMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div
      role="dialog"
      aria-label={fmt(t.title, name)}
      className={`${open ? "animate-fade-up flex" : "hidden"} fixed inset-x-3 bottom-20 z-50 max-h-[min(640px,calc(100dvh-7rem))] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/60 [animation-duration:250ms] sm:inset-x-auto sm:end-6 sm:w-[400px]`}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-accent text-on-accent">
            <Bot className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium">{fmt(t.title, name)}</p>
            <p className="text-xs text-muted">{t.subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm">
        {messages.length === 0 && (
          <div>
            <p className="text-muted">{fmt(t.greeting, name)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {t.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-start text-xs transition-colors hover:border-accent/60"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => {
          const text = message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("");
          const inquiry = message.parts
            .filter(isToolUIPart)
            .find((part) => part.type === "tool-sendInquiry");
          const inquiryChip = inquiry && (
            <p
              key={`${message.id}-inquiry`}
              className="flex w-fit items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted"
            >
              {inquiry.state === "output-available" &&
              (inquiry.output as { sent?: boolean } | undefined)?.sent ? (
                <>
                  <MailCheck className="size-3.5 text-mint" />
                  {fmt(t.sent, name)}
                </>
              ) : inquiry.state === "output-available" || inquiry.state === "output-error" ? (
                <>
                  <Mail className="size-3.5 text-red-400" />
                  {t.sendFailed}
                </>
              ) : (
                <>
                  <Mail className="size-3.5 animate-pulse" />
                  {t.sending}
                </>
              )}
            </p>
          );
          if (!text) return inquiryChip || null;
          const bubble =
            message.role === "user" ? (
              <div
                key={message.id}
                className="animate-fade-up flex justify-end [animation-duration:300ms]"
              >
                <p className="max-w-[85%] rounded-2xl rounded-ee-md bg-accent px-3.5 py-2 whitespace-pre-wrap text-on-accent">
                  {text}
                </p>
              </div>
            ) : (
              <div
                key={message.id}
                className="animate-fade-up max-w-[90%] rounded-2xl rounded-es-md bg-surface-2 px-3.5 py-2.5 leading-relaxed [animation-duration:300ms]"
              >
                <ChatMarkdown text={text} />
              </div>
            );
          if (message.role === "assistant" && inquiryChip) {
            return (
              <div key={message.id} className="space-y-2">
                {inquiryChip}
                {bubble}
              </div>
            );
          }
          return bubble;
        })}

        {status === "submitted" && (
          <div className="flex w-fit gap-1 rounded-2xl bg-surface-2 px-4 py-3">
            {[0, 150, 300].map((ms) => (
              <span
                key={ms}
                className="size-1.5 animate-bounce rounded-full bg-muted"
                style={{ animationDelay: `${ms}ms` }}
              />
            ))}
          </div>
        )}

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {fmt(t.unavailable, name)}
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder={t.placeholder}
          maxLength={2000}
          className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent/60"
        />
        {busy ? (
          <button
            type="button"
            onClick={() => stop()}
            aria-label={t.stop}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 transition-colors hover:bg-border"
          >
            <Square className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label={t.send}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send className="size-4 rtl:-scale-x-100" />
          </button>
        )}
      </form>
    </div>
  );
}
