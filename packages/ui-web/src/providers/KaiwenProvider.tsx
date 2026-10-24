import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { MotionProvider, type MotionLevel } from '@imthekaiwen/motion';
import type { Density, ThemePreference } from '@imthekaiwen/tokens';

export type { Density, ThemePreference } from '@imthekaiwen/tokens';

type ResolvedTheme = Exclude<ThemePreference, 'system'>;
type PreferencesContextValue = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  motion: MotionLevel;
  density: Density;
  locale: string;
};

const PreferencesContext = createContext<PreferencesContextValue>({
  theme: 'system',
  resolvedTheme: 'light',
  motion: 'balanced',
  density: 'comfortable',
  locale: 'en',
});

function useResolvedTheme(theme: ThemePreference): ResolvedTheme {
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemTheme(media.matches ? 'dark' : 'light');
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return theme === 'system' ? systemTheme : theme;
}

export interface KaiwenProviderProps extends PropsWithChildren {
  /** Visual theme preference; system follows the operating system. */
  theme?: ThemePreference;
  /** Global motion richness; reduced-motion overrides this value. */
  motion?: MotionLevel;
  /** Spacing density applied through design tokens. */
  density?: Density;
  /** Locale metadata for future formatting adapters; no translation dictionary is included. */
  locale?: string;
  className?: string;
}

export function KaiwenProvider({
  children,
  theme = 'system',
  motion = 'balanced',
  density = 'comfortable',
  locale = 'en',
  className,
}: KaiwenProviderProps) {
  const resolvedTheme = useResolvedTheme(theme);
  const value = useMemo(
    () => ({ theme, resolvedTheme, motion, density, locale }),
    [theme, resolvedTheme, motion, density, locale],
  );

  return (
    <PreferencesContext.Provider value={value}>
      <MotionProvider level={motion}>
        <div
          className={['kaiwen-scope', className].filter(Boolean).join(' ')}
          data-theme={resolvedTheme}
          data-theme-preference={theme}
          data-motion={motion}
          data-density={density}
          lang={locale}
        >
          {children}
        </div>
      </MotionProvider>
    </PreferencesContext.Provider>
  );
}

export function useKaiwenPreferences() {
  return useContext(PreferencesContext);
}
