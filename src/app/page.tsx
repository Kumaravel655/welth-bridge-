import type { Metadata } from "next";

import { BrandFilm } from "@/components/sections/brand-film";
import { CTA } from "@/components/sections/cta";
import { FAQ } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { Values } from "@/components/sections/values";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <BrandFilm />
      <ServicesShowcase />
      <Values />
      <Testimonials />
      <Process />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
