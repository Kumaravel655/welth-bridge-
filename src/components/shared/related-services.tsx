import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { ServiceCard } from "@/components/service/service-card";
import { getService } from "@/lib/services";

export function RelatedServices({
  slugs,
  heading = "Related services",
  className,
}: {
  slugs: string[];
  heading?: string;
  className?: string;
}) {
  const items = slugs
    .map((slug) => getService(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  if (items.length === 0) return null;

  return (
    <section className={className}>
      <Reveal>
        <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{heading}</h2>
      </Reveal>
      <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <Reveal key={s.slug} className="h-full">
            <ServiceCard service={s} />
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
