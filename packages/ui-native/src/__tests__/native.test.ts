import { describe, it, expect } from "vitest";
import {
  Button,
  IconButton,
  Input,
  PasswordInput,
  NumberInput,
  OTPInput,
  Card,
  Skeleton,
  Stack,
  Box,
  Text,
  KaiwenThemeProvider,
} from "../index.js";

describe("@kaiwen/ui-native", () => {
  it("exports all native components", () => {
    expect(Button).toBeDefined();
    expect(IconButton).toBeDefined();
    expect(Input).toBeDefined();
    expect(PasswordInput).toBeDefined();
    expect(NumberInput).toBeDefined();
    expect(OTPInput).toBeDefined();
    expect(Card).toBeDefined();
    expect(Skeleton).toBeDefined();
    expect(Stack).toBeDefined();
    expect(Box).toBeDefined();
    expect(Text).toBeDefined();
    expect(KaiwenThemeProvider).toBeDefined();
  });
});
