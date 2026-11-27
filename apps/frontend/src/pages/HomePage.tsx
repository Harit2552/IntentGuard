import { NavLink } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';

export function HomePage() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> AI-native transaction security</div>
          <h1>Execute on-chain intent.<br /><span>With complete control.</span></h1>
          <p>Translate instructions into verified transactions, assess risk before signing, and approve exactly what MetaMask will execute.</p>
          <div className="hero-actions">
            <NavLink to="/register" className="button button-primary">Create workspace <Icon name="arrow" /></NavLink>
            <NavLink to="/login" className="button button-secondary">View console</NavLink>
          </div>
          <div className="trust-row">
            <span><Icon name="check" /> Policy-controlled</span>
            <span><Icon name="check" /> Risk simulation</span>
            <span><Icon name="check" /> Explicit approval</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Intent verification preview">
          <div className="visual-glow" />
          <div className="intent-card">
            <div className="intent-card-head">
              <div><span className="mini-logo"><Icon name="spark" /></span><strong>Intent review</strong></div>
              <span className="status-pill success"><Icon name="check" /> Verified</span>
            </div>
            <div className="prompt-box"><span>Instruction</span><p>Send 0.25 ETH to 0x71C...9A4E</p></div>
            <div className="review-grid">
              <div><span>Amount</span><strong>0.25 ETH</strong></div>
              <div><span>Network</span><strong>Ethereum</strong></div>
              <div><span>Recipient</span><strong className="mono">0x71C...9A4E</strong></div>
              <div><span>Estimated gas</span><strong>0.0021 ETH</strong></div>
            </div>
            <div className="check-row"><span className="check-icon"><Icon name="check" /></span><div><strong>Policy validation passed</strong><small>Within your weekly transfer limit</small></div></div>
            <div className="check-row"><span className="check-icon"><Icon name="check" /></span><div><strong>Simulation completed</strong><small>No unexpected asset changes detected</small></div></div>
            <NavLink to="/login" className="button button-primary button-full">Review &amp; approve <Icon name="lock" /></NavLink>
          </div>
        </div>
      </section>
      <section className="feature-strip" id="workflow">
        <article><span>01</span><Icon name="spark" /><h2>Describe</h2><p>Turn natural language into a structured transaction draft.</p></article>
        <article><span>02</span><Icon name="shield" /><h2>Verify</h2><p>Validate policies, simulate effects, and review every finding.</p></article>
        <article><span>03</span><Icon name="lock" /><h2>Authorize</h2><p>Approve the exact payload through your wallet.</p></article>
      </section>
      <section className="security-section" id="security"><p className="section-kicker">Security by design</p><h2>One governed path from intent to execution.</h2></section>
    </div>
  );
}
