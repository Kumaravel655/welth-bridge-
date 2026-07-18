import {
  ArrowRight,
  Calculator,
  HandCoins,
  Landmark,
  Percent,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import type { Tool } from "@/lib/tools";

const icons: Record<string, LucideIcon> = {
  "emi-calculator": Calculator,
  "gst-calculator": Percent,
  "income-tax-calculator": Landmark,
  "startup-eligibility-checker": Rocket,
  "funding-eligibility-checker": HandCoins,
};

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = icons[tool.slug] ?? Calculator;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/[0.06]"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-xl tracking-tight">{tool.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {tool.short}
      </p>
      <span className="mt-5 inline-flex items-center gap-1 border-t border-border pt-4 text-sm font-medium text-accent-strong">
        Try it
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
