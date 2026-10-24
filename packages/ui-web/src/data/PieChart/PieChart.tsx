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

export type PieChartDatum = ChartDatum;

export interface PieChartProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Accessible and visible chart title. */
  title: ReactNode;
  /** Optional chart context associated with the figure. */
  description?: ReactNode;
  /** Product-owned category values. */
  data: readonly PieChartDatum[];
  /** Formats each visible and accessible category value. */
  formatValue: (value: number, datum: PieChartDatum) => string;
  /** Localized accessible name for the focusable segment group. */
  segmentsLabel: string;
  /** Persistent empty content rendered instead of an empty geometry. */
  emptyState: ReactNode;
  /** Replaces values with geometry-preserving placeholders. */
  loading?: boolean;
  /** Accessible loading announcement. */
  loadingLabel: string;
  /** Overrides global motion without bypassing reduced-motion. */
  motion?: MotionPreference;
}

type PieStyle = CSSProperties & {
  '--kw-chart-motion-duration'?: string;
  '--kw-chart-motion-easing'?: string;
  '--kw-pie-color'?: string;
};

const seriesColors = [
  'var(--kw-chart-series-primary)',
  'var(--kw-chart-series-secondary)',
  'var(--kw-chart-series-tertiary)',
  'var(--kw-chart-series-quaternary)',
  'var(--kw-chart-series-quinary)',
] as const;

/** Accessible single-series donut chart with a persistent legend and focus tooltips. */
export const PieChart = forwardRef<HTMLElement, PieChartProps>(
  function PieChart(
    {
      title,
      description,
      data,
      formatValue,
      segmentsLabel,
      emptyState,
      loading = false,
      loadingLabel,
      motion: motionOverride = 'inherit',
      className,
      ...props
    },
    ref,
  ) {
    const titleId = useId();
    const { level, preset } = useMotionPolicy(motionOverride);
    const safeData = data.map((datum) => ({
      ...datum,
      value: Math.max(0, datum.value),
    }));
    const total = safeData.reduce((sum, datum) => sum + datum.value, 0);
    let cumulativePercentage = 0;
    const motionStyle: PieStyle = {
      '--kw-chart-motion-duration':
        level === 'off' ? '0ms' : `${preset.durationMs}ms`,
      '--kw-chart-motion-easing': preset.easing,
    };

    return (
      <figure
        {...props}
        ref={ref}
        className={['kw-pie-chart', className].filter(Boolean).join(' ')}
        data-motion-level={level}
        style={{ ...motionStyle, ...props.style }}
        aria-busy={loading || undefined}
        aria-labelledby={
          props['aria-labelledby'] ??
          (props['aria-label'] ? undefined : titleId)
        }
      >
        <figcaption className="kw-pie-chart__caption">
          <strong id={titleId}>{title}</strong>
          {description ? <span>{description}</span> : null}
        </figcaption>
        {loading ? (
          <div
            className="kw-pie-chart__body"
            role="status"
            aria-label={loadingLabel}
          >
            <Skeleton className="kw-pie-chart__skeleton-plot" aria-hidden />
            <div className="kw-pie-chart__skeleton-legend" aria-hidden>
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} width={`${74 - index * 7}%`} />
              ))}
            </div>
          </div>
        ) : total > 0 ? (
          <div className="kw-pie-chart__body">
            <svg
              className="kw-pie-chart__plot"
              viewBox="0 0 120 120"
              role="group"
              aria-label={segmentsLabel}
            >
              <circle className="kw-pie-chart__ring" cx="60" cy="60" r="44" />
              <g transform="rotate(-90 60 60)">
                {safeData.map((datum, index) => {
                  const percentage = (datum.value / total) * 100;
                  const offset = -cumulativePercentage;
                  cumulativePercentage += percentage;
                  const formattedValue = formatValue(datum.value, datum);
                  return (
                    <Tooltip
                      key={datum.id}
                      content={`${datum.label}: ${formattedValue}`}
                      delayDuration={150}
                    >
                      <circle
                        className="kw-pie-chart__segment"
                        cx="60"
                        cy="60"
                        r="44"
                        pathLength="100"
                        role="img"
                        aria-label={`${datum.label}: ${formattedValue}`}
                        tabIndex={0}
                        strokeDasharray={`${percentage} ${100 - percentage}`}
                        strokeDashoffset={offset}
                        style={
                          {
                            '--kw-pie-color':
                              seriesColors[index % seriesColors.length],
                          } as PieStyle
                        }
                      />
                    </Tooltip>
                  );
                })}
              </g>
            </svg>
            <ul className="kw-pie-chart__legend">
              {safeData.map((datum, index) => (
                <li key={datum.id}>
                  <span
                    className="kw-pie-chart__legend-marker"
                    style={
                      {
                        '--kw-pie-color':
                          seriesColors[index % seriesColors.length],
                      } as PieStyle
                    }
                    aria-hidden
                  />
                  <span className="kw-pie-chart__legend-copy">
                    <strong>{datum.label}</strong>
                    {datum.description ? (
                      <small>{datum.description}</small>
                    ) : null}
                  </span>
                  <span className="kw-pie-chart__legend-value">
                    {formatValue(datum.value, datum)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="kw-pie-chart__empty">{emptyState}</div>
        )}
      </figure>
    );
  },
);
