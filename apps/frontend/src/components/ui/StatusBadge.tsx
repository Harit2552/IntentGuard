import { Icon } from './Icon';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info';

export function StatusBadge({ tone = 'info', children }: { tone?: StatusTone; children: React.ReactNode }) {
  const icon = tone === 'success' ? 'check' : tone === 'warning' ? 'monitor' : tone === 'danger' ? 'close' : 'lock';
  return (
    <span className={`status-pill ${tone}`} role="status">
      <Icon name={icon} />
      {children}
    </span>
  );
}
