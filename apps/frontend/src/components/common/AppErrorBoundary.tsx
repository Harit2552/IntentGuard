import { Component, type ErrorInfo, type ReactNode } from 'react';

export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('IntentGuard route error', { error: error.message, componentStack: info.componentStack });
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="not-found">
          <p>Application error</p>
          <h1>This section could not be displayed</h1>
          <button className="button button-primary" type="button" onClick={() => window.location.reload()}>Reload application</button>
        </main>
      );
    }
    return this.props.children;
  }
}
