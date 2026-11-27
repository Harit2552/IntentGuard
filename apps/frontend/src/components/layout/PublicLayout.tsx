import { NavLink, Outlet } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { ThemeSwitcher } from './ThemeSwitcher';

export function PublicLayout() {
  return (
    <div className="public-shell">
      <header className="public-header">
        <NavLink className="brand" to="/" aria-label="IntentGuard home">
          <span className="brand-mark"><Icon name="shield" /></span>
          <span>IntentGuard</span>
        </NavLink>
        <nav className="public-nav" aria-label="Public navigation">
          <a href="/#security">Security</a>
          <a href="/#workflow">How it works</a>
          <NavLink to="/login" className="text-link">Sign in</NavLink>
          <ThemeSwitcher />
          <NavLink to="/register" className="button button-primary button-small">Get started</NavLink>
        </nav>
      </header>
      <main><Outlet /></main>
    </div>
  );
}
