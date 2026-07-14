export type QuizOption = { value: string; label: string };

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

export type EligibilityCheck = {
  label: string;
  pass: boolean;
  detail?: string;
};

export type EligibilityResult = {
  eligible: boolean;
  headline: string;
  checks: EligibilityCheck[];
  recommendation: string;
};
