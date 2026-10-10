"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MobileMenu({
  links,
  openLabel,
  closeLabel,
}: {
  links: { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div className="animate-fade-up absolute inset-x-0 top-14 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-xl [animation-duration:250ms]">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
