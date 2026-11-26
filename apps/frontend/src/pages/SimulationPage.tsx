import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { mockSimulationService, mockRiskService, type RiskResult, type SimulationResult } from '../services/security';

export function SimulationPage() {
  const { simulationId } = useParams();
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const intentId = simulationId ?? 'intent_preview';
        const result = await mockSimulationService.simulate(intentId, `eval_${intentId}`);
        if (!active) return;
        setSimulation(result);
        setRisk(await mockRiskService.analyze(result.simulationId));
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Simulation unavailable');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [simulationId]);

  if (loading) return <div className="placeholder-page"><span className="loading-mark" /><h2>Running mock simulation</h2><p>Preparing advisory asset effects and gas context.</p></div>;
  if (error) return <div className="placeholder-page"><StatusBadge tone="danger">Unavailable</StatusBadge><h2>Simulation failed</h2><p>{error}</p></div>;

  return (
    <div className="simulation-page">
      <section className="assistant-heading"><div><p className="muted">Advisory backend result</p><h2>Transaction simulation</h2></div><StatusBadge tone="success">Simulated</StatusBadge></section>
      {simulation && (
        <div className="simulation-grid">
          <section className="panel simulation-main">
            <div className="panel-head"><div><p>Expected effects</p><h3>ETH transfer</h3></div><span className="mono">{simulation.simulationId}</span></div>
            <div className="gas-row"><div><span>Estimated gas</span><strong>{simulation.gasEstimate}</strong></div><div><span>Simulation</span><strong>{simulation.status}</strong></div><div><span>Simulated</span><strong>{new Date(simulation.simulatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div></div>
            <h4>Affected assets</h4>
            <div className="affected-list">{simulation.affectedAssets.map((asset) => <div key={asset.asset + asset.change}><span className="asset-icon">Ξ</span><strong>{asset.asset}</strong><span>{asset.change}</span></div>)}</div>
            <div className="warning-list">{simulation.warnings.map((warning) => <p key={warning}><Icon name="monitor" />{warning}</p>)}</div>
          </section>
          <aside className="panel risk-summary">
            <div className="panel-head"><div><p>Advisory analysis</p><h3>Risk summary</h3></div>{risk && <StatusBadge tone={risk.classification === 'low' ? 'success' : 'warning'}>{risk.classification}</StatusBadge>}</div>
            {risk?.findings.map((finding) => <div className="risk-finding" key={finding.title}><Icon name={finding.severity === 'critical' ? 'close' : finding.severity === 'warning' ? 'monitor' : 'check'} /><div><strong>{finding.title}</strong><p>{finding.evidence}</p></div></div>)}
            <div className="draft-notice"><Icon name="lock" /><p>No result here authorizes execution. Risk findings are not guarantees.</p></div>
            {risk && <Link className="button button-secondary button-full" to={`/app/risk/${risk.analysisId}`}>Review full risk analysis</Link>}
          </aside>
        </div>
      )}
    </div>
  );
}
