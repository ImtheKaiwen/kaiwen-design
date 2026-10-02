# Kaiwen Design System — AI Agent Instructions & Guidelines

This document specifies mandatory rules and conventions for AI Agents (Codex, Claude, Gemini, etc.) working on or with this repository.

---

## 1. Core Principles

1. **Tokens First**: NEVER hardcode colors (e.g. `#111111`), margins, paddings, border-radii, or transitions inside components. Always use `@kaiwen/tokens`.
2. **Platform Separation**: NEVER mix React DOM elements in `@kaiwen/ui-native`, and NEVER import `react-native` APIs in `@kaiwen/ui-web`.
3. **No Business Logic**: Design system components must remain domain-agnostic. Business workflows, specific API calls, and entity state belongs in applications.
4. **Accessible by Default**: Every interactive component must provide proper ARIA attributes, keyboard support, focus-visible states, and screen-reader labels.
5. **No Layout Shift on Loading**: Skeletons and loading buttons must preserve their content dimensions.

---

## 2. Package Boundaries

- `@kaiwen/tokens`: Primitive and semantic design tokens (colors, spacing, radius, typography, motion, z-index, breakpoints)
- `@kaiwen/utilities`: Shared class-name mergers (`cn`), safe ID generators, SSR detectors, theme helpers
- `@kaiwen/brand`: Official Kaiwen logo, marks, and wordmarks
- `@kaiwen/icons`: Tree-shakable SVG icon components
- `@kaiwen/ui-web`: Web components (DOM, CSS variables, React)
- `@kaiwen/ui-native`: React Native & Expo components

---

## 3. Standard Component Anatomy

When creating a new component for `@kaiwen/ui-web`, follow this structure:

```text
ComponentName/
├── ComponentName.tsx        # Implementation
├── ComponentName.types.ts   # Props and types (if large) or co-located
├── ComponentName.test.tsx   # Vitest + Testing Library tests
└── index.ts                 # Export barrel
```

---

## 4. Standard Prop Conventions

Always prefer standardized prop names:

- `variant` (not `type`, `kind`, or `appearance`)
- `size` (`sm` | `md` | `lg`)
- `loading` (boolean)
- `disabled` (boolean)
- `error` (string | boolean)
- `helperText` (string)
- `label` (string)
- `fullWidth` (boolean)
