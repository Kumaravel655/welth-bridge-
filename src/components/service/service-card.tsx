"use client";

import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
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
  const cardRef = React.useRef<HTMLAnchorElement>(null);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      cardRef.current.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
      // Position the gradient glow at cursor position
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      cardRef.current.style.setProperty("--glow-x", `${px}%`);
      cardRef.current.style.setProperty("--glow-y", `${py}%`);
    },
    []
  );

  const handleMouseLeave = React.useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "";
    cardRef.current.style.removeProperty("--glow-x");
    cardRef.current.style.removeProperty("--glow-y");
  }, []);

  return (
    <Link
      ref={cardRef}
      href={`/services/${service.slug}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 will-change-transform hover:border-accent/50 hover:shadow-xl hover:shadow-accent/[0.06]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Unique per-service image, unified with a subtle brand wash */}
      <div className="relative h-48 shrink-0 overflow-hidden">
        <Image
          src={`/images/services/${service.slug}.jpg`}
          alt={service.name}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center saturate-[1.05] contrast-[1.03] transition-transform duration-700 group-hover:scale-[1.08]"
        />
        {/* Brand wash: soft ink at the top for depth, fade to the card at the bottom */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--card) 0%, transparent 34%, transparent 74%, oklch(0.20 0.038 250 / 0.30) 100%)",
          }}
        />
      </div>

      {/* Hover glow that follows the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), oklch(0.78 0.145 75 / 0.06), transparent 60%)",
        }}
      />

      <div className="relative flex flex-1 flex-col p-6">
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
              className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
              aria-hidden
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
