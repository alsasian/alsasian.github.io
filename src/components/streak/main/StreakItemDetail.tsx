import type { StreakStats } from '@/lib/streak/types';

interface StreakItemDetailProps {
  stats: StreakStats;
}

export default function StreakItemDetail({ stats }: StreakItemDetailProps) {
  const statItems = [
    { label: 'Longest Streak', value: `${stats.longestStreak} days` },
    { label: 'Total Check-ins', value: stats.totalCheckIns },
    { label: 'Completion Rate', value: `${stats.completionRate}%` },
    {
      label: 'Last Check-in',
      value: stats.lastCheckIn
        ? new Date(stats.lastCheckIn).toLocaleDateString()
        : 'Never',
    },
  ];

  return (
    <div className="mt-3 border-t streak-divider pt-3">
      <dl className="grid grid-cols-2 gap-3">
        {statItems.map((item) => (
          <div key={item.label}>
            <dt className="text-xs streak-text-secondary">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm font-medium streak-text-primary">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
