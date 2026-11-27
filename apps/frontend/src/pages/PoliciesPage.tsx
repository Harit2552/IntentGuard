import { useEffect, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { mockPolicyService } from '../services/security';

export function PoliciesPage() {
  const [rules, setRules] = useState<Array<{ name: string; limit: string; enabled: boolean }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockPolicyService.listRules().then((items) => {
      setRules(items);
      setLoading(false);
    });
  }, []);

  const toggleRule = (name: string) => {
    setRules((current) => current.map((rule) => rule.name === name ? { ...rule, enabled: !rule.enabled } : rule));
  };

  return (
    <div className="policies-page">
      <section className="assistant-heading"><div><p className="muted">Security controls</p><h2>Policies</h2></div><StatusBadge tone="success">4 rules active</StatusBadge></section>
      <section className="policy-grid">
        <article className="panel policy-rules">
          <div className="panel-head"><div><p>Configured rules</p><h3>Transaction policies</h3></div><span className="status-pill info">Mock configuration</span></div>
          {loading ? <div className="data-state" role="status"><span className="loading-mark" />Loading policies</div> : (
            <div className="policy-list">
              {rules.map((rule) => (
                <div className="policy-row" key={rule.name}>
                  <span className="policy-icon"><Icon name="shield" /></span>
                  <div><strong>{rule.name}</strong><small>{rule.limit}</small></div>
                  <label className="policy-toggle" aria-label={`Toggle ${rule.name}`}>
                    <input type="checkbox" checked={rule.enabled} onChange={() => toggleRule(rule.name)} />
                    <span />
                  </label>
                </div>
              ))}
            </div>
          )}
        </article>
        <aside className="panel policy-context">
          <div className="panel-head"><div><p>Authority</p><h3>Policy model</h3></div></div>
          <div className="policy-note"><Icon name="lock" /><div><strong>Backend-authoritative</strong><p>Only an authoritative backend policy response may allow or deny a transaction draft.</p></div></div>
          <dl className="policy-meta"><div><dt>Policy version</dt><dd>mock-policy-v4</dd></div><div><dt>Context</dt><dd>Illustrative workspace</dd></div><div><dt>Last evaluation</dt><dd>Not yet run</dd></div></dl>
        </aside>
      </section>
    </div>
  );
}
