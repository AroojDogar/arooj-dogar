import { Fragment, type ReactNode } from "react";

// Minimal, safe markdown for chat replies: paragraphs, bullet lists, **bold** and [links](url).

// Bold is matched first so a link inside **bold** is rendered recursively.
const INLINE = /(\*\*.+?\*\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((chunk, i) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return <strong key={i}>{renderInline(chunk.slice(2, -2))}</strong>;
    }
    const link = chunk.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link && /^(https?:|mailto:)/.test(link[2])) {
      return (
        <a
          key={i}
          href={link[2]}
          target="_blank"
          rel="noreferrer"
          className="text-accent underline underline-offset-2"
        >
          {link[1]}
        </a>
      );
    }
    return <Fragment key={i}>{chunk}</Fragment>;
  });
}

export function ChatMarkdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={blocks.length} className="list-disc space-y-1 pl-5">
          {list.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };

  for (const line of text.split("\n")) {
    const bullet = line.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]);
      continue;
    }
    flushList();
    if (line.trim()) {
      const heading = line.replace(/^#{1,6}\s+/, "");
      blocks.push(
        <p key={blocks.length} className={heading !== line ? "font-semibold" : undefined}>
          {renderInline(heading)}
        </p>,
      );
    }
  }
  flushList();

  return <div className="space-y-2">{blocks}</div>;
}
