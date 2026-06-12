import { motion } from "framer-motion";
import { Check, Circle, Clock, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStepStatus = "complete" | "current" | "pending";

export interface TimelineStep {
  key: string;
  label: string;
  status: TimelineStepStatus;
  timestamp?: string;
  location?: string;
  note?: string;
  icon?: LucideIcon;
}

interface ShipmentTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function ShipmentTimeline({ steps, className }: ShipmentTimelineProps) {
  return (
    <ol className={cn("relative space-y-0", className)}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const Icon = step.icon ?? (step.status === "complete" ? Check : step.status === "current" ? Clock : Circle);
        return (
          <motion.li
            key={step.key}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[19px] top-10 bottom-0 w-px",
                  step.status === "complete" ? "bg-primary" : "bg-border"
                )}
              />
            )}
            <div className="relative z-10 shrink-0">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  step.status === "complete" && "bg-primary border-primary text-[hsl(var(--primary-foreground))]",
                  step.status === "current" && "bg-background border-primary text-foreground shadow-glow",
                  step.status === "pending" && "bg-background border-border text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={2.5} />
              </div>
              {step.status === "current" && (
                <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" aria-hidden />
              )}
            </div>
            <div className={cn("flex-1 pt-1.5 min-w-0", step.status === "pending" && "opacity-60")}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <h4 className={cn(
                  "text-sm sm:text-base font-semibold",
                  step.status !== "pending" ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </h4>
                {step.timestamp && (
                  <time className="text-xs font-mono-track text-muted-foreground tabular-nums">
                    {step.timestamp}
                  </time>
                )}
              </div>
              {step.location && <p className="mt-1 text-sm text-muted-foreground">{step.location}</p>}
              {step.note && (
                <p className="mt-2 text-sm text-foreground/80 bg-muted/60 rounded-lg px-3 py-2 border border-border">
                  {step.note}
                </p>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
