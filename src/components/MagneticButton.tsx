"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  /** Attraction strength — 0 to 1, default 0.35 */
  strength?: number;
}

export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Disable on touch-primary devices
      if (window.matchMedia("(hover: none)").matches) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)";
    // Remove transition after spring-back
    const t = setTimeout(() => {
      if (el) el.style.transition = "";
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const sharedProps = {
    ref,
    onMouseMove,
    onMouseLeave,
    className: cn(
      "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm",
      "transition-colors duration-200 will-change-transform cursor-pointer",
      className
    ),
    style: { willChange: "transform" } as React.CSSProperties,
  };

  if (href) {
    return (
      <a href={href} {...sharedProps}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} {...sharedProps}>
      {children}
    </button>
  );
}
