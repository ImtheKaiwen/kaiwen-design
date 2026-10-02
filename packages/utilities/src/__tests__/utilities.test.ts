import { describe, it, expect } from "vitest";
import {
  cn,
  generateId,
  getSafeLinkProps,
  visuallyHiddenStyle,
} from "../index.js";

describe("@kaiwen/utilities", () => {
  it("cn merges class strings, arrays, and objects correctly", () => {
    expect(cn("btn", "btn-primary")).toBe("btn btn-primary");
    expect(cn("btn", false && "disabled", "active")).toBe("btn active");
    expect(cn("base", ["extra1", "extra2"])).toBe("base extra1 extra2");
    expect(cn("card", { active: true, disabled: false })).toBe("card active");
  });

  it("generateId generates incremented unique ids", () => {
    const id1 = generateId("test");
    const id2 = generateId("test");
    expect(id1).not.toBe(id2);
    expect(id1).toContain("test-");
  });

  it("getSafeLinkProps automatically injects noopener noreferrer for target=_blank", () => {
    const safeProps = getSafeLinkProps({
      href: "https://example.com",
      target: "_blank",
    });
    expect(safeProps.rel).toContain("noopener");
    expect(safeProps.rel).toContain("noreferrer");
    expect(safeProps.isExternal).toBe(true);
  });

  it("visuallyHiddenStyle provides valid CSSProperties", () => {
    expect(visuallyHiddenStyle.position).toBe("absolute");
    expect(visuallyHiddenStyle.width).toBe("1px");
    expect(visuallyHiddenStyle.height).toBe("1px");
  });
});
