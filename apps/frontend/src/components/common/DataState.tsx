import { Icon } from '../ui/Icon';

export function LoadingState({ label = 'Loading data' }: { label?: string }) {
  return (
    <div className="data-state" role="status" aria-live="polite">
      <span className="loading-mark" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="data-state data-state-empty">
      <div className="placeholder-icon"><Icon name="batch" /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({ title = 'Could not load this section', description, retry }: { title?: string; description: string; retry?: () => void }) {
  return (
    <div className="data-state" role="alert">
      <div className="placeholder-icon danger"><Icon name="close" /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {retry && <button className="button button-secondary" type="button" onClick={retry}>Try again</button>}
    </div>
  );
}
