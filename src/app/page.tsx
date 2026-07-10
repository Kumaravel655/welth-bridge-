import { BrandFilm } from "@/components/sections/brand-film";
import { CTA } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { Values } from "@/components/sections/values";

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
      <CTA />
    </>
  );
}
