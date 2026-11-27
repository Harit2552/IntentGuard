import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Icon, type IconName } from '../ui/Icon';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useWallet } from '../../app/providers/WalletProvider';
import { useAuth } from '../../app/providers/AuthProvider';

const groups: Array<{ label: string; links: Array<{ label: string; to: string; icon: IconName }> }> = [
  {
    label: 'Workspace',
    links: [
      { label: 'Overview', to: '/app', icon: 'grid' },
      { label: 'Assistant', to: '/app/assistant', icon: 'spark' },
      { label: 'Batches', to: '/app/batches/draft', icon: 'batch' },
      { label: 'History', to: '/app/history', icon: 'history' },
    ],
  },
  {
    label: 'Security',
    links: [
      { label: 'Policies', to: '/app/policies', icon: 'shield' },
      { label: 'Monitoring', to: '/app/security', icon: 'monitor' },
      { label: 'Audit trail', to: '/app/audit', icon: 'history' },
    ],
  },
];

const titles: Record<string, string> = {
  '/app': 'Overview',
  '/app/wallets': 'Wallet management',
  '/app/assistant': 'AI transaction assistant',
  '/app/policies': 'Policies',
  '/app/history': 'Transaction history',
  '/app/audit': 'Audit trail',
  '/app/security': 'Security monitoring',
  '/app/settings': 'Settings',
};

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { wallet } = useWallet();
  const { user } = useAuth();
  const title = Object.entries(titles).find(([path]) => location.pathname === path)?.[1] ?? 'IntentGuard';

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <NavLink className="brand" to="/app" aria-label="IntentGuard overview">
            <span className="brand-mark"><Icon name="shield" /></span>
            <span>IntentGuard</span>
          </NavLink>
          <button className="icon-button sidebar-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation">
            <Icon name="close" />
          </button>
        </div>
        <nav className="side-nav" aria-label="Primary navigation">
          {groups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/app'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon name={link.icon} />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
          <div className="nav-group nav-bottom">
            <NavLink to="/app/wallets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              <Icon name="wallet" /><span>Wallets</span>
            </NavLink>
            <NavLink to="/app/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              <Icon name="settings" /><span>Settings</span>
            </NavLink>
          </div>
        </nav>
        <div className="sidebar-user">
          <div className="avatar">{user?.displayName.slice(0, 2).toUpperCase() ?? 'IG'}</div>
          <div><strong>{user?.displayName ?? 'Guest'}</strong><span>Personal workspace</span></div>
          <NavLink className="icon-button" to="/app/settings" aria-label="Open profile settings">•••</NavLink>
        </div>
      </aside>
      {menuOpen && <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <div className="app-column">
        <header className="app-header">
          <div className="header-title">
            <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation" aria-expanded={menuOpen}>
              <Icon name="menu" />
            </button>
            <div><span className="breadcrumb">Workspace /</span><h1>{title}</h1></div>
          </div>
          <div className="header-actions">
            <NavLink className="network-state" to="/app/wallets">
              <span className={`status-dot ${wallet.status === 'connected' ? '' : 'disconnected-dot'}`} />
              {wallet.status === 'connected' ? wallet.chainName : 'Wallet'} <small>{wallet.status === 'connected' ? wallet.account?.slice(0, 6) : 'Not connected'}</small>
            </NavLink>
            <button className="icon-button" type="button" aria-label="Notifications" title="Notifications"><Icon name="bell" /></button>
            <ThemeSwitcher />
          </div>
        </header>
        <main id="main-content" className="app-main"><Outlet /></main>
      </div>
    </div>
  );
}
