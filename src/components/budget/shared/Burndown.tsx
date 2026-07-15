/**
 * Burn-down chart (design Option C). Renders the whole idea in one picture:
 * the plan's shape, where you are, and the future you've already committed to
 * (planned txns extend the line past today — the "November cliff").
 *
 * No text lives inside the SVG, so we can stretch it to fill the width with
 * preserveAspectRatio="none" and keep strokes crisp via non-scaling-stroke.
 */

import type { Burndown } from '@/lib/budget/engine';

const W = 340;
const H = 170;
const PAD_L = 6;
const PAD_R = 6;
const PAD_T = 10;
const PAD_B = 10;

function toPath(points: { t: number; v: number }[], maxV: number): string {
  if (points.length === 0) return '';
  const x = (t: number) => PAD_L + t * (W - PAD_L - PAD_R);
  const y = (v: number) => H - PAD_B - (v / maxV) * (H - PAD_T - PAD_B);
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`)
    .join(' ');
}

export default function BurndownChart({ data }: { data: Burndown }) {
  const { planLine, actualLine, committedLine, cap, todayT, maxV } = data;
  const x = (t: number) => PAD_L + t * (W - PAD_L - PAD_R);
  const y = (v: number) => H - PAD_B - (v / maxV) * (H - PAD_T - PAD_B);
  const capY = cap != null ? y(cap) : null;
  const last = actualLine[actualLine.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-40 w-full"
      role="img"
      aria-label="Spending burn-down against plan"
    >
      {/* cap line */}
      {capY != null && (
        <line
          x1={PAD_L}
          x2={W - PAD_R}
          y1={capY}
          y2={capY}
          className="stroke-gray-400 dark:stroke-gray-600"
          strokeWidth={1}
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {/* today marker */}
      <line
        x1={x(todayT)}
        x2={x(todayT)}
        y1={PAD_T}
        y2={H - PAD_B}
        className="stroke-gray-300 dark:stroke-gray-700"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      {/* plan shape */}
      <path
        d={toPath(planLine, maxV)}
        fill="none"
        className="stroke-gray-400 dark:stroke-gray-500"
        strokeWidth={1.5}
        strokeDasharray="3 3"
        vectorEffect="non-scaling-stroke"
      />
      {/* committed future (actual + planned) */}
      <path
        d={toPath(committedLine, maxV)}
        fill="none"
        className="stroke-gray-500 dark:stroke-gray-400"
        strokeWidth={1.5}
        strokeDasharray="1 3"
        vectorEffect="non-scaling-stroke"
      />
      {/* actual so far */}
      <path
        d={toPath(actualLine, maxV)}
        fill="none"
        className="stroke-gray-900 dark:stroke-gray-100"
        strokeWidth={2.25}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* today dot on the actual line */}
      {last && (
        <circle
          cx={x(last.t)}
          cy={y(last.v)}
          r={3}
          className="fill-gray-900 dark:fill-gray-100"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
