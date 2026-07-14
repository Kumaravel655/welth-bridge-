"use client";

import { useReducedMotion } from "motion/react";
import * as React from "react";

const CHAR_DELAY = 30;

/** Splits text on \n into lines, then animates each character in on a stagger. */
export function AnimatedHeading({
  text,
  initialDelay = 200,
  className,
  style,
  as: Tag = "h1",
}: {
  text: string;
  initialDelay?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  const [started, setStarted] = React.useState(!!reduce);
  const lines = React.useMemo(() => text.split("\n"), [text]);

  React.useEffect(() => {
    if (reduce) return;
    const timer = setTimeout(() => setStarted(true), initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay, reduce]);

  return (
    <Tag className={className} style={style}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block whitespace-nowrap">
          {line.split("").map((char, charIndex) => {
            const delay =
              lineIndex * line.length * CHAR_DELAY + charIndex * CHAR_DELAY;
            return (
              <span
                key={charIndex}
                className="inline-block transition-[opacity,transform] duration-500 ease-out"
                style={{
                  opacity: started ? 1 : 0,
                  transform: started ? "translateX(0)" : "translateX(-18px)",
                  transitionDelay: `${delay}ms`,
                }}
              >
                {char === " " ? " " : char}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
