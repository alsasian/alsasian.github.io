/**
 * The Home-list bar (design Option A): spent vs cap, with a tick mark showing
 * where the plan says you should be by today. The tick — not the fill — is the
 * insight, so it's drawn as a hard vertical line that reads over the fill.
 */

interface PaceBarProps {
  spent: number;
  cap: number | null;
  expected: number | null;
}

export default function PaceBar({ spent, cap, expected }: PaceBarProps) {
  if (cap == null || cap <= 0) {
    // Untracked item: a flat neutral track, no cap to measure against.
    return <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-800" />;
  }

  const fill = Math.max(0, Math.min(1, spent / cap));
  const over = spent > cap;
  const tick = expected == null ? null : Math.max(0, Math.min(1, expected / cap));

  return (
    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
      <div
        className={`absolute inset-y-0 left-0 rounded-full ${
          over ? 'bg-gray-500 dark:bg-gray-400' : 'bg-gray-900 dark:bg-gray-100'
        }`}
        style={{ width: `${fill * 100}%` }}
      />
      {tick != null && (
        <div
          className="absolute inset-y-0 w-0.5 bg-gray-50 mix-blend-difference dark:bg-gray-50"
          style={{ left: `calc(${tick * 100}% - 1px)` }}
          aria-hidden
        />
      )}
    </div>
  );
}
