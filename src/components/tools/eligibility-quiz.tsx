"use client";

import { ArrowRight, Check, X } from "lucide-react";
import * as React from "react";

import { CalculatorShell } from "@/components/tools/calculator-shell";
import { cn } from "@/lib/utils";
import type { EligibilityResult, QuizQuestion } from "@/lib/eligibility/types";

export function EligibilityQuiz<TAnswers extends Record<string, string>>({
  eyebrow,
  title,
  description,
  disclaimer,
  questions,
  initialAnswers,
  evaluate,
  ctaHref,
  ctaLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  disclaimer?: string;
  questions: QuizQuestion[];
  initialAnswers: TAnswers;
  evaluate: (answers: TAnswers) => EligibilityResult;
  ctaHref: string;
  ctaLabel: string;
}) {
  const [answers, setAnswers] = React.useState<TAnswers>(initialAnswers);
  const result = evaluate(answers);

  return (
    <CalculatorShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      disclaimer={disclaimer}
      inputs={
        <div className="space-y-7">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <p className="text-sm font-medium">{q.question}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={answers[q.id] === opt.value}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))
                    }
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm transition-colors",
                      answers[q.id] === opt.value
                        ? "border-accent bg-accent/10 text-accent-strong"
                        : "border-border text-muted-foreground hover:border-accent/50 hover:text-accent-strong"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
      results={
        <div>
          <div
            className={cn(
              "rounded-xl border p-4",
              result.eligible
                ? "border-accent/40 bg-accent/10"
                : "border-border bg-muted/50"
            )}
          >
            <p
              className={cn(
                "text-sm font-medium",
                result.eligible ? "text-accent-strong" : "text-foreground"
              )}
            >
              {result.headline}
            </p>
          </div>

          <ul className="mt-5 space-y-3">
            {result.checks.map((check) => (
              <li key={check.label} className="flex gap-2.5 text-sm">
                {check.pass ? (
                  <Check className="mt-0.5 size-4 shrink-0 text-accent-strong" aria-hidden />
                ) : (
                  <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                )}
                <div>
                  <p className={check.pass ? "text-foreground" : "text-muted-foreground"}>
                    {check.label}
                  </p>
                  {check.detail ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{check.detail}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            {result.recommendation}
          </p>

          <a
            href={ctaHref}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong hover:underline"
          >
            {ctaLabel}
            <ArrowRight className="size-3.5" aria-hidden />
          </a>
        </div>
      }
    />
  );
}
