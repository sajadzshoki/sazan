export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'sazan-theme';
const themePreferenceOptions: readonly ThemePreference[] = ['system', 'light', 'dark'];
let isThemeRuntimeReady = false;

const isThemePreference = (value: string | null): value is ThemePreference => {
  return value === 'system' || value === 'light' || value === 'dark';
};

const getSystemTheme = (): ResolvedTheme => {
  if (!import.meta.client) {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyDocumentTheme = (theme: ResolvedTheme) => {
  if (!import.meta.client) {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
};

export const useAppTheme = () => {
  const preference = useState<ThemePreference>('sazan.theme.preference', () => 'system');
  const resolvedTheme = useState<ResolvedTheme>('sazan.theme.resolved', () => 'light');

  const resolvePreference = (themePreference: ThemePreference = preference.value): ResolvedTheme => {
    return themePreference === 'system' ? getSystemTheme() : themePreference;
  };

  const syncTheme = () => {
    const resolved = resolvePreference();
    resolvedTheme.value = resolved;
    applyDocumentTheme(resolved);
  };

  const setThemePreference = (nextPreference: ThemePreference) => {
    preference.value = nextPreference;

    if (import.meta.client) {
      window.localStorage.setItem(STORAGE_KEY, nextPreference);
    }

    syncTheme();
  };

  const cycleThemePreference = () => {
    const currentIndex = themePreferenceOptions.indexOf(preference.value);
    const nextIndex = (currentIndex + 1) % themePreferenceOptions.length;
    const nextPreference = themePreferenceOptions[nextIndex] || 'system';
    setThemePreference(nextPreference);
  };

  const initTheme = () => {
    if (!import.meta.client) {
      return;
    }

    const storedPreference = window.localStorage.getItem(STORAGE_KEY);

    if (isThemePreference(storedPreference)) {
      preference.value = storedPreference;
    }

    syncTheme();

    if (isThemeRuntimeReady) {
      return;
    }

    isThemeRuntimeReady = true;

    watch(preference, (nextPreference) => {
      window.localStorage.setItem(STORAGE_KEY, nextPreference);
      syncTheme();
    });

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (preference.value === 'system') {
        syncTheme();
      }
    };

    colorSchemeQuery.addEventListener('change', handleSystemThemeChange);
  };

  return {
    preference,
    resolvedTheme,
    options: themePreferenceOptions,
    setThemePreference,
    cycleThemePreference,
    initTheme
  };
};
