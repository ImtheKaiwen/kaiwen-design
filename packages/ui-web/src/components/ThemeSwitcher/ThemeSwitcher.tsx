import { forwardRef, useId, useState, type HTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { Monitor, Moon, Sun } from '@imthekaiwen/icons';
import { useMotionPolicy, type MotionPreference } from '@imthekaiwen/motion';
import type { ThemePreference } from '@imthekaiwen/tokens';

export interface ThemeSwitcherLabels {
  light: string;
  dark: string;
  system: string;
}

export interface ThemeSwitcherProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Accessible name for the complete theme preference control. */
  label: string;
  /** Localized visible names for each supported preference. */
  labels: ThemeSwitcherLabels;
  /** Controlled theme preference. */
  value?: ThemePreference;
  /** Initial preference for uncontrolled use. */
  defaultValue?: ThemePreference;
  /** Reports preference changes; persistence and provider updates belong to the application. */
  onValueChange?: (value: ThemePreference) => void;
  /** Control density. */
  size?: 'sm' | 'md';
  /** Prevents every preference from being changed. */
  disabled?: boolean;
  /** Overrides global motion without bypassing reduced-motion. */
  motion?: MotionPreference;
}

const options = [
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
  { value: 'system', icon: Monitor },
] as const;

/** Selects light, dark, or operating-system theme without owning persistence. */
export const ThemeSwitcher = forwardRef<HTMLDivElement, ThemeSwitcherProps>(
  function ThemeSwitcher(
    {
      label,
      labels,
      value,
      defaultValue = 'system',
      onValueChange,
      size = 'md',
      disabled = false,
      motion: motionOverride = 'inherit',
      className,
      ...props
    },
    ref,
  ) {
    const [uncontrolledValue, setUncontrolledValue] =
      useState<ThemePreference>(defaultValue);
    const selectedValue = value ?? uncontrolledValue;
    const indicatorId = useId();
    const { level, preset } = useMotionPolicy(motionOverride);
    const stretch =
      level === 'balanced' || level === 'expressive'
        ? [1, preset.switchStretch, 1]
        : 1;

    const select = (nextValue: ThemePreference) => {
      if (disabled || nextValue === selectedValue) return;
      if (value === undefined) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    };

    return (
      <div
        {...props}
        ref={ref}
        className={['kw-theme-switcher', className].filter(Boolean).join(' ')}
        role="group"
        aria-label={label}
        data-size={size}
        data-disabled={disabled || undefined}
        data-motion-level={level}
      >
        {options.map(({ value: optionValue, icon: Icon }) => (
          <button
            key={optionValue}
            className="kw-theme-switcher__option"
            type="button"
            aria-pressed={selectedValue === optionValue}
            disabled={disabled}
            onClick={() => select(optionValue)}
          >
            {selectedValue === optionValue ? (
              <motion.span
                className="kw-theme-switcher__indicator"
                layoutId={`kw-theme-switcher-${indicatorId}`}
                initial={false}
                animate={{ scaleX: stretch }}
                transition={
                  level === 'off'
                    ? { duration: 0 }
                    : {
                        layout: preset.transition,
                        scaleX: {
                          duration: preset.durationMs / 1000,
                          ease: [0.2, 0, 0, 1],
                          times: [0, 0.46, 1],
                        },
                      }
                }
                aria-hidden
              />
            ) : null}
            <span className="kw-theme-switcher__option-content">
              <Icon size={16} aria-hidden="true" />
              <span>{labels[optionValue]}</span>
            </span>
          </button>
        ))}
      </div>
    );
  },
);
