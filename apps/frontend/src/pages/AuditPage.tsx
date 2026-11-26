import { useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { sampleActivity, type ActivityStatus } from '../services/activity';

export function AuditPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | ActivityStatus>('All');
  const [selected, setSelected] = useState(sampleActivity[0].id);
  const filtered = useMemo(() => sampleActivity.filter((item) =>
    (status === 'All' || item.status === status) &&
    `${item.id} ${item.operation} ${item.network} ${item.amount}`.toLowerCase().includes(search.toLowerCase())
  ), [search, status]);
  const record = filtered.find((item) => item.id === selected) ?? filtered[0];

  return (
    <div className="audit-page">
      <section className="assistant-heading"><div><p className="muted">Sample data</p><h2>Audit and activity</h2></div><StatusBadge tone="info">5 sample records</StatusBadge></section>
      <section className="audit-tools">
        <label><span>Search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search transaction, network, or amount" /></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as 'All' | ActivityStatus)}><option>All</option><option>Confirmed</option><option>Pending</option><option>Blocked</option><option>Reverted</option></select></label>
        <label><span>Date</span><input type="date" defaultValue="2026-11-26" /></label>
      </section>
      <div className="audit-layout">
        <section className="panel audit-list">
          <div className="panel-head"><div><p>Transaction records</p><h3>History</h3></div></div>
          {filtered.length ? <div className="audit-rows">{filtered.map((item) => (
            <button className={`audit-row ${record?.id === item.id ? 'selected' : ''}`} type="button" key={item.id} onClick={() => setSelected(item.id)}>
              <span className={`audit-status ${item.status.toLowerCase()}`}><Icon name={item.status === 'Confirmed' ? 'check' : item.status === 'Blocked' ? 'close' : 'history'} /></span>
              <span><strong>{item.operation}</strong><small>{item.id} · {new Date(item.date).toLocaleDateString()}</small></span>
              <span><strong>{item.amount}</strong><small>{item.network}</small></span>
              <StatusBadge tone={item.status === 'Confirmed' ? 'success' : item.status === 'Blocked' ? 'danger' : item.status === 'Pending' ? 'warning' : 'info'}>{item.status}</StatusBadge>
            </button>
          ))}</div> : <div className="data-state"><Icon name="history" /><h3>No matching records</h3><p>Clear or change the search and status filters.</p></div>}
        </section>
        {record && <aside className="panel audit-detail">
          <div className="panel-head"><div><p>Record detail</p><h3>{record.id}</h3></div></div>
          <dl className="audit-meta"><div><dt>Date</dt><dd>{new Date(record.date).toLocaleString()}</dd></div><div><dt>Operation</dt><dd>{record.operation}</dd></div><div><dt>Network</dt><dd>{record.network}</dd></div><div><dt>Amount</dt><dd>{record.amount}</dd></div><div><dt>Policy</dt><dd>{record.policy}</dd></div><div><dt>Risk</dt><dd>{record.risk}</dd></div><div><dt>Transaction hash</dt><dd className="mono">{record.transactionHash ?? 'Not available'}</dd></div></dl>
        </aside>}
      </div>
    </div>
  );
}
