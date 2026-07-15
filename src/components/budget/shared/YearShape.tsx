/**
 * The "shape of the year" — twelve columns, one per month. Column height is the
 * month's plan; solid ink is what you've actually spent; a hatched cap on top
 * is what you've committed to (future planned). The current month wears the
 * accent. Lumpy spend (a June sale, the Nov/Dec cliff) is visible at a glance —
 * which is the whole argument for measuring yearly budgets by pace.
 */

import type { YearShape } from '@/lib/budget/engine';

const MONTH_INITIALS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export default function YearShapeChart({ data }: { data: YearShape }) {
  const { bars, max } = data;
  const h = (v: number) => `${Math.max(0, (v / max) * 100)}%`;

  return (
    <>
      <div className="b-chart">
        <div className="b-cols">
          {bars.map((b) => {
            const planH = h(b.plan);
            const actH = h(Math.min(b.actual, max));
            const plannedH = h(Math.min(b.planned, Math.max(0, max - b.actual)));
            return (
              <div key={b.month} className={`b-col ${b.isNow ? 'now' : ''}`}>
                {b.plan > 0 && <div className="plan" style={{ height: planH }} />}
                {b.actual > 0 && <div className="act" style={{ height: actH }} />}
                {b.planned > 0 && (
                  <div className="pln" style={{ height: plannedH, bottom: actH }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="b-axis">
        {bars.map((b, i) => (
          <span key={b.month} className={b.isNow ? 'now' : undefined}>
            {MONTH_INITIALS[i]}
          </span>
        ))}
      </div>
    </>
  );
}
