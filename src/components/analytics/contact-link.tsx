"use client";

import { track } from "@/lib/analytics";

export function ContactLink({
  href,
  channel,
  children,
  className,
  onClick,
  ...rest
}: {
  href: string;
  channel: "email" | "linkedin";
  children: React.ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      data-analytics-skip-outbound
      className={className}
      onClick={(e) => {
        track({ name: "contact_click", props: { content_type: "contact", channel, category: "professional" } });
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
