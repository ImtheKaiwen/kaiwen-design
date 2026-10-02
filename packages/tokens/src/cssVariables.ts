import { darkTheme, lightTheme, type Theme } from "./theme.js";

/**
 * Generate CSS variable declarations for a given theme
 */
export function themeToCssVariables(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  vars["--kaiwen-color-bg-primary"] = theme.colors.background.primary;
  vars["--kaiwen-color-bg-secondary"] = theme.colors.background.secondary;
  vars["--kaiwen-color-bg-tertiary"] = theme.colors.background.tertiary;

  vars["--kaiwen-color-surface-primary"] = theme.colors.surface.primary;
  vars["--kaiwen-color-surface-secondary"] = theme.colors.surface.secondary;
  vars["--kaiwen-color-surface-tertiary"] = theme.colors.surface.tertiary;
  vars["--kaiwen-color-surface-elevated"] = theme.colors.surface.elevated;
  vars["--kaiwen-color-surface-hover"] = theme.colors.surface.hover;
  vars["--kaiwen-color-surface-active"] = theme.colors.surface.active;

  vars["--kaiwen-color-text-primary"] = theme.colors.text.primary;
  vars["--kaiwen-color-text-secondary"] = theme.colors.text.secondary;
  vars["--kaiwen-color-text-muted"] = theme.colors.text.muted;
  vars["--kaiwen-color-text-subtle"] = theme.colors.text.subtle;
  vars["--kaiwen-color-text-inverse"] = theme.colors.text.inverse;

  vars["--kaiwen-color-border-default"] = theme.colors.border.default;
  vars["--kaiwen-color-border-subtle"] = theme.colors.border.subtle;
  vars["--kaiwen-color-border-strong"] = theme.colors.border.strong;
  vars["--kaiwen-color-border-focus"] = theme.colors.border.focus;

  vars["--kaiwen-color-status-success"] = theme.colors.status.success;
  vars["--kaiwen-color-status-success-subtle"] =
    theme.colors.status.successSubtle;
  vars["--kaiwen-color-status-warning"] = theme.colors.status.warning;
  vars["--kaiwen-color-status-warning-subtle"] =
    theme.colors.status.warningSubtle;
  vars["--kaiwen-color-status-error"] = theme.colors.status.error;
  vars["--kaiwen-color-status-error-subtle"] = theme.colors.status.errorSubtle;
  vars["--kaiwen-color-status-info"] = theme.colors.status.info;
  vars["--kaiwen-color-status-info-subtle"] = theme.colors.status.infoSubtle;

  vars["--kaiwen-color-interactive-primary-bg"] =
    theme.colors.interactive.primaryBg;
  vars["--kaiwen-color-interactive-primary-text"] =
    theme.colors.interactive.primaryText;
  vars["--kaiwen-color-interactive-primary-hover"] =
    theme.colors.interactive.primaryHover;
  vars["--kaiwen-color-interactive-secondary-bg"] =
    theme.colors.interactive.secondaryBg;
  vars["--kaiwen-color-interactive-secondary-text"] =
    theme.colors.interactive.secondaryText;
  vars["--kaiwen-color-interactive-secondary-hover"] =
    theme.colors.interactive.secondaryHover;
  vars["--kaiwen-color-interactive-ghost-hover"] =
    theme.colors.interactive.ghostHover;
  vars["--kaiwen-color-interactive-danger-bg"] =
    theme.colors.interactive.dangerBg;
  vars["--kaiwen-color-interactive-danger-text"] =
    theme.colors.interactive.dangerText;
  vars["--kaiwen-color-interactive-danger-hover"] =
    theme.colors.interactive.dangerHover;
  vars["--kaiwen-color-interactive-focus-ring"] =
    theme.colors.interactive.focusRing;
  vars["--kaiwen-color-interactive-disabled-bg"] =
    theme.colors.interactive.disabledBg;
  vars["--kaiwen-color-interactive-disabled-text"] =
    theme.colors.interactive.disabledText;

  // Shadows
  vars["--kaiwen-shadow-sm"] = theme.shadows.sm;
  vars["--kaiwen-shadow-md"] = theme.shadows.md;
  vars["--kaiwen-shadow-lg"] = theme.shadows.lg;
  vars["--kaiwen-shadow-xl"] = theme.shadows.xl;

  return vars;
}

/**
 * Generate full CSS string with root/theme selectors
 */
export function generateTokensCss(): string {
  const sharedVars: Record<string, string> = {};

  // Spacing
  Object.entries(darkTheme.spacing).forEach(([key, val]) => {
    sharedVars[`--kaiwen-space-${key}`] = val;
  });

  // Radius
  Object.entries(darkTheme.radius).forEach(([key, val]) => {
    sharedVars[`--kaiwen-radius-${key}`] = val;
  });

  // Typography
  sharedVars["--kaiwen-font-sans"] = darkTheme.typography.fontFamilies.sans;
  sharedVars["--kaiwen-font-mono"] = darkTheme.typography.fontFamilies.mono;

  // Motion
  sharedVars["--kaiwen-duration-fast"] = darkTheme.motion.duration.fast;
  sharedVars["--kaiwen-duration-normal"] = darkTheme.motion.duration.normal;
  sharedVars["--kaiwen-duration-slow"] = darkTheme.motion.duration.slow;
  sharedVars["--kaiwen-duration-skeleton"] = darkTheme.motion.duration.skeleton;
  sharedVars["--kaiwen-easing-standard"] = darkTheme.motion.easing.standard;
  sharedVars["--kaiwen-easing-enter"] = darkTheme.motion.easing.enter;
  sharedVars["--kaiwen-easing-exit"] = darkTheme.motion.easing.exit;
  sharedVars["--kaiwen-easing-spring"] = darkTheme.motion.easing.spring;

  // Z-Index
  Object.entries(darkTheme.zIndex).forEach(([key, val]) => {
    sharedVars[`--kaiwen-z-${key}`] = String(val);
  });

  const darkVars = themeToCssVariables(darkTheme);
  const lightVars = themeToCssVariables(lightTheme);

  const formatBlock = (entries: Record<string, string>) =>
    Object.entries(entries)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n");

  return `/**
 * Kaiwen Design System - Generated Tokens CSS
 * Do not edit manually. Generated from @kaiwen/tokens.
 */

:root,
[data-theme="dark"],
.dark {
${formatBlock({ ...sharedVars, ...darkVars })}
}

[data-theme="light"],
.light {
${formatBlock(lightVars)}
}
`;
}
