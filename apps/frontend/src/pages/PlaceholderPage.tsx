import { Icon } from '../components/ui/Icon';

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon"><Icon name="lock" /></div>
      <p className="section-kicker">IntentGuard</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <button className="button button-secondary" type="button" disabled>Integration pending</button>
    </div>
  );
}
