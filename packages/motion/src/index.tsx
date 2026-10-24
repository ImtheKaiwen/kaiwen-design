import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

export const motionLevels = [
  'off',
  'subtle',
  'balanced',
  'expressive',
] as const;
export type MotionLevel = (typeof motionLevels)[number];
export type MotionPreference = MotionLevel | 'inherit';

export const motionPresets = {
  off: {
    pressScale: 1,
    hoverScale: 1,
    transition: { duration: 0 },
    switchStretch: 1,
    durationMs: 0,
    easing: 'linear',
  },
  subtle: {
    pressScale: 0.99,
    hoverScale: 1,
    transition: { duration: 0.14, ease: [0.2, 0, 0, 1] },
    switchStretch: 1,
    durationMs: 140,
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  balanced: {
    pressScale: 0.975,
    hoverScale: 1,
    transition: { type: 'spring', stiffness: 440, damping: 32, mass: 0.55 },
    switchStretch: 1.08,
    durationMs: 190,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
  expressive: {
    pressScale: 0.965,
    hoverScale: 1,
    transition: { type: 'spring', stiffness: 520, damping: 22, mass: 0.6 },
    switchStretch: 1.2,
    durationMs: 240,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

type MotionContextValue = {
  level: MotionLevel;
  reduced: boolean;
};

const MotionContext = createContext<MotionContextValue>({
  level: 'balanced',
  reduced: false,
});

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

export interface MotionProviderProps extends PropsWithChildren {
  /** Global animation richness. OS reduced-motion always takes precedence. */
  level?: MotionLevel;
}

export function MotionProvider({
  children,
  level = 'balanced',
}: MotionProviderProps) {
  const reduced = useReducedMotionPreference();
  const value = useMemo(
    () => ({ level: reduced ? 'off' : level, reduced }),
    [level, reduced],
  );
  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export function useMotionPolicy(override: MotionPreference = 'inherit') {
  const context = useContext(MotionContext);
  const level = context.reduced
    ? 'off'
    : override === 'inherit'
      ? context.level
      : override;
  return { level, reduced: context.reduced, preset: motionPresets[level] };
}
