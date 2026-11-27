import { useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { StatusBadge } from '../components/ui/StatusBadge';

type BatchItem = {
  id: string;
  operation: string;
  asset: string;
  amount: number;
  recipient: string;
  policy: 'Allowed' | 'Blocked';
  simulation: 'Succeeded' | 'Failed';
};

const initialItems: BatchItem[] = [
  { id: 'INT-1048', operation: 'ETH transfer', asset: 'ETH', amount: 0.05, recipient: '0x1234...9A4E', policy: 'Allowed', simulation: 'Succeeded' },
  { id: 'INT-1049', operation: 'USDC transfer', asset: 'USDC', amount: 250, recipient: '0x71C7...8976', policy: 'Allowed', simulation: 'Succeeded' },
  { id: 'INT-1050', operation: 'Contract approval', asset: 'USDC', amount: 0, recipient: '0xDEF1...4402', policy: 'Blocked', simulation: 'Failed' },
];

export function BatchPage() {
  const [items] = useState(initialItems);
  const [selected, setSelected] = useState<string[]>(['INT-1048', 'INT-1049']);
  const [phase, setPhase] = useState<'draft' | 'verifying' | 'verified' | 'approval' | 'completed'>('draft');

  const eligible = items.filter((item) => item.policy === 'Allowed' && item.simulation === 'Succeeded');
  const blocked = items.filter((item) => item.policy === 'Blocked');
  const selectedItems = items.filter((item) => selected.includes(item.id));
  const totals = useMemo(() => {
    const result: Record<string, number> = {};
    selectedItems.forEach((item) => { if (item.asset !== 'USDC' || item.amount > 0) result[item.asset] = (result[item.asset] ?? 0) + item.amount; });
    return result;
  }, [selectedItems]);

  const toggle = (id: string) => {
    setPhase('draft');
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const verify = () => {
    setPhase('verifying');
    window.setTimeout(() => setPhase('verified'), 850);
  };

  const completeMock = () => {
    setPhase('completed');
  };

  return (
    <div className="batch-page">
      <section className="assistant-heading"><div><p className="muted">Batch state: {phase}</p><h2>Batch transaction manager</h2></div><StatusBadge tone={phase === 'completed' ? 'success' : phase === 'draft' ? 'warning' : 'info'}>{phase}</StatusBadge></section>
      <div className="batch-layout">
        <section className="panel batch-items">
          <div className="panel-head"><div><p>Draft membership</p><h3>Transactions</h3></div><span className="status-pill info">{selected.length} selected</span></div>
          <div className="batch-list">
            {items.map((item) => {
              const canSelect = item.policy === 'Allowed' && item.simulation === 'Succeeded';
              return (
                <article className={`batch-row ${selected.includes(item.id) ? 'selected' : ''}`} key={item.id}>
                  <label className="batch-check"><input type="checkbox" checked={selected.includes(item.id)} disabled={!canSelect} onChange={() => toggle(item.id)} aria-label={`Select ${item.operation} ${item.id}`} /><span /></label>
                  <div className="batch-item-main"><strong>{item.operation}</strong><small className="mono">{item.id} · {item.recipient}</small></div>
                  <div className="batch-item-status"><StatusBadge tone={item.policy === 'Allowed' ? 'success' : 'danger'}>{item.policy}</StatusBadge><small>{item.simulation}</small></div>
                  <strong className="batch-amount">{item.amount > 0 ? `${item.amount} ${item.asset}` : 'No token amount'}</strong>
                  {canSelect && <button className="icon-button" type="button" onClick={() => toggle(item.id)} aria-label={`Remove ${item.operation}`}><Icon name="close" /></button>}
                </article>
              );
            })}
          </div>
          {blocked.length > 0 && <div className="blocked-row"><Icon name="close" /><div><strong>{blocked.length} blocked transaction excluded</strong><p>Blocked items cannot enter an executable batch.</p></div></div>}
        </section>
        <aside className="panel batch-summary">
          <div className="panel-head"><div><p>Display-only summary</p><h3>Batch summary</h3></div></div>
          <div className="batch-counts"><div><strong>{eligible.length}</strong><span>Eligible</span></div><div><strong>{blocked.length}</strong><span>Blocked</span></div><div><strong>{selectedItems.length}</strong><span>Selected</span></div></div>
          <div className="batch-totals"><span>Asset totals</span>{Object.entries(totals).map(([asset, amount]) => <strong key={asset}>{amount} {asset}</strong>)}</div>
          <dl className="batch-meta"><div><dt>Estimated gas</dt><dd>0.0048 ETH (mock)</dd></div><div><dt>Risk</dt><dd>Low advisory</dd></div><div><dt>Execution</dt><dd>Mechanism not configured</dd></div><div><dt>Atomicity</dt><dd>Unknown until contract is confirmed</dd></div></dl>
          {phase === 'draft' && <button className="button button-primary button-full" type="button" onClick={verify} disabled={selectedItems.length === 0}>Run mock verification</button>}
          {phase === 'verifying' && <button className="button button-secondary button-full" type="button" disabled><span className="loading-mark small-loading" />Verifying exact batch</button>}
          {phase === 'verified' && <><button className="button button-primary button-full" type="button" onClick={() => setPhase('approval')}>Continue to approval</button><p className="batch-validation" role="status"><Icon name="check" />Exact batch mock validation passed</p></>}
          {phase === 'approval' && <><div className="draft-notice"><Icon name="lock" /><p>This mock approval will not request a wallet signature or broadcast a transaction.</p></div><button className="button button-primary button-full" type="button" onClick={completeMock}>Confirm mock batch</button></>}
          {phase === 'completed' && <div className="batch-complete" role="status"><Icon name="check" /><strong>Mock batch completed</strong><p>No on-chain execution occurred.</p></div>}
        </aside>
      </div>
    </div>
  );
}
