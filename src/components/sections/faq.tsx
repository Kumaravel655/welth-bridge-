import { FaqAccordion, faqJsonLd } from "@/components/shared/faq-accordion";
import type { FaqItem } from "@/lib/services";

import { SectionHeading } from "./section-heading";

const homeFaqs: FaqItem[] = [
  {
    question: "How much do your services cost?",
    answer:
      "Every service has a transparent professional fee shown on its page, separate from any government fee. For anything that depends on your specific situation, book a free slot and ask — fee enquiries cost nothing, and we give you a firm quote before you commit to anything.",
  },
  {
    question: "How do I book a consultation slot?",
    answer:
      "Create a free account, then pick a date and time that suits you — Monday to Saturday, 10 am to 6 pm. Choose a phone call, video call, or an in-person visit at our Vellore, Arakkonam or Ranipet office. Our team confirms your slot and you'll get an email with the details.",
  },
  {
    question: "Is the first consultation really free?",
    answer:
      "Yes. The first consultation is free whatever you ask — a fee enquiry, which registrations you need, or a review of a notice you've received. An expert recommends the right service before any fee is discussed.",
  },
  {
    question: "How do I share documents with you?",
    answer:
      "You can send documents over WhatsApp, email, or in person at any of our offices. We verify each document before filing anything, and will tell you clearly if something's missing.",
  },
  {
    question: "Which areas do you serve?",
    answer:
      "We're based in Vellore, Tamil Nadu with branch offices in Arakkonam and Ranipet, but our registration, tax and compliance services are handled entirely online for clients anywhere in India.",
  },
  {
    question: "How long does registration or filing usually take?",
    answer:
      "It varies by service — most registrations take 3–20 working days depending on government processing times, and every service page states its typical timeline upfront.",
  },
  {
    question: "What happens after my service is complete?",
    answer:
      "We don't disappear after delivery. Ongoing compliance (GST filing, ROC returns, income tax) can be handled on a recurring basis, and we'll proactively remind you of upcoming deadlines.",
  },
];

export function FAQ() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered."
          lede="The things clients ask us most before getting started."
        />
        <FaqAccordion items={homeFaqs} className="mx-auto mt-10 max-w-3xl" />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(homeFaqs)) }}
      />
    </section>
  );
}
