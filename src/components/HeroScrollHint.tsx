"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

// Bouncing scroll hint anchored to the hero bottom. Golden (matches the card
// spotlight color via --spotlight-rgb, so it adapts per theme). Clicking it
// smooth-scrolls to the next section; it fades out as soon as the user scrolls,
// so it reads as a first-glance hint and doesn't linger next to the mobile dock.
export default function HeroScrollHint({ targetId = "about" }: { targetId?: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      aria-label="Scroll to content"
      className="hero-scroll-hint absolute bottom-6 left-1/2 z-10 hover:opacity-100"
      style={{
        color: "rgb(var(--spotlight-rgb))",
        opacity: visible ? 0.8 : 0,
        transition: "opacity 300ms ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <ChevronDown className="size-7" />
    </a>
  );
}
