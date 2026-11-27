import { useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useWallet } from '../app/providers/WalletProvider';

export function WalletPage() {
  const { wallet, connecting, connect, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (!wallet.account) return;
    await navigator.clipboard?.writeText(wallet.account);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="wallet-page">
      <section className="wallet-heading">
        <div><p className="muted">Browser wallet</p><h2>Wallet management</h2></div>
        {wallet.status === 'disconnected' ? (
          <button className="button button-primary" type="button" onClick={connect} disabled={connecting}>
            <Icon name="wallet" />{connecting ? 'Connecting...' : 'Connect wallet'}
          </button>
        ) : (
          <button className="button button-secondary" type="button" onClick={disconnect}>Disconnect</button>
        )}
      </section>

      <section className="wallet-grid">
        <article className="panel wallet-account">
          <div className="panel-head"><div><p>Active account</p><h3>{wallet.status === 'connected' ? 'Wallet connected' : 'No wallet connected'}</h3></div>
            <StatusBadge tone={wallet.status === 'connected' ? 'success' : 'warning'}>{wallet.status === 'connected' ? 'Connected' : 'Disconnected'}</StatusBadge>
          </div>
          {wallet.status === 'connected' && wallet.account ? (
            <>
              <div className="account-address"><span className="wallet-avatar"><Icon name="wallet" /></span><div><small>Ethereum account</small><strong>{wallet.account.slice(0, 10)}...{wallet.account.slice(-8)}</strong></div><button className="icon-button" type="button" onClick={copyAddress} aria-label="Copy full wallet address"><Icon name={copied ? 'check' : 'batch'} /></button></div>
              {copied && <p className="copy-status" role="status">Full address copied</p>}
            </>
          ) : (
            <div className="wallet-empty"><Icon name="wallet" /><p>Connect a browser wallet to review account and network context.</p></div>
          )}
        </article>

        <article className="panel network-card">
          <div className="panel-head"><div><p>Active network</p><h3>Network context</h3></div></div>
          {wallet.status === 'connected' ? (
            <div className="network-details"><div className="network-icon">◆</div><div><strong>{wallet.chainName}</strong><span>Chain ID {wallet.chainId}</span></div><StatusBadge tone="success">Supported</StatusBadge></div>
          ) : (
            <div className="network-details muted-network"><div className="network-icon">—</div><div><strong>Not connected</strong><span>Network unknown</span></div></div>
          )}
        </article>
      </section>

      <section className="wallet-note"><Icon name="lock" /><div><strong>Signing remains with your wallet</strong><p>This development adapter connects account context only. It does not request private keys, seed phrases, or sign transactions.</p></div></section>
    </div>
  );
}
