import { Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { AuthProvider, useAuth } from './app/providers/AuthProvider';
import { WalletProvider } from './app/providers/WalletProvider';
import { AppLayout } from './components/layout/AppLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';
import { WalletPage } from './pages/WalletPage';
import { AssistantPage } from './pages/AssistantPage';
import { IntentReviewPage } from './pages/IntentReviewPage';
import { useState, type FormEvent } from 'react';
import { PoliciesPage } from './pages/PoliciesPage';
import { SimulationPage } from './pages/SimulationPage';
import { RiskPage } from './pages/RiskPage';
import { ExecutionPage } from './pages/ExecutionPage';
import { BatchPage } from './pages/BatchPage';
import { AuditPage } from './pages/AuditPage';
import { SecurityMonitoringPage } from './pages/SecurityMonitoringPage';

function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const { service } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError('');
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '');
    const password = String(data.get('password') ?? '');
    const result = isLogin
      ? await service.login(email, password)
      : await service.register(String(data.get('name') ?? ''), email, password);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/app');
  };
  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="section-kicker">{isLogin ? 'Welcome back' : 'Create workspace'}</p>
        <h1>{isLogin ? 'Sign in to IntentGuard' : 'Start protecting transactions'}</h1>
        <form onSubmit={submit}>
          {!isLogin && (
            <label>Full name<input name="name" autoComplete="name" placeholder="Alex Harper" /></label>
          )}
          <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@company.com" /></label>
          <label>Password<input name="password" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder="Enter your password" /></label>
          {isLogin && <div className="form-row"><label className="checkbox-label"><input type="checkbox" /> Remember this device</label><a href="/forgot-password">Forgot password?</a></div>}
          {error && <p className="intent-error" role="alert">{error}</p>}
          <button className="button button-primary button-full" type="submit" disabled={pending}>{pending ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}</button>
        </form>
        <p className="auth-switch">{isLogin ? 'New to IntentGuard?' : 'Already have an account?'} <a href={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Sign in'}</a></p>
      </div>
    </section>
  );
}

function ForgotPasswordPage() {
  const { service } = useAuth();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError('');
    setMessage('');
    const email = String(new FormData(event.currentTarget).get('email') ?? '');
    const result = await service.recover(email);
    setPending(false);
    if (!result.ok) setError(result.error);
    else setMessage('If this account exists, recovery instructions would be sent. No email was sent in mock mode.');
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="section-kicker">Account recovery</p>
        <h1>Reset your password</h1>
        <form onSubmit={submit}>
          <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@company.com" /></label>
          {error && <p className="intent-error" role="alert">{error}</p>}
          {message && <p className="auth-success" role="status">{message}</p>}
          <button className="button button-primary button-full" type="submit" disabled={pending}>{pending ? 'Please wait...' : 'Send recovery link'}</button>
        </form>
        <p className="auth-switch"><a href="/login">Back to sign in</a></p>
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section className="not-found">
      <p>404</p><h1>Page not found</h1><a className="button button-primary" href="/">Return home</a>
    </section>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
          <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="wallets" element={<WalletPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="history" element={<AuditPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="security" element={<SecurityMonitoringPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="intents/:intentId" element={<IntentReviewPage />} />
          <Route path="simulations/:simulationId" element={<SimulationPage />} />
          <Route path="risk/:analysisId" element={<RiskPage />} />
          <Route path="executions/:executionId" element={<ExecutionPage />} />
          <Route path="batches/:batchId" element={<BatchPage />} />
          <Route path="batches/:batchId/verify" element={<BatchPage />} />
        </Route>
        <Route path="/unauthorized" element={<NotFound />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
          </Routes>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
