import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/services";

export function FaqAccordion({
  heading,
  items,
  className,
}: {
  /** Omit when a heading is already rendered above (e.g. via SectionHeading). */
  heading?: string;
  items: FaqItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className={className}>
      {heading ? (
        <Reveal>
          <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{heading}</h2>
        </Reveal>
      ) : null}
      <Reveal>
        <Accordion type="single" collapsible className="mt-6">
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
