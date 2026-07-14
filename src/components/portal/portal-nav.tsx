"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/portal-api";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/requests", label: "Requests" },
  { href: "/portal/consultations", label: "Consultations" },
];

export function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/portal/sign-in");
    router.refresh();
  }

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/portal" ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent/10 text-accent-strong"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut aria-hidden />
          Sign out
        </Button>
      </div>
    </div>
  );
}
