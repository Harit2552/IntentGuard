import { Icon } from '../ui/Icon';
import { useTheme, type ThemePreference } from '../../app/providers/ThemeProvider';

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();

  const nextTheme: Record<ThemePreference, ThemePreference> = {
    dark: 'light',
    light: 'system',
    system: 'dark',
  };

  return (
    <button
      className="icon-button"
      type="button"
      onClick={() => setPreference(nextTheme[preference])}
      title={`Theme: ${preference}. Switch theme`}
      aria-label={`Theme: ${preference}. Switch theme`}
    >
      <Icon name={preference === 'light' ? 'sun' : preference === 'dark' ? 'moon' : 'monitor'} />
    </button>
  );
}
