import { useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { Panel } from '../components/ui/Panel';
import { useTheme, type ThemePreference } from '../app/providers/ThemeProvider';

export function SettingsPage() {
  const { preference, setPreference } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const options: Array<{ value: ThemePreference; label: string; icon: 'sun' | 'moon' | 'monitor' }> = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'system', label: 'System', icon: 'monitor' },
  ];

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div><p className="muted">Personal workspace</p><h2>Settings</h2></div>
        <button className="button button-primary" type="button" onClick={save}>{saved ? 'Saved' : 'Save changes'}{saved && <Icon name="check" />}</button>
      </div>

      <Panel title="Profile" eyebrow="Workspace identity" className="settings-panel">
        <div className="profile-row">
          <div className="profile-avatar">AH</div>
          <div><strong>Alex Harper</strong><span>alex.harper@example.com</span></div>
        </div>
        <div className="settings-fields">
          <label>Display name<input defaultValue="Alex Harper" /></label>
          <label>Email address<input defaultValue="alex.harper@example.com" type="email" /></label>
        </div>
      </Panel>

      <Panel title="Appearance" eyebrow="Interface" className="settings-panel">
        <fieldset className="theme-options">
          <legend>Theme preference</legend>
          {options.map((option) => (
            <label className={`theme-option ${preference === option.value ? 'selected' : ''}`} key={option.value}>
              <input type="radio" name="theme" checked={preference === option.value} onChange={() => setPreference(option.value)} />
              <Icon name={option.icon} />
              <span>{option.label}</span>
              {preference === option.value && <Icon name="check" />}
            </label>
          ))}
        </fieldset>
      </Panel>

      <Panel title="Notifications" eyebrow="Communication" className="settings-panel">
        <label className="toggle-row">
          <div><strong>Security updates</strong><span>Receive risk alerts and transaction status updates</span></div>
          <input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} />
          <span className="toggle" aria-hidden="true" />
        </label>
      </Panel>
    </div>
  );
}
