"use client";

import { EligibilityQuiz } from "@/components/tools/eligibility-quiz";
import {
  fundingInitialAnswers,
  fundingQuestions,
  matchFundingSchemes,
  type FundingAnswers,
} from "@/lib/eligibility/funding";

export function FundingEligibilityChecker() {
  return (
    <EligibilityQuiz<FundingAnswers>
      eyebrow="Eligibility checker"
      title="Funding Eligibility Checker"
      description="Answer five quick questions about your business to see which funding routes are worth pursuing."
      disclaimer="A directional guide, not a lending decision — actual eligibility depends on your financials, credit history and the specific lender or investor's criteria."
      questions={fundingQuestions}
      initialAnswers={fundingInitialAnswers}
      evaluate={matchFundingSchemes}
      ctaHref="/services/fundraising"
      ctaLabel="Talk to our funding & loans team"
    />
  );
}
