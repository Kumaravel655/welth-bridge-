import { CalendarClock } from "lucide-react";

import type { ComplianceDeadline } from "@/lib/compliance-calendar";

export function DeadlineCard({ deadline }: { deadline: ComplianceDeadline }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-border bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/[0.08]">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
          <CalendarClock className="size-5" aria-hidden />
        </span>
        <span className="rounded-full border border-border px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
          {deadline.frequency}
        </span>
      </div>
      <h2 className="mt-4 font-display text-xl tracking-tight">{deadline.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {deadline.description}
      </p>
      <div className="mt-5 space-y-2 border-t border-border pt-4">
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Due date</span>
          <span className="text-right font-medium">{deadline.dueDate}</span>
        </div>
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Applies to</span>
          <span className="text-right">{deadline.appliesTo}</span>
        </div>
      </div>
    </div>
  );
}
