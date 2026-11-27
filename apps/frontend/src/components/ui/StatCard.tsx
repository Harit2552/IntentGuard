import type { IconName } from './Icon';
import { Icon } from './Icon';

export function StatCard({
  label,
  value,
  detail,
  icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  tone?: 'positive';
}) {
  return (
    <article className="stat-card">
      <div className="stat-head"><span>{label}</span><Icon name={icon} /></div>
      <strong>{value}</strong>
      <small className={tone ? 'positive' : undefined}>{detail}</small>
    </article>
  );
}
