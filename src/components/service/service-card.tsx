import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Service } from "@/lib/services";
import { formatINR } from "@/lib/utils";

export function ServiceCard({
  service,
  showGroup = true,
}: {
  service: Service;
  showGroup?: boolean;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/5"
    >
      {showGroup && <Badge>{service.group}</Badge>}
      <h3 className="mt-4 font-display text-xl tracking-tight first:mt-0">
        {service.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.short}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Clock className="size-3.5" aria-hidden />
          {service.timeline}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-strong">
          {service.price ? formatINR(service.price) : "Details"}
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
