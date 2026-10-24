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
import type { ChartSeries, GroupedChartDatum } from '../chart-types';

export type StackedBarChartDatum = GroupedChartDatum;
export type StackedBarChartSeries = ChartSeries;
export type StackedBarChartOrientation = 'horizontal' | 'vertical';

export interface StackedBarChartProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Accessible and visible chart title. */
  title: ReactNode;
  /** Optional chart context associated with the figure. */
  description?: ReactNode;
  /** Product-owned categories and their series values. */
  data: readonly StackedBarChartDatum[];
  /** Ordered series metadata used by every stack and the persistent legend. */
  series: readonly StackedBarChartSeries[];
  /** Formats segment and category totals. */
  formatValue: (
    value: number,
    datum: StackedBarChartDatum,
    series?: StackedBarChartSeries,
  ) => string;
  /** Formats numeric values displayed on the value axis. */
  formatAxisValue: (value: number) => string;
  /** Localized accessible name for the scrollable plot. */
  plotLabel: string;
  /** Localized accessible name for the persistent series legend. */
  legendLabel: string;
  /** Localized accessible name for the value axis. */
  axisLabel: string;
  /** Direction in which category stacks grow. */
  orientation?: StackedBarChartOrientation;
  /** Optional scale ceiling; category totals never overflow a smaller value. */
  maxValue?: number;
  /** Number of equal intervals drawn on the value axis. */
  axisTickCount?: number;
  /** Persistent empty content rendered instead of empty geometry. */
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

type StackedBarStyle = CSSProperties & {
  '--kw-stacked-bar-color'?: string;
  '--kw-stacked-bar-value'?: string;
  '--kw-stacked-axis-position'?: string;
  '--kw-stacked-bar-columns'?: string;
  '--kw-chart-motion-duration'?: string;
  '--kw-chart-motion-easing'?: string;
};

const seriesColors = [
  'var(--kw-chart-series-primary)',
  'var(--kw-chart-series-secondary)',
  'var(--kw-chart-series-tertiary)',
  'var(--kw-chart-series-quaternary)',
  'var(--kw-chart-series-quinary)',
] as const;

/** Accessible multi-series stacked bar chart with a visible numeric axis. */
export const StackedBarChart = forwardRef<HTMLElement, StackedBarChartProps>(
  function StackedBarChart(
    {
      title,
      description,
      data,
      series,
      formatValue,
      formatAxisValue,
      plotLabel,
      legendLabel,
      axisLabel,
      orientation = 'vertical',
      maxValue,
      axisTickCount = 4,
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
    const totals = data.map((datum) =>
      series.reduce(
        (total, item) => total + Math.max(0, datum.values[item.id] ?? 0),
        0,
      ),
    );
    const scaleMaximum = Math.max(1, maxValue ?? 0, ...totals);
    const intervalCount = Math.min(8, Math.max(2, Math.round(axisTickCount)));
    const ticks = Array.from({ length: intervalCount + 1 }, (_, index) => {
      const value = (scaleMaximum * (intervalCount - index)) / intervalCount;
      return {
        value,
        position: `${(value / scaleMaximum) * 100}%`,
      };
    });
    const chartStyle: StackedBarStyle = {
      '--kw-stacked-bar-columns': String(
        Math.max(1, loading ? loadingItems : data.length),
      ),
      '--kw-chart-motion-duration':
        level === 'off' ? '0ms' : `${preset.durationMs}ms`,
      '--kw-chart-motion-easing': preset.easing,
    };
    const hasData = data.length > 0 && series.length > 0;

    return (
      <figure
        {...props}
        ref={ref}
        className={['kw-stacked-bar-chart', className]
          .filter(Boolean)
          .join(' ')}
        data-orientation={orientation}
        data-motion-level={level}
        style={{ ...chartStyle, ...props.style }}
        aria-busy={loading || undefined}
        aria-labelledby={
          props['aria-labelledby'] ??
          (props['aria-label'] ? undefined : titleId)
        }
      >
        <figcaption className="kw-stacked-bar-chart__caption">
          <strong id={titleId}>{title}</strong>
          {description ? <span>{description}</span> : null}
        </figcaption>

        {series.length > 0 ? (
          <ul className="kw-stacked-bar-chart__legend" aria-label={legendLabel}>
            {series.map((item, index) => (
              <li key={item.id} data-series-index={index % seriesColors.length}>
                <span
                  className="kw-stacked-bar-chart__marker"
                  style={
                    {
                      '--kw-stacked-bar-color':
                        seriesColors[index % seriesColors.length],
                    } as StackedBarStyle
                  }
                  aria-hidden
                />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {loading ? (
          <div
            className="kw-stacked-bar-chart__scroller"
            role="status"
            aria-label={loadingLabel}
          >
            <div className="kw-stacked-bar-chart__loading-plot" aria-hidden>
              {Array.from({ length: Math.max(1, loadingItems) }, (_, index) => (
                <div className="kw-stacked-bar-chart__loading-item" key={index}>
                  <Skeleton
                    className="kw-stacked-bar-chart__skeleton-bar"
                    width={`${54 + (index % 3) * 14}%`}
                  />
                  <Skeleton width="68%" />
                </div>
              ))}
            </div>
          </div>
        ) : hasData ? (
          <div
            className="kw-stacked-bar-chart__scroller"
            role="region"
            aria-label={plotLabel}
            tabIndex={0}
          >
            <div className="kw-stacked-bar-chart__canvas">
              <ol className="kw-stacked-bar-chart__axis" aria-label={axisLabel}>
                {ticks.map((tick) => (
                  <li
                    key={tick.position}
                    style={
                      {
                        '--kw-stacked-axis-position': tick.position,
                      } as StackedBarStyle
                    }
                  >
                    <span>{formatAxisValue(tick.value)}</span>
                    <i aria-hidden />
                  </li>
                ))}
              </ol>
              <ul className="kw-stacked-bar-chart__plot">
                {data.map((datum, datumIndex) => {
                  const total = totals[datumIndex] ?? 0;
                  return (
                    <li
                      className="kw-stacked-bar-chart__category"
                      key={datum.id}
                    >
                      <div className="kw-stacked-bar-chart__stack">
                        {series.map((item, index) => {
                          const value = Math.max(0, datum.values[item.id] ?? 0);
                          const formattedValue = formatValue(
                            value,
                            datum,
                            item,
                          );
                          const accessibleValue = `${datum.label}, ${item.label}: ${formattedValue}`;
                          return (
                            <Tooltip
                              content={accessibleValue}
                              delayDuration={150}
                              key={item.id}
                            >
                              <button
                                type="button"
                                className="kw-stacked-bar-chart__segment"
                                data-series-index={index % seriesColors.length}
                                aria-label={accessibleValue}
                                style={
                                  {
                                    '--kw-stacked-bar-color':
                                      seriesColors[index % seriesColors.length],
                                    '--kw-stacked-bar-value': `${(value / scaleMaximum) * 100}%`,
                                  } as StackedBarStyle
                                }
                              />
                            </Tooltip>
                          );
                        })}
                      </div>
                      <div className="kw-stacked-bar-chart__category-label">
                        <strong>{datum.label}</strong>
                        <span>{formatValue(total, datum)}</span>
                        {datum.description ? (
                          <small>{datum.description}</small>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <div className="kw-stacked-bar-chart__empty">{emptyState}</div>
        )}
      </figure>
    );
  },
);
