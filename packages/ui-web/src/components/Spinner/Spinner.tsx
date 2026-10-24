import { forwardRef, type HTMLAttributes } from 'react';
import { useMotionPolicy, type MotionPreference } from '@imthekaiwen/motion';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Accessible loading message. Localized products should provide their own label. */
  label?: string;
  /** Visual size of the progress indicator. */
  size?: 'sm' | 'md' | 'lg';
  /** Overrides global motion without bypassing reduced-motion. */
  motion?: MotionPreference;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner(
    {
      label = 'Loading',
      size = 'md',
      motion: motionOverride = 'inherit',
      className,
      ...props
    },
    ref,
  ) {
    const { level } = useMotionPolicy(motionOverride);
    return (
      <span
        {...props}
        ref={ref}
        role="status"
        aria-label={label}
        data-size={size}
        data-motion-level={level}
        className={['kw-spinner', className].filter(Boolean).join(' ')}
      />
    );
  },
);
