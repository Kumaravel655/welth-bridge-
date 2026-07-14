import { cn } from "@/lib/utils";

/**
 * Larger generated scenes for narrative pages (About, Contact, Home).
 * Same ink + blue treatment as CategoryArt so the whole site reads as
 * one illustrated system. Vector, theme-safe, and tiny.
 */

export type SceneVariant = "skyline" | "workspace" | "map";

const STROKE = {
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

function Skyline() {
  return (
    <g stroke="currentColor" {...STROKE}>
      {/* rising sun */}
      <circle cx="372" cy="96" r="26" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.12} />
      {/* skyline */}
      <g opacity={0.75}>
        <path d="M40 210 V150 H84 V210" />
        <path d="M84 210 V120 H128 V210" />
        <path d="M128 210 V168 H160 V210" />
        <path d="M300 210 V138 H342 V210" />
        <path d="M342 210 V172 H382 V210" />
        <path d="M382 210 V150 H424 V210" />
      </g>
      {/* windows */}
      <g stroke="var(--accent)" opacity={0.7}>
        <path d="M100 140 v0 M100 160 v0 M112 140 v0 M112 160 v0" strokeWidth={4} />
        <path d="M320 158 v0 M320 178 v0 M332 158 v0" strokeWidth={4} />
      </g>
      {/* ground */}
      <line x1="24" y1="210" x2="456" y2="210" opacity={0.4} />
      {/* suspension bridge in front (the signature) */}
      <g>
        <line x1="176" y1="210" x2="176" y2="150" stroke="currentColor" opacity={0.6} />
        <line x1="288" y1="210" x2="288" y2="150" stroke="currentColor" opacity={0.6} />
        <path d="M120 210 C 150 176, 168 154, 176 152 Q 232 214 288 152 C 296 154, 314 176, 344 210" stroke="var(--accent)" />
        <line x1="120" y1="210" x2="344" y2="210" stroke="var(--accent)" strokeWidth={3} />
        {[150, 204, 232, 260, 314].map((x) => (
          <line key={x} x1={x} y1="208" x2={x} y2={x === 232 ? 176 : 168} stroke="var(--accent)" strokeWidth={1.25} opacity={0.5} />
        ))}
      </g>
    </g>
  );
}

function Workspace() {
  return (
    <g stroke="currentColor" {...STROKE}>
      {/* desk */}
      <line x1="40" y1="238" x2="440" y2="238" opacity={0.4} />
      {/* document stack with approved check */}
      <g opacity={0.85}>
        <path d="M96 238 V150 H176 L196 170 V238 Z" />
        <path d="M176 150 V170 H196" opacity={0.5} />
        <line x1="114" y1="188" x2="178" y2="188" opacity={0.4} />
        <line x1="114" y1="206" x2="178" y2="206" opacity={0.4} />
      </g>
      <g stroke="var(--accent)">
        <circle cx="150" cy="146" r="18" fill="var(--ink-raised)" />
        <path d="M142 146 l6 6 l10 -13" />
      </g>
      {/* laptop */}
      <g opacity={0.85}>
        <path d="M250 238 V176 H360 V238" />
        <line x1="236" y1="238" x2="374" y2="238" />
        <line x1="272" y1="196" x2="338" y2="196" stroke="var(--accent)" opacity={0.7} />
        <line x1="272" y1="212" x2="322" y2="212" opacity={0.4} />
      </g>
      {/* desk lamp */}
      <g stroke="currentColor" opacity={0.8}>
        <path d="M406 238 h28 M420 238 V150 l-26 -20" />
        <circle cx="388" cy="126" r="12" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.15} />
      </g>
      {/* plant */}
      <g stroke="var(--accent)" opacity={0.85}>
        <path d="M60 238 V212 M60 224 q-14 -4 -16 -20 q16 2 16 20 M60 220 q14 -6 16 -22 q-16 2 -16 22" />
      </g>
    </g>
  );
}

function MapScene() {
  return (
    <g stroke="currentColor" {...STROKE}>
      {/* road grid */}
      <g opacity={0.35}>
        <path d="M40 90 H440" />
        <path d="M40 160 H440" />
        <path d="M40 230 H440" />
        <path d="M130 50 V262" />
        <path d="M250 50 V262" />
        <path d="M360 50 V262" />
      </g>
      {/* river */}
      <path d="M40 120 C 140 150, 180 90, 260 130 S 400 180, 460 150" stroke="var(--accent)" opacity={0.3} strokeWidth={6} />
      {/* connecting route */}
      <path d="M130 100 L250 190 L360 120" stroke="var(--accent)" strokeDasharray="6 8" opacity={0.7} />
      {/* three office pins */}
      {[
        [130, 100],
        [250, 190],
        [360, 120],
      ].map(([x, y], i) => (
        <g key={i} stroke="var(--accent)">
          <path
            d={`M${x} ${y - 30} c-14 0 -24 10 -24 24 c0 16 24 34 24 34 c0 0 24 -18 24 -34 c0 -14 -10 -24 -24 -24Z`}
            fill="var(--accent)"
            fillOpacity={0.16}
          />
          <circle cx={x} cy={y - 6} r="7" fill="var(--ink)" />
        </g>
      ))}
    </g>
  );
}

const SCENES: Record<SceneVariant, () => React.ReactElement> = {
  skyline: Skyline,
  workspace: Workspace,
  map: MapScene,
};

const LABELS: Record<SceneVariant, string> = {
  skyline: "Illustration: a city skyline with a suspension bridge in front",
  workspace: "Illustration: a desk with documents, a laptop and a lamp",
  map: "Illustration: a map marking three office locations",
};

export function SceneArt({
  variant,
  className,
  decorative = false,
}: {
  variant: SceneVariant;
  className?: string;
  decorative?: boolean;
}) {
  const Scene = SCENES[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-ink text-ink-foreground",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 75% 0%, oklch(0.55 0.15 256 / 0.14), transparent 55%), linear-gradient(160deg, var(--ink-raised), var(--ink))",
        }}
      />
      <svg aria-hidden className="absolute inset-0 size-full opacity-[0.3]">
        <defs>
          <pattern id={`sg-${variant}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="currentColor" opacity={0.16} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#sg-${variant})`} />
      </svg>

      <svg
        viewBox="0 0 480 300"
        className="relative size-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={decorative ? undefined : LABELS[variant]}
        aria-hidden={decorative || undefined}
      >
        <Scene />
      </svg>
    </div>
  );
}
