import { Counter } from "@/components/motion/counter";
import { cn } from "@/lib/utils";

export function ResultCard({
  label,
  value,
  prefix = "",
  suffix = "",
  emphasis = false,
  className,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0",
        className
      )}
    >
      <span
        className={cn(
          "text-sm",
          emphasis ? "font-medium text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-display tabular-nums",
          emphasis ? "text-2xl text-accent-strong" : "text-base"
        )}
      >
        {prefix}
        <Counter to={value} suffix={suffix} />
      </span>
    </div>
  );
}
