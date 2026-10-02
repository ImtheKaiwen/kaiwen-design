import { describe, it, expect } from "vitest";
import {
  SearchIcon,
  CheckIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  MoonIcon,
  SunIcon,
  SpinnerIcon,
} from "../index.js";

describe("@kaiwen/icons", () => {
  it("exports core icon components", () => {
    expect(SearchIcon).toBeDefined();
    expect(CheckIcon).toBeDefined();
    expect(CloseIcon).toBeDefined();
    expect(EyeIcon).toBeDefined();
    expect(EyeOffIcon).toBeDefined();
    expect(MoonIcon).toBeDefined();
    expect(SunIcon).toBeDefined();
    expect(SpinnerIcon).toBeDefined();
  });
});
