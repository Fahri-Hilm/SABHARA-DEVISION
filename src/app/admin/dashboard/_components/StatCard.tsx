import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "warning" | "destructive";
  className?: string;
};

const VARIANT_CLASS: Record<NonNullable<StatCardProps["variant"]>, string> = {
  default: "border-cyan/30 text-cyan",
  warning: "border-warning/40 text-warning",
  destructive: "border-destructive/40 text-destructive",
};

export function StatCard({ label, value, icon: Icon, variant = "default", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card/80 p-4",
        VARIANT_CLASS[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={cn("rounded-md border p-2", VARIANT_CLASS[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
