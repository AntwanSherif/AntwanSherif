"use client";

// Private CV lab (mounted only at /cv/edit, which is dev-only). Content loads
// from cv.ts (the source of truth) so editing the file directly shows up here
// on hot reload. In-page edits live in React state and are persisted only by
// "Save to cv.ts"; localStorage holds editor PREFERENCES (column widths,
// sidebar style) — never the content, which used to shadow source edits.

import { useEffect, useState } from "react";
import { CV, type CVData } from "@/data/cv";
import { cn } from "@/lib/utils";
import CVDocument, {
  DEFAULT_CONFIG,
  type CVDocConfig,
} from "./cv-document";
import { serializeEditable, setByPath } from "./edit-context";

const DATA_KEY = "cv-edit-data";
const CONFIG_KEY = "cv-edit-config";

export default function CVEditor() {
  const [data, setData] = useState<CVData>(CV);
  const [config, setConfig] = useState<CVDocConfig>(DEFAULT_CONFIG);
  const [editable, setEditable] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  // Content always comes from cv.ts (the source of truth) — so editing cv.ts
  // directly is reflected here on hot reload. In-page edits live in React state
  // and are persisted by "Save to cv.ts" (not localStorage, which used to
  // shadow source edits). Only editor PREFERENCES (column widths, sidebar
  // style) persist to localStorage. We also clear any legacy data buffer.
  useEffect(() => {
    try {
      localStorage.removeItem(DATA_KEY);
      const c = localStorage.getItem(CONFIG_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (c) setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(c) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const patchConfig = (patch: Partial<CVDocConfig>) => {
    setConfig((c) => {
      const next = { ...c, ...patch };
      try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const onEdit = (path: string, value: string) => {
    setData((d) => setByPath(d, path, value));
  };

  const reset = () => {
    try {
      localStorage.removeItem(CONFIG_KEY);
    } catch {
      /* ignore */
    }
    setData(CV);
    setConfig(DEFAULT_CONFIG);
  };

  // Write the current edits straight into src/data/cv.ts (dev-only endpoint).
  // Explicit button rather than auto-save: writing the source file triggers a
  // dev-server hot reload, which would yank the cursor mid-edit.
  const saveToSource = async () => {
    setSaveState("saving");
    try {
      const res = await fetch("/api/cv-save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      setSaveState(res.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
    setTimeout(() => setSaveState("idle"), 2000);
  };

  // Avoid rendering editable content until hydrated, so server and first client
  // paint match.
  if (!hydrated) {
    return <div className="min-h-screen bg-neutral-200/60" />;
  }

  return (
    <div className="min-h-screen bg-neutral-200/60">
      {/* ===== Tweak bar (hidden on print) ===== */}
      <div className="sticky top-0 z-50 border-b border-neutral-300 bg-white/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
          <span className="text-[13px] font-semibold text-neutral-900">
            CV editor
          </span>

          <Slider
            label="Main"
            value={config.colLeft}
            onChange={(v) => patchConfig({ colLeft: v })}
          />
          <Slider
            label="Sidebar"
            value={config.colRight}
            onChange={(v) => patchConfig({ colRight: v })}
          />

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
              Sidebar
            </span>
            {(["flow", "card"] as const).map((s) => (
              <button
                key={s}
                onClick={() => patchConfig({ sidebarStyle: s })}
                className={cn(
                  "rounded px-2 py-0.5 text-[11.5px] font-medium transition-colors",
                  config.sidebarStyle === s
                    ? "bg-indigo-600 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                )}
              >
                {s === "flow" ? "Flow" : "Cards"}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 text-[12px] text-neutral-700">
            <input
              type="checkbox"
              checked={editable}
              onChange={(e) => setEditable(e.target.checked)}
            />
            Edit text
          </label>

          {editable ? <FormatBar onCommit={onEdit} /> : null}

          <div className="ml-auto flex items-center gap-1.5">
            <Action onClick={saveToSource} primary>
              {saveState === "saving"
                ? "Saving…"
                : saveState === "saved"
                  ? "Saved to cv.ts ✓"
                  : saveState === "error"
                    ? "Save failed"
                    : "Save to cv.ts"}
            </Action>
            <Action onClick={reset}>Reset</Action>
            <Action onClick={() => window.print()} primary>
              Print / PDF
            </Action>
          </div>
          {editable ? (
            <p className="w-full text-[11px] text-neutral-500">
              Content loads from cv.ts. Click any text to edit it; select text
              and use Format (B / I / Link) to style or link it. Edits preview
              live — hit “Save to cv.ts” to persist (otherwise they’re dropped
              on refresh).
            </p>
          ) : null}
        </div>
      </div>

      {/* ===== Live preview ===== */}
      <div className="cv-stage px-4 py-8 print:p-0">
        <CVDocument
          data={data}
          config={config}
          editable={editable}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
}

// Find the contentEditable CV field the selection is currently in.
function activeField(): HTMLElement | null {
  const el = document.activeElement as HTMLElement | null;
  return el?.getAttribute("data-edit-path") ? el : null;
}

// Format bar. Uses real rich-text commands (so no raw markdown markers or long
// URLs appear in the column), then commits immediately via onCommit so the
// formatting survives a refresh without waiting for a blur.
function FormatBar({
  onCommit,
}: {
  onCommit: (path: string, value: string) => void;
}) {
  const btn =
    "rounded px-2 py-0.5 text-[12px] bg-neutral-100 text-neutral-700 hover:bg-neutral-200";

  const commit = (host: HTMLElement | null) => {
    const path = host?.getAttribute("data-edit-path");
    if (host && path) onCommit(path, serializeEditable(host));
  };

  const exec = (cmd: string) => {
    document.execCommand("styleWithCSS", false, "false"); // emit <b>/<i>, not spans
    document.execCommand(cmd);
    commit(activeField());
  };

  const addLink = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.toString()) return;
    const range = sel.getRangeAt(0).cloneRange();
    const host = (
      range.startContainer.parentElement as HTMLElement | null
    )?.closest<HTMLElement>("[contenteditable]");
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    host?.focus();
    sel.removeAllRanges();
    sel.addRange(range); // prompt collapsed the selection — restore it
    document.execCommand("createLink", false, url);
    commit(host ?? null);
  };

  // preventDefault on mousedown keeps focus + selection in the edited field.
  return (
    <div
      className="flex items-center gap-1"
      onMouseDown={(e) => e.preventDefault()}
    >
      <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        Format
      </span>
      <button className={btn} onClick={() => exec("bold")}>
        <b>B</b>
      </button>
      <button className={btn} onClick={() => exec("italic")}>
        <i>I</i>
      </button>
      <button className={btn} onClick={addLink}>
        Link
      </button>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-1.5 text-[11.5px] text-neutral-600">
      <span className="font-medium">{label}</span>
      <input
        type="range"
        min={0.8}
        max={2.6}
        step={0.05}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-24 accent-indigo-600"
      />
      <span className="w-8 tabular-nums text-neutral-400">{value.toFixed(2)}</span>
    </label>
  );
}

function Action({
  onClick,
  children,
  primary,
}: {
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1 text-[12px] font-medium transition-colors",
        primary
          ? "bg-neutral-900 text-white hover:bg-neutral-800"
          : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50",
      )}
    >
      {children}
    </button>
  );
}
