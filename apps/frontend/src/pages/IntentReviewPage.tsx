import { NavLink, useParams } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useWallet } from '../app/providers/WalletProvider';
import { useState } from 'react';
import { mockPolicyService, type PolicyEvaluation } from '../services/security';

export function IntentReviewPage() {
  const { intentId } = useParams();
  const { wallet } = useWallet();
  const [evaluation, setEvaluation] = useState<PolicyEvaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  const evaluate = async () => {
    if (!intentId || evaluating) return;
    setEvaluating(true);
    setEvaluation(await mockPolicyService.evaluate(intentId));
    setEvaluating(false);
  };

  return (
    <div className="intent-review-page">
      <section className="assistant-heading">
        <div><p className="muted">Structured draft</p><h2>Intent review</h2></div>
        <StatusBadge tone="warning">Unverified draft</StatusBadge>
      </section>
      <div className="intent-review-grid">
        <section className="panel review-main">
          <div className="panel-head"><div><p>Transaction details</p><h3>ETH transfer</h3></div><span className="mono intent-id">{intentId}</span></div>
          <dl className="intent-details large">
            <div><dt>Operation</dt><dd>Native asset transfer</dd></div>
            <div><dt>Amount</dt><dd>0.05 ETH</dd></div>
            <div><dt>Recipient</dt><dd className="mono">0x1234 (illustrative draft)</dd></div>
            <div><dt>Network</dt><dd>Ethereum Mainnet</dd></div>
            <div><dt>Wallet account</dt><dd className="mono">{wallet.account ?? 'Not connected'}</dd></div>
          </dl>
        </section>
        <aside className="panel review-status">
          <div className="panel-head"><div><p>Next checks</p><h3>Validation status</h3></div></div>
          <div className="validation-step current"><span>1</span><div><strong>Intent review</strong><small>Draft must be confirmed</small></div></div>
          <NavLink className="validation-step" to="/app/policies"><span>2</span><div><strong>Policy evaluation</strong><small>Review active security rules</small></div></NavLink>
          <NavLink className="validation-step" to={`/app/simulations/${intentId ?? 'preview'}`}><span>3</span><div><strong>Simulation and risk</strong><small>Review advisory results</small></div></NavLink>
          <div className="draft-notice"><Icon name="lock" /><p>Policy validation and wallet authorization have not occurred.</p></div>
          {evaluation && (
            <div className="draft-notice" role="status">
              <Icon name={evaluation.decision === 'allow' ? 'check' : 'close'} />
              <p>Mock policy decision: <strong>{evaluation.decision}</strong>. Context {evaluation.contextVersion}.</p>
            </div>
          )}
          {!evaluation && <button className="button button-primary button-full" type="button" onClick={evaluate} disabled={evaluating || !wallet.account}>{evaluating ? 'Evaluating...' : 'Run mock policy check'}</button>}
          <NavLink className="button button-secondary button-full" to="/app/assistant">Edit intent</NavLink>
        </aside>
      </div>
    </div>
  );
}
