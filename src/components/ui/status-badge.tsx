import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border transition-colors",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-muted-foreground border-border",
        info: "bg-info/10 text-info border-info/20",
        success: "bg-success/10 text-success border-success/20",
        warning: "bg-warning/10 text-[hsl(var(--warning-foreground))] border-warning/30",
        danger: "bg-destructive/10 text-destructive border-destructive/20",
        brand: "bg-primary/15 text-[hsl(var(--primary-foreground))] border-primary/30",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean;
  pulse?: boolean;
}

const dotColor: Record<string, string> = {
  neutral: "bg-muted-foreground",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  brand: "bg-primary",
};

export function StatusBadge({ className, tone = "neutral", size, dot, pulse, children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ tone, size }), className)} {...props}>
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", dotColor[tone ?? "neutral"])} />
          )}
          <span className={cn("relative inline-flex h-2 w-2 rounded-full", dotColor[tone ?? "neutral"])} />
        </span>
      )}
      {children}
    </span>
  );
}

export { statusBadgeVariants };
