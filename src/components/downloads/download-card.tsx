import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

import type { Download } from "@/lib/downloads";

export function DownloadCard({ download }: { download: Download }) {
  return (
    <Link
      href={`/downloads/${download.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/[0.06]"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
        <FileText className="size-5" aria-hidden />
      </span>
      <h2 className="mt-4 font-display text-xl tracking-tight">{download.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {download.description}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="font-mono text-xs text-muted-foreground">
          PDF &middot; {download.fileSizeLabel}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-strong">
          Download
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
