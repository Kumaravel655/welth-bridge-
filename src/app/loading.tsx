export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-ink px-4">
      <div className="relative">
        {/* Marigold glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] max-w-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.145 75 / 0.10) 0%, transparent 62%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand-reveal.gif"
          alt="Loading The Wealth Bridge"
          width={480}
          height={214}
          className="relative h-auto w-[min(84vw,420px)] select-none"
        />
      </div>
      <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-muted">
        Making more possibilities…
      </p>
    </div>
  );
}
