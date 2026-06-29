"use client";

// In-place editing plumbing for the CV document. The public /cv page renders
// with editing OFF (plain text). The private /cv/edit page renders the SAME
// document with editing ON, so text fields become contentEditable and write
// back into a local copy of the CV data by path. Local-only by design — the
// public page never reads these edits.

import {
  createContext,
  useContext,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export type EditCtx = {
  editable: boolean;
  onEdit: (path: string, value: string) => void;
};

export const EditContext = createContext<EditCtx>({
  editable: false,
  onEdit: () => {},
});

// Tiny inline-markdown renderer: **bold**, *italic*, [text](url). Used for
// "rich" prose fields so the format bar's markers render as real formatting.
const INLINE = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function renderInline(text: string): ReactNode {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;
    let m: RegExpExecArray | null;
    if ((m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part))) {
      return (
        <a
          key={i}
          href={m[2]}
          target="_blank"
          rel="noreferrer"
          className="underline-offset-2 hover:underline"
          style={{ color: "#3B5BFF" }}
        >
          {m[1]}
        </a>
      );
    }
    if ((m = /^\*\*([^*]+)\*\*$/.exec(part))) {
      return <strong key={i}>{m[1]}</strong>;
    }
    if ((m = /^\*([^*]+)\*$/.exec(part))) {
      return <em key={i}>{m[1]}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

// Editable text node. When editing is off it's a plain element (zero overhead,
// SSR-clean) that renders inline markdown (**bold**, *italic*, [text](url)) so
// formatting added via the format bar shows everywhere. When editing it's
// contentEditable, renders bold/italic/links as real formatting (no raw markers
// in the column), and serializes the DOM back to markdown on blur.
export function Ed({
  path,
  children,
  as,
  className,
  style,
}: {
  path: string;
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const { editable, onEdit } = useContext(EditContext);
  const Tag = as ?? "span";

  const content =
    typeof children === "string" ? renderInline(children) : children;

  if (!editable) {
    return (
      <Tag className={className} style={style}>
        {content}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      style={{ ...style, outline: "none", borderRadius: 3 }}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-edit-path={path}
      onFocus={(e: React.FocusEvent<HTMLElement>) => {
        e.currentTarget.style.boxShadow = "0 0 0 2px rgba(99,102,241,0.5)";
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        e.currentTarget.style.boxShadow = "none";
        onEdit(path, serializeEditable(e.currentTarget));
      }}
    >
      {content}
    </Tag>
  );
}

// Serialize a contentEditable's DOM back to the lightweight markdown the data
// model stores: <a> → [text](url), <strong>/<b> → **text**, <em>/<i> → *text*.
function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as HTMLElement;
  const inner = Array.from(el.childNodes).map(nodeToMarkdown).join("");
  switch (el.tagName.toLowerCase()) {
    case "a":
      return `[${inner}](${el.getAttribute("href") ?? ""})`;
    case "strong":
    case "b":
      return inner ? `**${inner}**` : "";
    case "em":
    case "i":
      return inner ? `*${inner}*` : "";
    case "br":
      return "";
    default:
      return inner;
  }
}

export function serializeEditable(el: HTMLElement): string {
  return Array.from(el.childNodes).map(nodeToMarkdown).join("");
}

// Immutably set a value at a dotted path (numeric segments index arrays).
// e.g. setByPath(cv, "experience.0.groups.1.bullets.0", "new text").
export function setByPath<T>(obj: T, path: string, value: string): T {
  const keys = path.split(".");
  const clone: any = Array.isArray(obj) ? [...obj] : { ...obj };
  let cursor = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const next = cursor[k];
    cursor[k] = Array.isArray(next) ? [...next] : { ...next };
    cursor = cursor[k];
  }
  cursor[keys[keys.length - 1]] = value;
  return clone;
}
