import type { FlowStep } from "@/data/stories";

interface FlowChainProps {
  steps: FlowStep[];
}

export function FlowChain({ steps }: FlowChainProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-center">
            <div className="text-sm font-medium text-foreground">{step.label}</div>
            {step.sublabel && (
              <div className="text-[10px] text-muted-foreground mt-0.5">{step.sublabel}</div>
            )}
          </div>
          {i < steps.length - 1 && (
            <span className="text-muted-foreground text-sm select-none">→</span>
          )}
        </div>
      ))}
    </div>
  );
}
