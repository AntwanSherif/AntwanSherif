"use client";

// The canonical CV document. One design (the "Gradient Header" direction),
// parameterized by a config so the editor can A/B header concepts, side-project
// tech rendering, link style, and column widths — and so the public page can
// pin a chosen config. Every text field is wrapped in <Ed>, so the same
// component powers both the read-only public page and the in-place editor
// (editing is global: titles, dates, skills, sidebar content, all of it).

import { useReducedMotion, motion } from "motion/react";
import { Github, Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CVData, CVEntry } from "@/data/cv";
import { FadeItem, Stagger } from "./_shared";
import { Ed, EditContext } from "./edit-context";

const VIOLET = "#7C3AED";
const BLUE = "#3B5BFF";
const INK = "#0F172A";
const GRAY = "#64748B";
const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";

// Dusk: the chosen header palette (refined indigo → royal blue, no neon).
const DUSK = "linear-gradient(120deg, #312e81 0%, #1e40af 58%, #2563eb 100%)";
// Solid royal blue sampled from the candidate's original CV PDF.
const HEADER_SOLID = "#2251b2";
// Calm body accent for headings/markers (independent of the header).
const ACCENT = `linear-gradient(120deg, ${VIOLET} 0%, ${BLUE} 100%)`;

export type HeaderDir = 1 | 2 | 3 | 4 | 5;
export type TechStyle = 1 | 2 | 3;
export type LinkStyle = 1 | 2 | 3;
export type EmblemType = "monogram" | "orbit" | "none";
export type SidebarStyle = "flow" | "card";

export type CVDocConfig = {
  headerDir: HeaderDir;
  techStyle: TechStyle;
  linkStyle: LinkStyle;
  emblem: EmblemType;
  sidebarStyle: SidebarStyle;
  colLeft: number;
  colRight: number;
};

export const DEFAULT_CONFIG: CVDocConfig = {
  headerDir: 1,
  techStyle: 1,
  linkStyle: 1,
  emblem: "monogram",
  sidebarStyle: "flow",
  colLeft: 1.85,
  colRight: 1.15,
};

export type CVDocumentProps = {
  data: CVData;
  config?: CVDocConfig;
  editable?: boolean;
  onEdit?: (path: string, value: string) => void;
};

function iconFor(label: string, size = 13) {
  const l = label.toLowerCase();
  if (l.includes("linkedin")) return <Linkedin size={size} strokeWidth={2} />;
  if (l.includes("github")) return <Github size={size} strokeWidth={2} />;
  return <Globe size={size} strokeWidth={2} />;
}

