import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { mockRiskService, type RiskResult } from '../services/security';

export function RiskPage() {
  const { analysisId } = useParams();
  const [risk, setRisk] = useState<RiskResult | null>(null);

  useEffect(() => {
    mockRiskService.analyze(analysisId ?? 'unknown').then(setRisk);
  }, [analysisId]);

  return (
    <div className="risk-page">
      <section className="assistant-heading"><div><p className="muted">Backend risk findings</p><h2>Risk analysis</h2></div>{risk && <StatusBadge tone={risk.classification === 'low' ? 'success' : risk.classification === 'unknown' ? 'warning' : 'danger'}>{risk.classification} risk</StatusBadge>}</section>
      {risk ? (
        <div className="risk-grid">
          <section className="panel risk-main">
            <div className="panel-head"><div><p>Analysis evidence</p><h3>Findings</h3></div><span className="mono">{risk.analysisId}</span></div>
            {risk.findings.map((finding) => (
              <article className="risk-detail" key={finding.title}>
                <span className={`risk-severity ${finding.severity}`}><Icon name={finding.severity === 'critical' ? 'close' : finding.severity === 'warning' ? 'monitor' : 'check'} /></span>
                <div><strong>{finding.title}</strong><p>{finding.evidence}</p><small>{finding.severity} severity finding</small></div>
              </article>
            ))}
          </section>
          <aside className="panel risk-disclaimer"><Icon name="shield" /><h3>Advisory result</h3><p>These mock findings are interface data, not verified threat intelligence.</p><dl><div><dt>Analyzed</dt><dd>{new Date(risk.analyzedAt).toLocaleString()}</dd></div><div><dt>Classification</dt><dd>{risk.classification}</dd></div></dl></aside>
        </div>
      ) : <div className="placeholder-page"><span className="loading-mark" /><h2>Loading risk analysis</h2></div>}
    </div>
  );
}
