# Kaiwen Design System — Component Catalog

| Component         | Package                               | Key Props                                              | Description                                                                |
| :---------------- | :------------------------------------ | :----------------------------------------------------- | :------------------------------------------------------------------------- |
| **Box**           | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `p`, `m`, `as`, `style`                                | Foundational polymorphic container mapped to spacing tokens.               |
| **Stack**         | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `direction`, `gap`, `align`, `justify`                 | Flexbox stack primitive with consistent token gaps.                        |
| **HStack**        | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `gap`, `align`, `justify`                              | Horizontal row stack with vertical centering by default.                   |
| **VStack**        | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `gap`, `align`, `justify`                              | Vertical column stack.                                                     |
| **Flex**          | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `direction`, `gap`, `wrap`                             | Direct flex layout primitive.                                              |
| **Container**     | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `size`, `center`                                       | Page width constraint container (sm, md, lg, xl, 2xl, full).               |
| **Divider**       | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `orientation`, `decorative`                            | Hairline separator using subtle border token.                              |
| **Text**          | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `variant`, `color`, `weight`, `truncate`               | Typography component (display, h1, h2, h3, title, body, caption, mono).    |
| **Button**        | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `variant`, `size`, `loading`, `disabled`, `fullWidth`  | Interactive button with zero-shift loading spinner and tactile feedback.   |
| **IconButton**    | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `size`, `aria-label`, `icon`                           | Square aspect ratio button with required accessible label.                 |
| **Input**         | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `label`, `error`, `helperText`, `startIcon`, `endIcon` | Accessible form input with error/success states and floating labels.       |
| **PasswordInput** | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `showToggle`, `autoComplete`                           | Secure password field with reveal toggle and credentials manager hooks.    |
| **NumberInput**   | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `min`, `max`, `step`                                   | Numeric input with correct virtual keyboard inputmode.                     |
| **OTPInput**      | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `length`, `value`, `onChange`                          | Multi-digit verification code input with auto-advance and paste support.   |
| **Card**          | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `variant`, `padding`, `interactive`                    | Surface container with Card.Header, Card.Body, Card.Footer, Card.Skeleton. |
| **Skeleton**      | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `width`, `height`, `radius`, `circle`                  | Centralized shimmer animation engine (Skeleton.Text, Circle, Rect, Card).  |
| **Badge**         | `@kaiwen/ui-web`                      | `variant`, `size`, `dot`                               | Pill badge with semantic status indicator dots.                            |
| **Spinner**       | `@kaiwen/ui-web`                      | `size`, `color`, `label`                               | Smooth SVG activity indicator.                                             |
| **ThemeProvider** | `@kaiwen/ui-web`, `@kaiwen/ui-native` | `defaultTheme`, `enableSystem`                         | Central theme provider injecting CSS variables and data-theme.             |
