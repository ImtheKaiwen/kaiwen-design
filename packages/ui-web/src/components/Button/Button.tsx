import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { useMotionPolicy, type MotionPreference } from '@imthekaiwen/motion';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual hierarchy of the action. */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Control height and typography. */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a progress indicator while preserving label geometry and prevents activation. */
  loading?: boolean;
  /** Overrides the global motion level without bypassing reduced-motion. */
  motion?: MotionPreference;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      motion: motionOverride = 'inherit',
      disabled,
      className,
      style,
      type = 'button',
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
      onKeyDown,
      onKeyUp,
      onBlur,
      ...props
    },
    ref,
  ) {
    const [pressed, setPressed] = useState(false);
    const { level, preset } = useMotionPolicy(motionOverride);
    const unavailable = Boolean(disabled || loading);

    const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
      if (!unavailable) setPressed(true);
      onPointerDown?.(event);
    };
    const resetPointer =
      (handler?: (event: PointerEvent<HTMLButtonElement>) => void) =>
      (event: PointerEvent<HTMLButtonElement>) => {
        setPressed(false);
        handler?.(event);
      };
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (!unavailable && (event.key === ' ' || event.key === 'Enter'))
        setPressed(true);
      onKeyDown?.(event);
    };
    const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === ' ' || event.key === 'Enter') setPressed(false);
      onKeyUp?.(event);
    };

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={unavailable}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
        data-pressed={pressed || undefined}
        data-variant={variant}
        data-size={size}
        data-motion-level={level}
        className={['kw-button', className].filter(Boolean).join(' ')}
        style={
          {
            ...style,
            '--kw-button-press-scale': preset.pressScale,
            '--kw-button-hover-scale': preset.hoverScale,
            '--kw-button-motion-duration': `${preset.durationMs}ms`,
            '--kw-button-motion-easing': preset.easing,
          } as CSSProperties
        }
        onPointerDown={handlePointerDown}
        onPointerUp={resetPointer(onPointerUp)}
        onPointerCancel={resetPointer(onPointerCancel)}
        onPointerLeave={resetPointer(onPointerLeave)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={(event) => {
          setPressed(false);
          onBlur?.(event);
        }}
      >
        <span className="kw-button__content" data-hidden={loading || undefined}>
          {children}
        </span>
        {loading ? (
          <span className="kw-button__spinner" aria-hidden="true" />
        ) : null}
      </button>
    );
  },
);
