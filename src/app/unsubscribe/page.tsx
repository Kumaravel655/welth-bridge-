"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";

// Target of the "Unsubscribe" link in newsletter emails. Lives outside /api
// so nginx routes it to Next.js; the actual unsubscribe call goes through
// /api/public/*, which reaches the backend both in dev (proxy) and prod
// (nginx direct).
type State = "working" | "done" | "invalid" | "error";

function UnsubscribeContent() {
  const token = useSearchParams().get("token");
  const [state, setState] = React.useState<State>(token ? "working" : "invalid");

  React.useEffect(() => {
    if (!token) return;
    fetch(`/api/public/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
    })
      .then((res) => setState(res.ok ? "done" : "invalid"))
      .catch(() => setState("error"));
  }, [token]);

  const copy: Record<State, { title: string; message: string }> = {
    working: { title: "One moment…", message: "Processing your request." },
    done: {
      title: "You're unsubscribed",
      message:
        "You won't receive our newsletter anymore. Changed your mind? Subscribe again anytime from the site footer.",
    },
    invalid: {
      title: "Invalid link",
      message: "This unsubscribe link isn't recognised. It may have already been used.",
    },
    error: {
      title: "Something went wrong",
      message: "We couldn't process this right now — please try again in a few minutes.",
    },
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent-strong">
        The Wealth Bridge
      </p>
      <h1 className="mt-3 font-display text-2xl tracking-tight">{copy[state].title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{copy[state].message}</p>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <React.Suspense fallback={null}>
      <UnsubscribeContent />
    </React.Suspense>
  );
}
