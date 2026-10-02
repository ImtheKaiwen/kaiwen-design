import { vi } from "vitest";

vi.mock("react-native", () => ({
  View: "View",
  Text: "Text",
  Pressable: "Pressable",
  TextInput: "TextInput",
  ActivityIndicator: "ActivityIndicator",
  Animated: {
    Value: class {
      interpolate() {
        return this;
      }
    },
    loop: () => ({ start: vi.fn(), stop: vi.fn() }),
    sequence: () => ({ start: vi.fn(), stop: vi.fn() }),
    timing: () => ({ start: vi.fn(), stop: vi.fn() }),
    View: "Animated.View",
  },
  useColorScheme: () => "dark",
}));
