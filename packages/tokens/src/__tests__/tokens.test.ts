import { describe, it, expect } from "vitest";
import {
  darkTheme,
  lightTheme,
  themes,
  spacing,
  radius,
  zIndex,
  duration,
  themeToCssVariables,
  generateTokensCss,
} from "../index.js";

describe("@kaiwen/tokens", () => {
  it("should have darkTheme and lightTheme with correct modes", () => {
    expect(darkTheme.mode).toBe("dark");
    expect(lightTheme.mode).toBe("light");
    expect(themes.dark).toBe(darkTheme);
    expect(themes.light).toBe(lightTheme);
  });

  it("should provide consistent semantic color tokens for both themes", () => {
    const keys = [
      "background",
      "surface",
      "text",
      "border",
      "status",
      "interactive",
    ] as const;
    keys.forEach((key) => {
      expect(darkTheme.colors[key]).toBeDefined();
      expect(lightTheme.colors[key]).toBeDefined();
    });
  });

  it("should have expected spacing geometric scale", () => {
    expect(spacing[0]).toBe("0px");
    expect(spacing[4]).toBe("8px");
    expect(spacing[8]).toBe("16px");
    expect(spacing.md).toBe("16px");
    expect(spacing.lg).toBe("24px");
  });

  it("should have controlled radius tokens", () => {
    expect(radius.none).toBe("0px");
    expect(radius.md).toBe("6px");
    expect(radius.lg).toBe("8px");
    expect(radius.full).toBe("9999px");
  });

  it("should have centralized zIndex values", () => {
    expect(zIndex.base).toBe(0);
    expect(zIndex.dropdown).toBeLessThan(zIndex.sticky);
    expect(zIndex.sticky).toBeLessThan(zIndex.overlay);
    expect(zIndex.overlay).toBeLessThan(zIndex.modal);
    expect(zIndex.modal).toBeLessThan(zIndex.toast);
  });

  it("should have subtle motion tokens", () => {
    expect(duration.fast).toBe("120ms");
    expect(duration.normal).toBe("180ms");
    expect(duration.slow).toBe("280ms");
  });

  it("should generate valid CSS variables and CSS sheet", () => {
    const vars = themeToCssVariables(darkTheme);
    expect(vars["--kaiwen-color-bg-primary"]).toBe(
      darkTheme.colors.background.primary,
    );
    expect(vars["--kaiwen-color-text-primary"]).toBe(
      darkTheme.colors.text.primary,
    );

    const css = generateTokensCss();
    expect(css).toContain(":root,");
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('[data-theme="light"]');
    expect(css).toContain("--kaiwen-space-md");
  });
});
