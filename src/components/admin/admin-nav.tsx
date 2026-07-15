"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/portal-api";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/portal/sign-in");
    router.refresh();
  }

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-strong">
            <ShieldCheck className="size-3.5" aria-hidden />
            Admin
          </span>
          <nav className="flex flex-wrap items-center gap-1">
            {LINKS.map((link) => {
              const active =
                link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
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
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut aria-hidden />
          Sign out
        </Button>
      </div>
    </div>
  );
}
