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

export type GroupedBarChartDatum = GroupedChartDatum;
export type GroupedBarChartSeries = ChartSeries;

export interface GroupedBarChartProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Accessible and visible chart title. */
  title: ReactNode;
  /** Optional chart context associated with the figure. */
  description?: ReactNode;
  /** Product-owned categories and their series values. */
  data: readonly GroupedBarChartDatum[];
  /** Ordered series metadata used by the plot and persistent legend. */
  series: readonly GroupedBarChartSeries[];
  /** Formats every visible value and its accessible text. */
  formatValue: (
    value: number,
    datum: GroupedBarChartDatum,
    series: GroupedBarChartSeries,
  ) => string;
  /** Localized accessible name for the horizontally scrollable plot. */
  plotLabel: string;
  /** Localized accessible name for the persistent series legend. */
  legendLabel: string;
  /** Optional scale ceiling; values never overflow a smaller supplied maximum. */
  maxValue?: number;
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

type GroupedBarStyle = CSSProperties & {
  '--kw-grouped-bar-color'?: string;
  '--kw-grouped-bar-value'?: string;
  '--kw-grouped-bar-columns'?: string;
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

/** Accessible grouped vertical bar chart with persistent series labels. */
export const GroupedBarChart = forwardRef<HTMLElement, GroupedBarChartProps>(
  function GroupedBarChart(
    {
      title,
      description,
      data,
      series,
      formatValue,
      plotLabel,
      legendLabel,
      maxValue,
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
      ...data.flatMap((datum) =>
        series.map((item) => Math.max(0, datum.values[item.id] ?? 0)),
      ),
    );
    const chartStyle: GroupedBarStyle = {
      '--kw-grouped-bar-columns': String(
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
        className={['kw-grouped-bar-chart', className]
          .filter(Boolean)
          .join(' ')}
        data-motion-level={level}
        style={{ ...chartStyle, ...props.style }}
        aria-busy={loading || undefined}
        aria-labelledby={
          props['aria-labelledby'] ??
          (props['aria-label'] ? undefined : titleId)
        }
      >
        <figcaption className="kw-grouped-bar-chart__caption">
          <strong id={titleId}>{title}</strong>
          {description ? <span>{description}</span> : null}
        </figcaption>

        {series.length > 0 ? (
          <ul className="kw-grouped-bar-chart__legend" aria-label={legendLabel}>
            {series.map((item, index) => (
              <li key={item.id} data-series-index={index % seriesColors.length}>
                <span
                  className="kw-grouped-bar-chart__marker"
                  style={
                    {
                      '--kw-grouped-bar-color':
                        seriesColors[index % seriesColors.length],
                    } as GroupedBarStyle
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
            className="kw-grouped-bar-chart__scroller"
            role="status"
            aria-label={loadingLabel}
          >
            <div className="kw-grouped-bar-chart__plot" aria-hidden>
              {Array.from(
                { length: Math.max(1, loadingItems) },
                (_, categoryIndex) => (
                  <div
                    className="kw-grouped-bar-chart__category"
                    key={categoryIndex}
                  >
                    <div className="kw-grouped-bar-chart__bars">
                      {Array.from(
                        { length: Math.max(1, series.length) },
                        (_, seriesIndex) => (
                          <Skeleton
                            className="kw-grouped-bar-chart__skeleton-bar"
                            key={seriesIndex}
                            style={{
                              height: `${42 + ((categoryIndex + seriesIndex) % 4) * 13}%`,
                            }}
                          />
                        ),
                      )}
                    </div>
                    <Skeleton width="70%" />
                  </div>
                ),
              )}
            </div>
          </div>
        ) : hasData ? (
          <div
            className="kw-grouped-bar-chart__scroller"
            role="region"
            aria-label={plotLabel}
            tabIndex={0}
          >
            <ul className="kw-grouped-bar-chart__plot">
              {data.map((datum) => (
                <li className="kw-grouped-bar-chart__category" key={datum.id}>
                  <div className="kw-grouped-bar-chart__bars">
                    {series.map((item, index) => {
                      const value = Math.max(0, datum.values[item.id] ?? 0);
                      const formattedValue = formatValue(value, datum, item);
                      const accessibleValue = `${datum.label}, ${item.label}: ${formattedValue}`;
                      return (
                        <div
                          className="kw-grouped-bar-chart__bar-column"
                          data-series-index={index % seriesColors.length}
                          key={item.id}
                        >
                          <span className="kw-grouped-bar-chart__value">
                            {formattedValue}
                          </span>
                          <Tooltip
                            content={accessibleValue}
                            delayDuration={150}
                          >
                            <div
                              className="kw-grouped-bar-chart__track"
                              role="img"
                              aria-label={accessibleValue}
                              tabIndex={0}
                            >
                              <span
                                className="kw-grouped-bar-chart__bar"
                                style={
                                  {
                                    '--kw-grouped-bar-color':
                                      seriesColors[index % seriesColors.length],
                                    '--kw-grouped-bar-value': `${(value / scaleMaximum) * 100}%`,
                                  } as GroupedBarStyle
                                }
                              />
                            </div>
                          </Tooltip>
                        </div>
                      );
                    })}
                  </div>
                  <div className="kw-grouped-bar-chart__label">
                    <strong>{datum.label}</strong>
                    {datum.description ? (
                      <small>{datum.description}</small>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="kw-grouped-bar-chart__empty">{emptyState}</div>
        )}
      </figure>
    );
  },
);
