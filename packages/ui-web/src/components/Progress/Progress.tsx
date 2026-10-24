import {
  forwardRef,
  useId,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { useMotionPolicy, type MotionPreference } from '@imthekaiwen/motion';

export interface ProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Visible label associated with the progressbar. */
  label: ReactNode;
  /** Current measurable value. Values outside the range are clamped. */
  value: number;
  /** Upper bound for the value. Must be greater than zero. */
  max?: number;
  /** Human-readable value announced instead of the numeric value. */
  valueText?: string;
  /** Shows the calculated percentage next to the label. */
  showValue?: boolean;
  /** Overrides global motion without bypassing reduced-motion. */
  motion?: MotionPreference;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(
    {
      label,
      value,
      max = 100,
      valueText,
      showValue = false,
      motion: motionOverride = 'inherit',
      className,
      style,
      ...props
    },
    ref,
  ) {
    const labelId = useId();
    const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
    const safeValue = Number.isFinite(value)
      ? Math.min(Math.max(value, 0), safeMax)
      : 0;
    const percentage = (safeValue / safeMax) * 100;
    const { level, preset } = useMotionPolicy(motionOverride);

    return (
      <div
        {...props}
        ref={ref}
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
        aria-valuetext={valueText}
        data-motion-level={level}
        className={['kw-progress', className].filter(Boolean).join(' ')}
        style={
          {
            ...style,
            '--kw-progress-value': `${percentage}%`,
            '--kw-progress-duration': `${preset.durationMs}ms`,
            '--kw-progress-easing': preset.easing,
          } as CSSProperties
        }
      >
        <div className="kw-progress__header">
          <span id={labelId}>{label}</span>
          {showValue ? (
            <span aria-hidden="true">{Math.round(percentage)}%</span>
          ) : null}
        </div>
        <div className="kw-progress__track">
          <span className="kw-progress__indicator" />
        </div>
      </div>
    );
  },
);
