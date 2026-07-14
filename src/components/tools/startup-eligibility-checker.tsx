"use client";

import { EligibilityQuiz } from "@/components/tools/eligibility-quiz";
import {
  evaluateStartupEligibility,
  startupInitialAnswers,
  startupQuestions,
  type StartupAnswers,
} from "@/lib/eligibility/startup";

export function StartupEligibilityChecker() {
  return (
    <EligibilityQuiz<StartupAnswers>
      eyebrow="Eligibility checker"
      title="Startup Eligibility Checker"
      description="Answer five quick questions to see if your business qualifies for DPIIT Startup Recognition."
      disclaimer="Based on current DPIIT Startup Recognition criteria. Rules are set by the government and can change — we'll confirm your exact eligibility before you apply."
      questions={startupQuestions}
      initialAnswers={startupInitialAnswers}
      evaluate={evaluateStartupEligibility}
      ctaHref="/services/private-limited-company"
      ctaLabel="Talk to us about incorporation and DPIIT recognition"
    />
  );
}
