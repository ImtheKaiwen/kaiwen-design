import { describe, it, expect } from "vitest";
import { KaiwenMark, KaiwenWordmark, KaiwenLogo } from "../index.js";

describe("@kaiwen/brand", () => {
  it("exports Kaiwen brand components", () => {
    expect(KaiwenMark).toBeDefined();
    expect(KaiwenWordmark).toBeDefined();
    expect(KaiwenLogo).toBeDefined();
  });
});
