import { NavLink } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { Panel } from '../components/ui/Panel';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useWallet } from '../app/providers/WalletProvider';

export function DashboardPage() {
  const { wallet } = useWallet();
  return (
    <div className="dashboard">
      <section className="welcome-row">
        <div><p className="muted">Thursday, November 26</p><h2>Good afternoon, Alex</h2></div>
        <NavLink to="/app/assistant" className="button button-primary"><Icon name="spark" /> New transaction</NavLink>
      </section>
      <section className="stats-grid" aria-label="Account summary">
        <StatCard label="Transaction activity" value="24" detail="Illustrative monthly count" icon="history" />
        <StatCard label="Successful" value="21" detail="Confirmed in mock history" icon="check" tone="positive" />
        <StatCard label="Blocked" value="2" detail="Policy denied" icon="shield" />
        <StatCard label="Pending" value="1" detail="Awaiting review" icon="batch" />
      </section>
      <section className="dashboard-quick-grid">
        <Panel title="Wallet context" eyebrow="Browser wallet" action={<StatusBadge tone={wallet.status === 'connected' ? 'success' : 'warning'}>{wallet.status === 'connected' ? 'Connected' : 'Not connected'}</StatusBadge>}>
          {wallet.status === 'connected' ? (
            <div className="wallet-context"><Icon name="wallet" /><div><strong>{wallet.chainName}</strong><span className="mono">{wallet.account?.slice(0, 10)}...{wallet.account?.slice(-8)}</span></div><NavLink className="text-link" to="/app/wallets">Manage</NavLink></div>
          ) : (
            <div className="wallet-context"><Icon name="wallet" /><div><strong>No wallet connected</strong><span>Connect for account-aware review</span></div><NavLink className="text-link" to="/app/wallets">Connect</NavLink></div>
          )}
        </Panel>
        <Panel title="Quick actions" eyebrow="Start a workflow">
          <div className="quick-actions">
            <NavLink to="/app/assistant"><Icon name="spark" /><span>Create intent</span></NavLink>
            <NavLink to="/app/wallets"><Icon name="wallet" /><span>Wallet</span></NavLink>
            <NavLink to="/app/policies"><Icon name="shield" /><span>Policies</span></NavLink>
            <NavLink to="/app/batches/draft"><Icon name="batch" /><span>Batch</span></NavLink>
          </div>
        </Panel>
      </section>
      <section className="panel volume-panel" aria-label="Illustrative transaction volume">
        <div className="panel-head"><div><p>Illustrative data</p><h3>Transaction volume</h3></div><span className="muted">Last 7 days</span></div>
        <div className="volume-chart" role="img" aria-label="Illustrative daily transaction volume chart">
          {[42, 68, 52, 82, 64, 91, 76].map((height, index) => <div className="volume-column" key={index}><span style={{ height: `${height}%` }} /><small>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</small></div>)}
        </div>
      </section>
      <section className="dashboard-grid">
        <Panel title="Transaction activity" eyebrow="Recent activity" action={<NavLink to="/app/history" className="text-link">View all</NavLink>} className="activity-panel">
          <div className="activity-list">
            {[['USDC transfer', 'To 0x71C4...9A4E', 'Confirmed', '+'], ['ETH swap', 'Uniswap V3', 'Pending', '↻'], ['Policy update', 'Weekly transfer limit', 'Applied', '✓']].map(([title, detail, status, symbol]) => (
              <div className="activity-row" key={title}>
                <span className="activity-icon">{symbol}</span>
                <div><strong>{title}</strong><small>{detail}</small></div>
                <StatusBadge tone={status === 'Confirmed' || status === 'Applied' ? 'success' : 'warning'}>{status}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Account status" eyebrow="Security posture" action={<StatusBadge tone="success">Protected</StatusBadge>} className="security-panel">
          <div className="security-score"><div className="score-ring"><strong>92</strong><span>/100</span></div><div><strong>Strong</strong><small>Last checked 8 min ago</small></div></div>
          <div className="check-list">
            <div><Icon name="check" /><span>Wallet verification</span><strong>Passed</strong></div>
            <div><Icon name="check" /><span>Spending limits</span><strong>Passed</strong></div>
            <div><Icon name="shield" /><span>Contract allowlist</span><strong>Enabled</strong></div>
          </div>
        </Panel>
      </section>
    </div>
  );
}