export default function CVDocument({
  data,
  config = DEFAULT_CONFIG,
  editable = false,
  onEdit = () => {},
}: CVDocumentProps) {
  const reduce = useReducedMotion();
  // Card sidebar A/B: each sidebar block becomes its own panel. Keep padding
  // tight so the cards don't steal column width from the content.
  const isCard = config.sidebarStyle === "card";
  const cardCls = isCard
    ? "rounded-lg border border-[#e8ebf2] bg-white px-3 py-4 shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
    : undefined;

  return (
    <EditContext.Provider value={{ editable, onEdit }}>
      <div
        className="cv-sheet mx-auto bg-white"
        style={{ fontFamily: SANS, color: INK }}
      >
        <Header data={data} config={config} reduce={!!reduce} />

        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `${config.colLeft}fr ${config.colRight}fr`,
          }}
        >
          {/* ---- main column ---- */}
          <main className="space-y-6 px-9 py-8">
            <Stagger className="space-y-6" stagger={0.07}>
              <FadeItem>
                <Heading path="labels.summary">{data.labels.summary}</Heading>
                <div className="space-y-2">
                  {data.summary.map((p, i) => (
                    <Ed
                      key={i}
                      as="p"
                      path={`summary.${i}`}
                      className="text-[12px] leading-relaxed"
                      style={{ color: "#33415c" }}
                    >
                      {p}
                    </Ed>
                  ))}
                </div>
              </FadeItem>

              <FadeItem>
                <Heading path="labels.experience">
                  {data.labels.experience}
                </Heading>
                <div className="space-y-5">
                  {data.experience.map((job, ji) => (
                    <div key={`${job.company}-${ji}`} className="cv-exp">
                      <Ed
                        as="h3"
                        path={`experience.${ji}.role`}
                        className="text-[14px] font-bold leading-tight"
                        style={{ color: INK }}
                      >
                        {job.role}
                      </Ed>
                      <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                        <Ed
                          path={`experience.${ji}.company`}
                          className="text-[11.5px] font-medium"
                          style={{ color: "#566374" }}
                        >
                          {job.company}
                        </Ed>
                        <span className="text-[11px]" style={{ color: "#9aa6b8" }}>
                          |
                        </span>
                        <span className="text-[10.5px]" style={{ color: GRAY }}>
                          <Ed path={`experience.${ji}.start`}>{job.start}</Ed>
                          {" – "}
                          <Ed path={`experience.${ji}.end`}>{job.end}</Ed>
                        </span>
                        {job.tag ? (
                          <ProjectBadge tone={job.tagTone}>
                            <Ed path={`experience.${ji}.tag`}>{job.tag}</Ed>
                          </ProjectBadge>
                        ) : null}
                      </div>
                      {job.context ? (
                        <Ed
                          as="p"
                          path={`experience.${ji}.context`}
                          className="mt-0.5 text-[11px] italic"
                          style={{ color: GRAY }}
                        >
                          {job.context}
                        </Ed>
                      ) : null}
                      <div className="mt-2.5 space-y-3">
                        {job.groups.map((grp, gi) => (
                          <div key={gi}>
                            {grp.heading ? (
                              <Ed
                                as="p"
                                path={`experience.${ji}.groups.${gi}.heading`}
                                className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
                                style={{ color: "#64748b" }}
                              >
                                {grp.heading}
                              </Ed>
                            ) : null}
                            <ul className="space-y-2">
                              {grp.bullets.map((b, bi) => (
                                <li
                                  key={bi}
                                  className="relative pl-3.5 text-[12px] leading-relaxed"
                                  style={{ color: "#33415c" }}
                                >
                                  <span
                                    className="absolute left-0 top-[8px] h-1.5 w-1.5 rounded-full"
                                    style={{ background: ACCENT }}
                                  />
                                  <Ed
                                    path={`experience.${ji}.groups.${gi}.bullets.${bi}`}
                                  >
                                    {b}
                                  </Ed>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </FadeItem>
            </Stagger>
          </main>

          {/* ---- sidebar column ---- */}
          <aside
            className={cn("py-8", isCard ? "px-4" : "px-7")}
            style={{ borderLeft: "1px solid #eef1f6", background: "#fbfcfe" }}
          >
            <Stagger className={isCard ? "space-y-3" : "space-y-6"} stagger={0.06}>
              <FadeItem className={cn("cv-side", cardCls)}>
                <Heading path="labels.projects">{data.labels.projects}</Heading>
                <div className="space-y-3.5">
                  {data.projects.map((p, pi) => (
                    <div key={p.name} className="cv-proj">
                      <div className="flex items-start justify-between gap-2">
                        {p.href ? (
                          <a
                            href={p.href}
                            className="text-[12px] font-semibold leading-tight underline-offset-2 hover:underline"
                            style={{ color: BLUE }}
                          >
                            <Ed path={`projects.${pi}.name`}>{p.name}</Ed>
                          </a>
                        ) : (
                          <Ed
                            path={`projects.${pi}.name`}
                            className="text-[12px] font-semibold leading-tight"
                            style={{ color: INK }}
                          >
                            {p.name}
                          </Ed>
                        )}
                        {p.tag ? (
                          <ProjectBadge tone={p.tagTone}>
                            <Ed path={`projects.${pi}.tag`}>{p.tag}</Ed>
                          </ProjectBadge>
                        ) : null}
                      </div>
                      {p.role ? (
                        <Ed
                          as="p"
                          path={`projects.${pi}.role`}
                          className="text-[10.5px] font-medium"
                          style={{ color: GRAY }}
                        >
                          {p.role}
                        </Ed>
                      ) : null}
                      <Ed
                        as="p"
                        path={`projects.${pi}.description`}
                        className="mt-0.5 text-[11px] leading-snug"
                        style={{ color: "#33415c" }}
                      >
                        {p.description}
                      </Ed>
                      <ProjectTech
                        tech={p.tech}
                        style={config.techStyle}
                        projectIndex={pi}
                      />
                    </div>
                  ))}
                </div>
              </FadeItem>

              <FadeItem className={cn("cv-side", cardCls)}>
                <Heading path="labels.skills">{data.labels.skills}</Heading>
                <div className="space-y-3">
                  {data.skills.map((g, gi) => (
                    <div key={g.category}>
                      <Ed
                        as="p"
                        path={`skills.${gi}.category`}
                        className="mb-1 text-[11px] font-semibold"
                        style={{ color: INK }}
                      >
                        {g.category}
                      </Ed>
                      <div className="flex flex-wrap gap-1.5">
                        {g.items.map((it, ii) => (
                          <Pill key={it}>
                            <Ed path={`skills.${gi}.items.${ii}`}>{it}</Ed>
                          </Pill>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </FadeItem>

              <FadeItem className={cn("cv-side", cardCls)}>
                <Heading path="labels.recognition">
                  {data.labels.recognition}
                </Heading>
                <EntryList entries={data.recognition} basePath="recognition" />
              </FadeItem>

              <FadeItem className={cn("cv-side", cardCls)}>
                <Heading path="labels.leadership">
                  {data.labels.leadership}
                </Heading>
                <EntryList entries={data.leadership} basePath="leadership" />
              </FadeItem>

              <FadeItem className={cn("cv-side", cardCls)}>
                <Heading path="labels.training">{data.labels.training}</Heading>
                <EntryList entries={data.training} basePath="training" />
              </FadeItem>

              <FadeItem className={cn("cv-side", cardCls)}>
                <Heading path="labels.languages">
                  {data.labels.languages}
                </Heading>
                <ul className="space-y-1 text-[11.5px]" style={{ color: GRAY }}>
                  {data.languages.map((l, li) => (
                    <li key={l.language}>
                      <Ed
                        path={`languages.${li}.language`}
                        className="font-semibold"
                        style={{ color: INK }}
                      >
                        {l.language}
                      </Ed>
                      {" — "}
                      <Ed path={`languages.${li}.level`}>{l.level}</Ed>
                    </li>
                  ))}
                </ul>
              </FadeItem>

              <FadeItem className={cn("cv-side", cardCls)}>
                <Heading path="labels.education">
                  {data.labels.education}
                </Heading>
                <div className="space-y-2">
                  {data.education.map((e, ei) => (
                    <div key={ei}>
                      <Ed
                        as="p"
                        path={`education.${ei}.title`}
                        className="text-[12px] font-semibold"
                        style={{ color: INK }}
                      >
                        {e.title}
                      </Ed>
                      <Ed
                        as="p"
                        path={`education.${ei}.detail`}
                        className="text-[11px]"
                        style={{ color: GRAY }}
                      >
                        {e.detail}
                      </Ed>
                    </div>
                  ))}
                </div>
              </FadeItem>
            </Stagger>
          </aside>
        </div>
      </div>
    </EditContext.Provider>
  );
}

/* ============================ HEADER (5 directions) ============================ */

// Corner emblem. A few clean SVG marks (white line-art on the gradient):
// a monogram badge, an abstract orbit mark, or none.
function Emblem({
  type,
  initials,
  className,
}: {
  type: EmblemType;
  initials: string;
  className?: string;
}) {
  if (type === "none") return null;

  return (
    <div className={cn("pointer-events-none", className)} aria-hidden>
      {type === "orbit" ? (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          {/* tilted orbit ring + a node riding it + a solid core */}
          <ellipse
            cx="26"
            cy="26"
            rx="24"
            ry="11"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.4"
            transform="rotate(-32 26 26)"
          />
          <circle cx="26" cy="26" r="5" fill="#fff" />
          <circle cx="43.5" cy="17.5" r="2.6" fill="rgba(255,255,255,0.9)" />
        </svg>
      ) : (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          {/* monogram: thin ring with a small gap + initials */}
          <path
            d="M26 2.5a23.5 23.5 0 1 1 -12 3.3"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <text
            x="26"
            y="33"
            textAnchor="middle"
            fontFamily={SANS}
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.5"
            fill="#fff"
          >
            {initials}
          </text>
        </svg>
      )}
    </div>
  );
}

function Header({
  data,
  config,
  reduce,
}: {
  data: CVData;
  config: CVDocConfig;
  reduce: boolean;
}) {
  const anim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: reduce ? 0 : 0.6, ease: [0.21, 0.5, 0.3, 1] as const },
  };

  const initials = data.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // 1 — Full-bleed gradient band with an eyebrow + corner emblem (PDF-style).
  if (config.headerDir === 1) {
    return (
      <motion.header
        className="relative overflow-hidden px-10 py-8 text-white"
        style={{ background: HEADER_SOLID, minHeight: 200 }}
        {...anim}
      >
        <Emblem
          type={config.emblem}
          initials={initials}
          className="absolute right-9 top-8"
        />
        <div className="relative flex h-full flex-col justify-between gap-6">
          <div>
            <Ed
              as="p"
              path="title"
              className="text-[11px] font-semibold uppercase tracking-[0.32em]"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {data.title}
            </Ed>
            <Ed
              as="h1"
              path="name"
              className="mt-2 text-[42px] font-bold leading-none tracking-tight"
            >
              {data.name}
            </Ed>
          </div>
          <Contact data={data} tone="light" linkStyle={config.linkStyle} />
        </div>
      </motion.header>
    );
  }

  // 2 — Minimal light: gradient-clip name on white, thin gradient rule.
  if (config.headerDir === 2) {
    return (
      <motion.header className="px-10 pt-9 pb-7" {...anim}>
        <Ed
          as="h1"
          path="name"
          className="text-[44px] font-extrabold leading-none tracking-tight"
          style={{
            background: DUSK,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            width: "fit-content",
          }}
        >
          {data.name}
        </Ed>
        <div className="mt-2 h-[3px] w-24 rounded-full" style={{ background: DUSK }} />
        <Ed
          as="p"
          path="title"
          className="mt-3 text-[15px] font-semibold"
          style={{ color: INK }}
        >
          {data.title}
        </Ed>
        <div className="mt-3">
          <Contact data={data} tone="dark" linkStyle={config.linkStyle} />
        </div>
      </motion.header>
    );
  }

  // 3 — Slim gradient top bar, then dark name on white.
  if (config.headerDir === 3) {
    return (
      <motion.header {...anim}>
        <div className="h-2.5 w-full" style={{ background: DUSK }} />
        <div className="flex flex-wrap items-end justify-between gap-4 px-10 pt-7 pb-6">
          <div>
            <Ed
              as="h1"
              path="name"
              className="text-[40px] font-bold leading-none tracking-tight"
              style={{ color: INK }}
            >
              {data.name}
            </Ed>
            <Ed
              as="p"
              path="title"
              className="mt-2 text-[14px] font-semibold"
              style={{ color: BLUE }}
            >
              {data.title}
            </Ed>
          </div>
          <Contact data={data} tone="dark" linkStyle={config.linkStyle} align="right" />
        </div>
      </motion.header>
    );
  }

  // 4 — Asymmetric: gradient block (left) holds the name; white panel (right).
  if (config.headerDir === 4) {
    return (
      <motion.header className="grid grid-cols-[1.1fr_1fr]" {...anim}>
        <div
          className="relative flex items-center overflow-hidden px-9 py-9 text-white"
          style={{ background: DUSK, minHeight: 190 }}
        >
          <Emblem
            type={config.emblem}
            initials={initials}
            className="absolute right-6 top-6"
          />
          <Ed
            as="h1"
            path="name"
            className="text-[40px] font-bold leading-[1.05] tracking-tight"
          >
            {data.name}
          </Ed>
        </div>
        <div className="flex flex-col justify-center gap-3 px-8 py-9">
          <Ed
            as="p"
            path="title"
            className="text-[16px] font-semibold"
            style={{ color: INK }}
          >
            {data.title}
          </Ed>
          <Contact data={data} tone="dark" linkStyle={config.linkStyle} />
        </div>
      </motion.header>
    );
  }

  // 5 — Monogram split: gradient rounded square with initials + name beside.
  return (
    <motion.header className="flex flex-wrap items-center gap-6 px-10 pt-9 pb-7" {...anim}>
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-[30px] font-bold text-white"
        style={{ background: DUSK }}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <Ed
          as="h1"
          path="name"
          className="text-[38px] font-bold leading-none tracking-tight"
          style={{ color: INK }}
        >
          {data.name}
        </Ed>
        <Ed
          as="p"
          path="title"
          className="mt-1.5 text-[14px] font-semibold"
          style={{ color: BLUE }}
        >
          {data.title}
        </Ed>
        <div className="mt-2.5">
          <Contact data={data} tone="dark" linkStyle={config.linkStyle} />
        </div>
      </div>
    </motion.header>
  );
}

/* ============================ CONTACT + LINKS ============================ */

function Contact({
  data,
  tone,
  linkStyle,
  align = "left",
}: {
  data: CVData;
  tone: "light" | "dark";
  linkStyle: LinkStyle;
  align?: "left" | "right";
}) {
  const txt = tone === "light" ? "rgba(255,255,255,0.92)" : "#475569";
  const strong = tone === "light" ? "#fff" : INK;
  const dim = tone === "light" ? "rgba(255,255,255,0.6)" : GRAY;
  const linkColor = tone === "light" ? "#fff" : BLUE;
  const pillBg = tone === "light" ? "rgba(255,255,255,0.16)" : "#eef2fb";
  const pillBorder =
    tone === "light" ? "rgba(255,255,255,0.22)" : "rgba(59,91,255,0.18)";
  const pillText = tone === "light" ? "#fff" : "#3a4a6b";
  const justify = align === "right" ? "justify-end" : "";

  return (
    <div className={cn("space-y-2", align === "right" && "text-right")}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px]",
          justify,
        )}
        style={{ color: txt }}
      >
        <span className="flex items-center gap-1.5">
          <Mail size={13} strokeWidth={2} style={{ opacity: 0.85 }} />
          <Ed path="email">{data.email}</Ed>
        </span>
        <span className="flex items-center gap-1.5">
          <Phone size={13} strokeWidth={2} style={{ opacity: 0.85 }} />
          <Ed path="phone">{data.phone}</Ed>
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={13} strokeWidth={2} style={{ opacity: 0.85 }} />
          <Ed path="location">{data.location}</Ed>
        </span>
      </div>

      {linkStyle === 1 ? (
        <div
          className={cn(
            "flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px]",
            justify,
          )}
          style={{ color: txt }}
        >
          {data.links.map((l, li) => (
            <a
              key={l.href}
              href={l.href}
              className="flex items-center gap-1.5 underline-offset-2 hover:underline"
              style={{ color: linkColor }}
            >
              {iconFor(l.label)}
              <Ed path={`links.${li}.display`}>{l.display}</Ed>
            </a>
          ))}
        </div>
      ) : null}

      {linkStyle === 2 ? (
        <div
          className={cn(
            "flex flex-wrap items-center gap-x-5 gap-y-1 text-[11.5px]",
            justify,
          )}
        >
          {data.links.map((l, li) => (
            <span key={l.href} className="flex items-baseline gap-1.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: dim }}
              >
                {l.label}
              </span>
              <a
                href={l.href}
                className="underline-offset-2 hover:underline"
                style={{ color: strong }}
              >
                <Ed path={`links.${li}.display`}>{l.display}</Ed>
              </a>
            </span>
          ))}
        </div>
      ) : null}

      {linkStyle === 3 ? (
        <div className={cn("flex flex-wrap items-center gap-2", justify)}>
          {data.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium"
              style={{
                background: pillBg,
                color: pillText,
                border: `1px solid ${pillBorder}`,
              }}
            >
              {iconFor(l.label, 12)}
              {l.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ============================ SIDE-PROJECT TECH (3 styles) ============================ */

function ProjectTech({
  tech,
  style,
  projectIndex,
}: {
  tech: string[];
  style: TechStyle;
  projectIndex: number;
}) {
  // 1 — Plain dotted text (lightest; clears the clash with the skills pills).
  if (style === 1) {
    return (
      <p className="mt-1 text-[10.5px]" style={{ color: GRAY }}>
        {tech.map((t, k) => (
          <span key={k}>
            {k > 0 ? "  ·  " : ""}
            <Ed path={`projects.${projectIndex}.tech.${k}`}>{t}</Ed>
          </span>
        ))}
      </p>
    );
  }
  // 2 — Mono "stack:" line.
  if (style === 2) {
    return (
      <p
        className="mt-1 text-[10px]"
        style={{
          color: GRAY,
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        }}
      >
        <span style={{ color: "#94a3b8" }}>stack: </span>
        {tech.map((t, k) => (
          <span key={k}>
            {k > 0 ? ", " : ""}
            <Ed path={`projects.${projectIndex}.tech.${k}`}>{t}</Ed>
          </span>
        ))}
      </p>
    );
  }
  // 3 — Tiny outline (ghost) chips — distinct from the filled skills pills.
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {tech.map((t, k) => (
        <span
          key={k}
          className="rounded px-1.5 py-px text-[9.5px] font-medium"
          style={{ color: "#5a6b8c", border: "1px solid #dde3ef" }}
        >
          <Ed path={`projects.${projectIndex}.tech.${k}`}>{t}</Ed>
        </span>
      ))}
    </div>
  );
}

/* ============================ SHARED BITS ============================ */

function Heading({ path, children }: { path: string; children: ReactNode }) {
  return (
    <h2
      className="cv-h mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em]"
      style={{ color: INK }}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: ACCENT }} />
      <Ed path={path}>{children}</Ed>
    </h2>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-medium"
      style={{ background: "#eef2fb", color: "#3a4a6b" }}
    >
      {children}
    </span>
  );
}

function EntryList({
  entries,
  basePath,
}: {
  entries: CVEntry[];
  basePath: string;
}) {
  return (
    <ul className="space-y-1.5 text-[11.5px] leading-snug" style={{ color: GRAY }}>
      {entries.map((e, i) => (
        <li key={e.title}>
          <Ed
            path={`${basePath}.${i}.title`}
            className="font-semibold"
            style={{ color: INK }}
          >
            {e.title}
          </Ed>
          {e.detail ? (
            <>
              {" — "}
              <Ed path={`${basePath}.${i}.detail`}>{e.detail}</Ed>
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

// Small status badge shown beside a project title (e.g. "In development",
// "Acquired ’24").
function ProjectBadge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "success" | "amber";
  children: ReactNode;
}) {
  const palette = {
    neutral: { bg: "#eef1f6", color: "#475569" },
    success: { bg: "#e7f6ee", color: "#0f7a4a" },
    amber: { bg: "#fdf2e2", color: "#9a6711" },
  }[tone];
  return (
    <span
      className="shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[9.5px] font-semibold"
      style={{ background: palette.bg, color: palette.color }}
    >
      {children}
    </span>
  );
}
