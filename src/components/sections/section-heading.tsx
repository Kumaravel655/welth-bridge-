import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  onInk = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
  onInk?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      <p
        className={cn(
          "font-mono text-xs uppercase tracking-[0.16em]",
          onInk ? "text-[var(--accent)]" : "text-accent-strong"
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-3 font-display text-3xl leading-[1.12] tracking-tight sm:text-4xl md:text-[2.75rem]",
          onInk ? "text-ink-foreground" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            onInk ? "text-ink-muted" : "text-muted-foreground"
          )}
        >
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
