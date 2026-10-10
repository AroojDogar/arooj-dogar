"use client";

import { Sparkles } from "lucide-react";

export const OPEN_CHAT_EVENT = "portfolio:open-chat";

/** Opens the AI assistant; with a message, it's sent straight away. */
export function openChat(message?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: { message } }));
}

export function OpenChatButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => openChat()} className={className}>
      <Sparkles className="size-4" />
      {label}
    </button>
  );
}
