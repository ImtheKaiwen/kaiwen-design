/** Shared categorical datum contract for charts with visible labels and values. */
export interface ChartDatum {
  /** Stable identifier for this category. */
  id: string;
  /** Visible category label. */
  label: string;
  /** Non-negative numeric value represented by the chart. */
  value: number;
  /** Optional supporting context shown with the category. */
  description?: string;
}

/** Visible series metadata shared by charts that compare multiple values. */
export interface ChartSeries {
  /** Stable identifier matching a key in each category's values. */
  id: string;
  /** Visible and accessible series label. */
  label: string;
}

/** Category datum for grouped charts with one value per declared series. */
export interface GroupedChartDatum {
  /** Stable identifier for this category. */
  id: string;
  /** Visible category label. */
  label: string;
  /** Optional supporting context shown below the category. */
  description?: string;
  /** Numeric values keyed by a declared series identifier. */
  values: Readonly<Record<string, number>>;
}
