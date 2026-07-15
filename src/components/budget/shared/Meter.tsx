/**
 * The Home-list meter: ink fill = spent, hatched = planned, and an accent
 * notch marking where the plan says you should be today. The notch — the one
 * accent mark — is the insight.
 */

interface MeterProps {
  spent: number;
  planned: number;
  cap: number | null;
  expected: number | null;
}

export default function Meter({ spent, planned, cap, expected }: MeterProps) {
  if (cap == null || cap <= 0) {
    return <div className="b-meter" />;
  }
  const pct = (v: number) => `${Math.max(0, Math.min(100, (v / cap) * 100))}%`;
  const spentW = Math.max(0, Math.min(1, spent / cap));
  const plannedLeft = spentW;
  const plannedW = Math.max(0, Math.min(1 - spentW, planned / cap));

  return (
    <div className="b-meter">
      <div className="spent" style={{ width: pct(spent) }} />
      {planned > 0 && (
        <div
          className="planned"
          style={{ left: `${plannedLeft * 100}%`, width: `${plannedW * 100}%` }}
        />
      )}
      {expected != null && <div className="notch" style={{ left: pct(expected) }} />}
    </div>
  );
}
