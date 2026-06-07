import { Icon } from '../components/common/Icon';
import { stats, recentActivity } from '../data/dashboard';
import type { ActivityItem, Stat } from '../types';

export function DashboardView() {
  return (
    <div>
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Dashboard</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Prestazioni del sistema e metriche attive.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <RecentActivityCard items={recentActivity} />
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm">
      <div className={`flex items-center gap-3 mb-2 ${stat.accent}`}>
        <Icon name={stat.icon} />
        <span className="font-label-caps text-label-caps uppercase">{stat.label}</span>
      </div>
      <div className="font-headline-lg text-headline-lg text-primary text-3xl">{stat.value}</div>
    </div>
  );
}

function RecentActivityCard({ items }: { items: ActivityItem[] }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm">
      <div className="p-6 border-b border-outline-variant/50">
        <h3 className="font-headline-md text-headline-md text-primary">Attivita recenti</h3>
      </div>
      <div className="p-6 flex flex-col gap-4">
        {items.map((item) => (
          <ActivityRow key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <div className="flex items-center justify-between border-b border-surface-variant pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
          <Icon name={item.icon} />
        </div>
        <div>
          <p className="font-body-md text-body-md text-primary font-medium">{item.title}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{item.subtitle}</p>
        </div>
      </div>
      <span className="font-body-sm text-body-sm text-on-surface-variant">{item.time}</span>
    </div>
  );
}
