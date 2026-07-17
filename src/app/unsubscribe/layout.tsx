import type { Metadata } from "next";

// Token-gated one-shot page from newsletter emails — thin content, noindex.
export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default function UnsubscribeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
