"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The signature mark: a suspension bridge drawn in a single stroke,
 * its deck carrying the four waypoints every filing crosses.
 */

const CABLE =
  "M 40 170 C 130 150, 220 90, 300 52 Q 600 168 900 52 C 980 90, 1070 150, 1160 170";
const DECK = "M 40 170 L 1160 170";

const HANGERS: Array<[number, number]> = [
  [380, 79],
  [460, 97],
  [540, 108],
  [620, 110],
  [700, 104],
  [780, 89],
  [860, 66],
];

const WAYPOINT_X = [180, 460, 740, 1020];

export function Bridge({
  steps = ["Consult", "Documents", "Filing", "Registered"],
  className,
}: {
  steps?: string[];
  className?: string;
}) {
  const reduce = useReducedMotion();

  const draw = (duration: number, delay: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration, delay, ease: [0.65, 0, 0.35, 1] as const },
        };

  const pop = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { scale: 0, opacity: 0 },
          whileInView: { scale: 1, opacity: 1 },
          viewport: { once: true, margin: "-40px" },
          transition: {
            delay,
            type: "spring" as const,
            stiffness: 320,
            damping: 22,
          },
        };

  return (
    <figure className={className}>
      <svg
        viewBox="0 0 1200 240"
        fill="none"
        role="img"
        aria-labelledby="bridge-title"
        className="w-full"
      >
        <title id="bridge-title">
          {`The path across: ${steps.join(", ")}`}
        </title>

        {/* Towers */}
        {[300, 900].map((x, i) => (
          <motion.line
            key={x}
            x1={x}
            y1={170}
            x2={x}
            y2={48}
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeWidth={4}
            strokeLinecap="round"
            {...(reduce
              ? {}
              : {
                  initial: { scaleY: 0 },
                  whileInView: { scaleY: 1 },
                  viewport: { once: true, margin: "-40px" },
                  transition: { delay: 0.5 + i * 0.1, duration: 0.5 },
                  style: { transformOrigin: `${x}px 170px` },
                })}
          />
        ))}

        {/* Hangers */}
        {HANGERS.map(([x, y], i) => (
          <motion.line
            key={x}
            x1={x}
            y1={y}
            x2={x}
            y2={168}
            stroke="currentColor"
            strokeOpacity={0.28}
            strokeWidth={1.5}
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0 },
                  whileInView: { opacity: 1 },
                  viewport: { once: true, margin: "-40px" },
                  transition: { delay: 0.9 + i * 0.05, duration: 0.3 },
                })}
          />
        ))}

        {/* Deck */}
        <motion.path
          d={DECK}
          stroke="var(--accent)"
          strokeWidth={3.5}
          strokeLinecap="round"
          {...draw(1.1, 0)}
        />

        {/* Cable */}
        <motion.path
          d={CABLE}
          stroke="var(--accent)"
          strokeOpacity={0.85}
          strokeWidth={2.5}
          strokeLinecap="round"
          {...draw(1.4, 0.25)}
        />

        {/* Waypoints + labels */}
        {WAYPOINT_X.map((x, i) => (
          <motion.g key={x} {...pop(1.15 + i * 0.16)}>
            <circle cx={x} cy={170} r={13} fill="var(--ink)" opacity={0.001} />
            <circle
              cx={x}
              cy={170}
              r={9}
              fill="var(--accent)"
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth={2}
            />
            <text
              x={x}
              y={212}
              textAnchor="middle"
              fill="currentColor"
              fillOpacity={0.75}
              style={{
                font: "600 17px var(--font-mono, monospace)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {steps[i]}
            </text>
          </motion.g>
        ))}
      </svg>
      <figcaption className="sr-only">
        Four steps: {steps.join(", then ")}.
      </figcaption>
    </figure>
  );
}
