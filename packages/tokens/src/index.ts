export const themeNames = ['light', 'dark', 'system'] as const;
export type ThemePreference = (typeof themeNames)[number];

export const densityNames = ['compact', 'comfortable', 'spacious'] as const;
export type Density = (typeof densityNames)[number];

export const tokenMeta = {
  spacing: [
    '0',
    '2',
    '4',
    '6',
    '8',
    '12',
    '16',
    '20',
    '24',
    '32',
    '40',
    '48',
    '64',
  ],
  radius: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
  semanticColors: [
    'surface.canvas',
    'surface.default',
    'surface.subtle',
    'surface.hover',
    'text.primary',
    'text.secondary',
    'text.tertiary',
    'border.subtle',
    'border.strong',
    'action.primary.bg',
    'action.primary.fg',
    'focus.ring',
    'skeleton.base',
    'skeleton.highlight',
    'status.info',
    'status.success',
    'status.warning',
    'status.error',
    'chart.series.primary',
    'chart.series.secondary',
    'chart.series.tertiary',
    'chart.series.quaternary',
    'chart.series.quinary',
    'chart.grid',
    'chart.tooltip.surface',
    'chart.tooltip.text',
  ],
} as const;

export const componentTokens = {
  tooltip: { sideOffset: 6, arrowWidth: 10, arrowHeight: 5 },
} as const;
