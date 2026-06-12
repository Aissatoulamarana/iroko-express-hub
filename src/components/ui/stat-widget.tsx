import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatWidgetProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: number; label?: string };
  tone?: "brand" | "success" | "info" | "warning" | "danger" | "neutral";
  className?: string;
  loading?: boolean;
}

const toneStyles: Record<string, string> = {
  brand: "bg-primary/15 text-[hsl(var(--primary-foreground))]",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

export function StatWidget({ label, value, icon: Icon, trend, tone = "neutral", className, loading }: StatWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn("card-premium card-premium-hover p-5 sm:p-6", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {loading ? (
            <div className="mt-3 h-8 w-24 animate-pulse rounded-md bg-muted" />
          ) : (
            <p className="mt-2 text-3xl font-display font-bold tracking-tight text-foreground tabular-nums">
              {value}
            </p>
          )}
          {trend && !loading && (
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {trend.value >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-success" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-destructive" />
              )}
              <span className={cn("font-semibold", trend.value >= 0 ? "text-success" : "text-destructive")}>
                {trend.value >= 0 ? "+" : ""}{trend.value}%
              </span>
              {trend.label && <span className="text-muted-foreground">{trend.label}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl shrink-0", toneStyles[tone])}>
            <Icon className="w-5 h-5" strokeWidth={2.2} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
