# Kaiwen Design System

> Production-grade, modular design system and component library for Kaiwen Web and Mobile.

---

## 📦 Packages

| Package                                     | Status   | Description                                                                                    |
| :------------------------------------------ | :------- | :--------------------------------------------------------------------------------------------- |
| [`@kaiwen/tokens`](./packages/tokens)       | `v0.1.0` | Design tokens, semantic dark & light color themes, typography, motion, z-index, CSS variables. |
| [`@kaiwen/utilities`](./packages/utilities) | `v0.1.0` | Zero-dependency class merging (`cn`), safe ID generators, SSR detectors, a11y link security.   |
| [`@kaiwen/brand`](./packages/brand)         | `v0.1.0` | Kaiwen Brand Mark, Wordmark, and Logo components.                                              |
| [`@kaiwen/icons`](./packages/icons)         | `v0.1.0` | Tree-shakable SVG icon components (Search, Check, Close, Eye, Chevron, etc.).                  |
| [`@kaiwen/ui-web`](./packages/ui-web)       | `v0.1.0` | Production React Web components (Button, Input, Card, Skeleton, Stack, Box, Text, etc.).       |
| [`@kaiwen/ui-native`](./packages/ui-native) | `v0.1.0` | React Native & Expo components with native mobile form and gesture behaviors.                  |

---

## 🚀 Quickstart (Web)

```bash
pnpm add @kaiwen/ui-web @kaiwen/tokens @kaiwen/icons
```

Import styles in your application entrypoint:

```tsx
import "@kaiwen/ui-web/styles.css";
```

Wrap your root in `ThemeProvider` and start building:

```tsx
import {
  ThemeProvider,
  Container,
  Card,
  Stack,
  Text,
  Input,
  Button,
} from "@kaiwen/ui-web";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Container size="sm" py="xl">
        <Card padding="lg">
          <Card.Header
            title="Kaiwen Account"
            subtitle="Sign in with your email to continue."
          />
          <Stack gap="md">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@kaiwen.com"
            />
            <Button variant="primary" fullWidth>
              Continue
            </Button>
          </Stack>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
```

---

## 🛠️ Development & Monorepo Commands

```bash
# Install dependencies
pnpm install

# Run builds across all packages
pnpm build

# Run unit & component tests
pnpm test

# Typecheck with TypeScript strict mode
pnpm typecheck

# Code formatting & linting
pnpm format
```

---

## 🤖 AI Agent & LLM Integration

This repository is optimized for autonomous coding agents:

- [`AGENTS.md`](./AGENTS.md): Agent rules, prop conventions, and folder structure.
- [`llms.txt`](./llms.txt): Machine-readable system documentation.
- [`COMPONENTS.md`](./COMPONENTS.md): Detailed component prop tables.
