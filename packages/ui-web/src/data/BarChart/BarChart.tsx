import {
  forwardRef,
  useId,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { useMotionPolicy, type MotionPreference } from '@imthekaiwen/motion';
import { Skeleton } from '../../components/Skeleton/Skeleton';
import { Tooltip } from '../../components/Tooltip/Tooltip';
import type { ChartDatum } from '../chart-types';

export type BarChartOrientation = 'horizontal' | 'vertical';

export type BarChartDatum = ChartDatum;

export interface BarChartProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Accessible and visible chart title. */
  title: ReactNode;
  /** Optional chart context associated with the figure. */
  description?: ReactNode;
  /** Product-owned category values. */
  data: readonly BarChartDatum[];
  /** Formats a visible value and its accessible text. */
  formatValue: (value: number, datum: BarChartDatum) => string;
  /** Optional scale ceiling; values never overflow a smaller supplied maximum. */
  maxValue?: number;
  /** Direction used to compare categories. */
  orientation?: BarChartOrientation;
  /** Persistent empty content rendered inside the chart geometry. */
  emptyState: ReactNode;
  /** Replaces values with geometry-preserving placeholders. */
  loading?: boolean;
  /** Accessible loading announcement. */
  loadingLabel: string;
  /** Number of placeholder categories rendered while loading. */
  loadingItems?: number;
  /** Overrides global motion without bypassing reduced-motion. */
  motion?: MotionPreference;
}

type ChartStyle = CSSProperties & {
  '--kw-chart-value'?: string;
  '--kw-chart-motion-duration'?: string;
  '--kw-chart-motion-easing'?: string;
  '--kw-chart-columns'?: string;
};

/** Responsive single-series bar chart with visible labels and values. */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(
  function BarChart(
    {
      title,
      description,
      data,
      formatValue,
      maxValue,
      orientation = 'horizontal',
      emptyState,
      loading = false,
      loadingLabel,
      loadingItems = 4,
      motion: motionOverride = 'inherit',
      className,
      ...props
    },
    ref,
  ) {
    const titleId = useId();
    const { level, preset } = useMotionPolicy(motionOverride);
    const scaleMaximum = Math.max(
      1,
      maxValue ?? 0,
      ...data.map((datum) => Math.max(0, datum.value)),
    );
    const motionStyle: ChartStyle = {
      '--kw-chart-motion-duration':
        level === 'off' ? '0ms' : `${preset.durationMs}ms`,
      '--kw-chart-motion-easing': preset.easing,
      '--kw-chart-columns': String(
        Math.max(1, loading ? loadingItems : data.length),
      ),
    };

    return (
      <figure
        {...props}
        ref={ref}
        className={['kw-bar-chart', className].filter(Boolean).join(' ')}
        data-orientation={orientation}
        data-motion-level={level}
        style={{ ...motionStyle, ...props.style }}
        aria-busy={loading || undefined}
        aria-labelledby={
          props['aria-labelledby'] ??
          (props['aria-label'] ? undefined : titleId)
        }
      >
        <figcaption className="kw-bar-chart__caption">
          <strong id={titleId}>{title}</strong>
          {description ? <span>{description}</span> : null}
        </figcaption>
        {loading ? (
          <div
            className="kw-bar-chart__plot"
            role="status"
            aria-label={loadingLabel}
          >
            {Array.from({ length: Math.max(1, loadingItems) }, (_, index) => (
              <div className="kw-bar-chart__item" key={index}>
                <Skeleton
                  className="kw-bar-chart__skeleton-label"
                  width="72%"
                  aria-hidden
                />
                <Skeleton
                  className="kw-bar-chart__skeleton-bar"
                  width={`${48 + (index % 3) * 14}%`}
                  aria-hidden
                />
              </div>
            ))}
          </div>
        ) : data.length > 0 ? (
          <ul className="kw-bar-chart__plot">
            {data.map((datum) => {
              const safeValue = Math.max(0, datum.value);
              const formattedValue = formatValue(safeValue, datum);
              const barStyle: ChartStyle = {
                '--kw-chart-value': `${(safeValue / scaleMaximum) * 100}%`,
              };
              return (
                <li className="kw-bar-chart__item" key={datum.id}>
                  <div className="kw-bar-chart__label">
                    <span>{datum.label}</span>
                    {datum.description ? (
                      <small>{datum.description}</small>
                    ) : null}
                  </div>
                  <Tooltip
                    content={`${datum.label}: ${formattedValue}`}
                    delayDuration={150}
                  >
                    <div
                      className="kw-bar-chart__track"
                      role="img"
                      aria-label={`${datum.label}: ${formattedValue}`}
                      tabIndex={0}
                    >
                      <span className="kw-bar-chart__bar" style={barStyle} />
                    </div>
                  </Tooltip>
                  <strong className="kw-bar-chart__value">
                    {formattedValue}
                  </strong>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="kw-bar-chart__empty">{emptyState}</div>
        )}
      </figure>
    );
  },
);
