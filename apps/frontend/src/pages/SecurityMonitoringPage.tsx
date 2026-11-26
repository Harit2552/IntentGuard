import { Icon } from '../components/ui/Icon';
import { StatusBadge } from '../components/ui/StatusBadge';

const events = [
  { time: 'Today, 20:42', title: 'Transaction confirmed', detail: 'USDC transfer passed policy and simulation review.', tone: 'success' as const, icon: 'check' as const },
  { time: 'Today, 15:33', title: 'Transaction blocked', detail: 'Contract approval exceeded the configured recipient policy.', tone: 'danger' as const, icon: 'close' as const },
  { time: 'Today, 10:18', title: 'Wallet context changed', detail: 'Account context switched in the illustrative wallet provider.', tone: 'warning' as const, icon: 'wallet' as const },
  { time: 'Yesterday, 22:08', title: 'Simulation reverted', detail: 'Mock chain result recorded a reverted execution.', tone: 'info' as const, icon: 'history' as const },
];

export function SecurityMonitoringPage() {
  return (
    <div className="monitoring-page">
      <section className="assistant-heading"><div><p className="muted">Backend event timeline</p><h2>Security monitoring</h2></div><StatusBadge tone="success">Sample monitoring</StatusBadge></section>
      <section className="monitoring-grid">
        <article className="panel monitoring-timeline">
          <div className="panel-head"><div><p>Recent events</p><h3>Security timeline</h3></div><span className="status-pill info">Illustrative</span></div>
          <div className="timeline-list">
            {events.map((event) => (
              <div className="timeline-row" key={event.title}>
                <span className={`timeline-icon ${event.tone}`}><Icon name={event.icon} /></span>
                <div><small>{event.time}</small><strong>{event.title}</strong><p>{event.detail}</p></div>
                <StatusBadge tone={event.tone}>{event.tone === 'success' ? 'Resolved' : event.tone === 'danger' ? 'Blocked' : event.tone === 'warning' ? 'Review' : 'Recorded'}</StatusBadge>
              </div>
            ))}
          </div>
        </article>
        <aside className="panel monitoring-summary">
          <div className="panel-head"><div><p>Current posture</p><h3>Security overview</h3></div></div>
          <div className="monitoring-score"><strong>92</strong><span>/100</span><p>Illustrative score</p></div>
          <dl><div><dt>Blocked today</dt><dd>1</dd></div><div><dt>Policy violations</dt><dd>1</dd></div><div><dt>Monitoring freshness</dt><dd>8 min sample</dd></div></dl>
          <div className="draft-notice"><Icon name="lock" /><p>These events are mock data. The UI does not imply continuous real-time monitoring.</p></div>
        </aside>
      </section>
    </div>
  );
}
