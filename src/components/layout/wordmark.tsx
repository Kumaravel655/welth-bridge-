"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <Link
      href="/"
      className={cn(
        "group relative inline-flex items-center overflow-hidden rounded-md",
        className
      )}
      aria-label="The Wealth Bridge — home"
    >
      <motion.span
        className="inline-flex"
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, x: -14 },
              animate: { opacity: 1, x: 0 },
              transition: { type: "spring", stiffness: 220, damping: 26 },
            })}
      >
        <Image
          src="/logo.png"
          alt="The Wealth Bridge — Making More Possibilities"
          width={409}
          height={100}
          priority
          className="h-9 w-auto invert transition-transform duration-300 group-hover:scale-[1.03] sm:h-10"
        />
      </motion.span>

      {/* Sheen sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-[130%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%] motion-reduce:hidden"
      />
    </Link>
  );
}
