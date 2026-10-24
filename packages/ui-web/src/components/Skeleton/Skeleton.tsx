import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { useMotionPolicy, type MotionPreference } from '@imthekaiwen/motion';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Geometry of the placeholder. */
  variant?: 'text' | 'rectangular' | 'circular';
  /** Reserved inline size. Prefer matching the final content geometry. */
  width?: CSSProperties['width'];
  /** Reserved block size. Prefer matching the final content geometry. */
  height?: CSSProperties['height'];
  /** Overrides global motion without bypassing reduced-motion. */
  motion?: MotionPreference;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    {
      variant = 'rectangular',
      width,
      height,
      motion: motionOverride = 'inherit',
      className,
      style,
      ...props
    },
    ref,
  ) {
    const { level } = useMotionPolicy(motionOverride);
    return (
      <div
        {...props}
        ref={ref}
        aria-hidden="true"
        data-variant={variant}
        data-motion-level={level}
        className={['kw-skeleton', className].filter(Boolean).join(' ')}
        style={{ ...style, width, height }}
      />
    );
  },
);
