import { cn } from "@/lib/utils";

interface CtaButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

// Plain CTA button/link with a restrained hover (2px lift) and press feedback.
// Motion is purely CSS and is disabled under prefers-reduced-motion.
export default function CtaButton({ children, className, href, onClick }: CtaButtonProps) {
  const sharedProps = {
    className: cn(
      "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm cursor-pointer",
      "transition-[transform,background-color,border-color,color] duration-200",
      "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
      "motion-reduce:transform-none motion-reduce:transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className
    ),
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
