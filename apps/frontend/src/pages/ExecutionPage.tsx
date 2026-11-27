import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useWallet } from '../app/providers/WalletProvider';

export function ExecutionPage() {
  const { executionId } = useParams();
  const { wallet } = useWallet();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [status, setStatus] = useState<'review' | 'awaiting_wallet' | 'rejected'>('review');
  const dialogRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!reviewOpen) return;
    dialogRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReviewOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [reviewOpen]);

  const continueToWallet = () => {
    setReviewOpen(false);
    setStatus('awaiting_wallet');
  };

  return (
    <div className="execution-page">
      <section className="assistant-heading"><div><p className="muted">Final review</p><h2>Transaction execution</h2></div><StatusBadge tone="warning">Not submitted</StatusBadge></section>
      <div className="execution-grid">
        <section className="panel execution-main">
          <div className="panel-head"><div><p>Exact payload summary</p><h3>ETH transfer</h3></div><span className="mono">{executionId ?? 'execution-preview'}</span></div>
          <dl className="execution-details">
            <div><dt>Network</dt><dd>Ethereum Mainnet <span>Chain ID 1</span></dd></div>
            <div><dt>Account</dt><dd className="mono">{wallet.account ?? '0x71C7...976F (illustrative)'}</dd></div>
            <div><dt>Recipient</dt><dd className="mono">0x1234...recipient</dd></div>
            <div><dt>Asset and amount</dt><dd>0.05 ETH</dd></div>
            <div><dt>Estimated gas</dt><dd>0.0021 ETH</dd></div>
            <div><dt>Operation</dt><dd>Native asset transfer</dd></div>
          </dl>
          <div className="execution-results">
            <div><Icon name="check" /><span><strong>Policy: Allowed</strong><small>Mock evaluation context v4</small></span></div>
            <div><Icon name="check" /><span><strong>Simulation: Succeeded</strong><small>No unexpected asset effect in mock result</small></span></div>
            <div><Icon name="monitor" /><span><strong>Risk: Low advisory</strong><small>Not a guarantee or verified threat assessment</small></span></div>
          </div>
        </section>
        <aside className="panel execution-action">
          <div className="panel-head"><div><p>Wallet handoff</p><h3>Approval required</h3></div></div>
          {status === 'review' && <><div className="draft-notice"><Icon name="lock" /><p>MetaMask will not open until you review the exact action and explicitly continue.</p></div><button className="button button-primary button-full" type="button" onClick={() => setReviewOpen(true)}>Review exact payload</button></>}
          {status === 'awaiting_wallet' && <div className="wallet-handoff" role="status"><span className="loading-mark" /><strong>Wallet handoff simulated</strong><p>No signing request was sent. Real wallet integration must be explicitly configured later.</p><button className="button button-secondary button-full" type="button" onClick={() => setStatus('rejected')}>Dismiss mock state</button></div>}
          {status === 'rejected' && <div className="wallet-handoff" role="status"><Icon name="close" /><strong>User rejection state</strong><p>The mock action was cancelled. No transaction was submitted.</p><button className="button button-secondary button-full" type="button" onClick={() => setStatus('review')}>Return to review</button></div>}
        </aside>
      </div>

      {reviewOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setReviewOpen(false)}>
          <section className="execution-dialog" role="dialog" aria-modal="true" aria-labelledby="execution-dialog-title">
            <div className="dialog-head"><div><p>Explicit authorization review</p><h2 id="execution-dialog-title">Approve this exact action?</h2></div><button className="icon-button" type="button" onClick={() => setReviewOpen(false)} aria-label="Cancel and close review"><Icon name="close" /></button></div>
            <dl className="dialog-payload"><div><dt>Network</dt><dd>Ethereum Mainnet</dd></div><div><dt>Account</dt><dd className="mono">{wallet.account ?? 'Not connected'}</dd></div><div><dt>Action</dt><dd>Transfer 0.05 ETH</dd></div><div><dt>Recipient</dt><dd className="mono">0x1234...recipient</dd></div><div><dt>Estimated gas</dt><dd>0.0021 ETH</dd></div></dl>
            <p className="dialog-warning"><Icon name="lock" />This does not initiate a real wallet or broadcast a transaction.</p>
            <div className="dialog-actions"><button ref={dialogRef} className="button button-secondary" type="button" onClick={() => setReviewOpen(false)}>Cancel</button><button className="button button-primary" type="button" onClick={continueToWallet}>Continue to wallet handoff</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
