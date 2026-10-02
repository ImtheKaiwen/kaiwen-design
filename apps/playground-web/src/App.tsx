import * as React from "react";
import { KaiwenLogo } from "@kaiwen/brand";
import {
  SearchIcon,
  MoonIcon,
  SunIcon,
  CheckIcon,
  AlertCircleIcon,
  CopyIcon,
  ArrowRightIcon,
  UserIcon,
} from "@kaiwen/icons";
import {
  useTheme,
  Container,
  Card,
  Stack,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  Input,
  PasswordInput,
  NumberInput,
  OTPInput,
  Badge,
  Skeleton,
  Divider,
} from "@kaiwen/ui-web";

export function App() {
  const { resolvedTheme, setTheme } = useTheme();
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [cardLoading, setCardLoading] = React.useState(false);
  const [otpValue, setOtpValue] = React.useState("");

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Top Navbar */}
      <header
        style={{
          borderBottom: "1px solid var(--kaiwen-color-border-subtle, #18181B)",
          backgroundColor: "var(--kaiwen-color-surface-primary, #111113)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(12px)",
        }}
      >
        <Container size="xl" py="sm">
          <HStack justify="space-between">
            <HStack gap="sm">
              <KaiwenLogo
                size="md"
                color="var(--kaiwen-color-text-primary, #FFFFFF)"
              />
              <Badge variant="outline" size="sm">
                v0.1.0-alpha
              </Badge>
            </HStack>

            <HStack gap="sm">
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="Toggle theme mode"
                onClick={toggleTheme}
                icon={
                  resolvedTheme === "dark" ? (
                    <SunIcon size={16} />
                  ) : (
                    <MoonIcon size={16} />
                  )
                }
              />
              <Button
                size="sm"
                variant="primary"
                endIcon={<ArrowRightIcon size={14} />}
                onClick={() =>
                  window.open(
                    "https://github.com",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                Docs
              </Button>
            </HStack>
          </HStack>
        </Container>
      </header>

      {/* Main Content Area */}
      <Container size="lg" pt="xl">
        <Stack gap="2xl">
          {/* Hero Header */}
          <VStack gap="xs" align="flex-start">
            <Text variant="display">Kaiwen Design System</Text>
            <Text variant="title" color="secondary">
              Production-grade, modular design system and component architecture
              for Web and Mobile.
            </Text>
            <HStack gap="sm" style={{ marginTop: "12px" }}>
              <Badge variant="success" dot>
                Tokens Ready
              </Badge>
              <Badge variant="info" dot>
                Strict TypeScript
              </Badge>
              <Badge variant="default">Zero Layout Shift</Badge>
              <Badge variant="secondary">Reduced Motion Safe</Badge>
            </HStack>
          </VStack>

          <Divider />

          {/* Section: Typography */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <Text variant="h2">Typography Scale</Text>
              <Text variant="bodySmall" color="secondary">
                High-contrast, clean typographic hierarchy powered by semantic
                design tokens.
              </Text>
            </VStack>

            <Card padding="md">
              <Stack gap="md">
                <HStack justify="space-between">
                  <Text variant="mono" color="muted">
                    display
                  </Text>
                  <Text variant="display">Geometric Precision</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text variant="mono" color="muted">
                    h1
                  </Text>
                  <Text variant="h1">Header 1 Specimen</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text variant="mono" color="muted">
                    h2
                  </Text>
                  <Text variant="h2">Header 2 Specimen</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text variant="mono" color="muted">
                    title
                  </Text>
                  <Text variant="title">Component Title Specimen</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text variant="mono" color="muted">
                    body
                  </Text>
                  <Text variant="body">
                    Body text for interface copy, paragraphs, and descriptions.
                  </Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text variant="mono" color="muted">
                    caption
                  </Text>
                  <Text variant="caption" color="secondary">
                    Subtle metadata and secondary descriptors
                  </Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text variant="mono" color="muted">
                    mono
                  </Text>
                  <Text variant="mono">export const theme = darkTheme;</Text>
                </HStack>
              </Stack>
            </Card>
          </VStack>

          <Divider />

          {/* Section: Buttons & Actions */}
          <VStack gap="md" align="stretch">
            <HStack justify="space-between">
              <VStack gap="2xs" align="flex-start">
                <Text variant="h2">Buttons & Actions</Text>
                <Text variant="bodySmall" color="secondary">
                  Micro-interactions with zero layout shift during loading
                  transitions.
                </Text>
              </VStack>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setBtnLoading((prev) => !prev)}
              >
                {btnLoading ? "Reset Loading" : "Toggle Button Loading"}
              </Button>
            </HStack>

            <Card padding="lg">
              <Stack gap="lg">
                <VStack gap="xs" align="flex-start">
                  <Text variant="label" color="muted">
                    VARIANTS
                  </Text>
                  <HStack gap="sm" wrap="wrap">
                    <Button variant="primary" loading={btnLoading}>
                      Primary Action
                    </Button>
                    <Button variant="secondary" loading={btnLoading}>
                      Secondary
                    </Button>
                    <Button variant="outline" loading={btnLoading}>
                      Outline
                    </Button>
                    <Button variant="ghost" loading={btnLoading}>
                      Ghost
                    </Button>
                    <Button variant="danger" loading={btnLoading}>
                      Destructive
                    </Button>
                    <Button variant="primary" disabled>
                      Disabled
                    </Button>
                  </HStack>
                </VStack>

                <Divider />

                <VStack gap="xs" align="flex-start">
                  <Text variant="label" color="muted">
                    SIZES & ICONS
                  </Text>
                  <HStack gap="sm" align="center" wrap="wrap">
                    <Button size="sm" startIcon={<UserIcon size={14} />}>
                      Small Button
                    </Button>
                    <Button size="md" startIcon={<SearchIcon size={16} />}>
                      Medium Button
                    </Button>
                    <Button size="lg" endIcon={<ArrowRightIcon size={18} />}>
                      Large Button
                    </Button>
                    <IconButton
                      size="md"
                      aria-label="Copy code"
                      variant="secondary"
                      icon={<CopyIcon size={16} />}
                    />
                    <IconButton
                      size="md"
                      aria-label="Check item"
                      variant="primary"
                      icon={<CheckIcon size={16} />}
                    />
                  </HStack>
                </VStack>
              </Stack>
            </Card>
          </VStack>

          <Divider />

          {/* Section: Form Inputs & Platform UX */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <Text variant="h2">Form & Input System</Text>
              <Text variant="bodySmall" color="secondary">
                Rigorous accessibility, error states, and specialized input
                behaviors.
              </Text>
            </VStack>

            <Card padding="lg">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "24px",
                }}
              >
                <Input
                  label="Search"
                  placeholder="Query design system..."
                  startIcon={<SearchIcon size={16} />}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="agent@kaiwen.com"
                  helperText="Enterprise workspace email"
                  required
                />

                <Input
                  label="Username"
                  defaultValue="kaiwen_user"
                  error="This handle is already taken."
                  startIcon={<AlertCircleIcon size={16} />}
                />

                <PasswordInput
                  label="Account Password"
                  placeholder="Enter secure password"
                  helperText="Click eye icon to toggle visibility"
                />

                <NumberInput
                  label="Max Concurrency"
                  defaultValue={4}
                  min={1}
                  max={64}
                />

                <VStack gap="2xs" align="flex-start">
                  <Text variant="label">Verification OTP (6-digits)</Text>
                  <OTPInput
                    length={6}
                    value={otpValue}
                    onChange={setOtpValue}
                  />
                  <Text variant="caption" color="muted">
                    Supports automatic focus advance and paste distribution.
                  </Text>
                </VStack>
              </div>
            </Card>
          </VStack>

          <Divider />

          {/* Section: Card & Skeleton System */}
          <VStack gap="md" align="stretch">
            <HStack justify="space-between">
              <VStack gap="2xs" align="flex-start">
                <Text variant="h2">Skeleton & Loading Engine</Text>
                <Text variant="bodySmall" color="secondary">
                  Synchronized shimmer animation engine with zero layout shift
                  on hydration.
                </Text>
              </VStack>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setCardLoading((prev) => !prev)}
              >
                {cardLoading ? "Show Real Content" : "Show Card.Skeleton"}
              </Button>
            </HStack>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px",
              }}
            >
              {cardLoading ? (
                <Card.Skeleton />
              ) : (
                <Card padding="md">
                  <Card.Header
                    title="Real-Time Analytics"
                    subtitle="Token usage and compilation benchmarks"
                    action={
                      <Badge variant="success" dot>
                        Live
                      </Badge>
                    }
                  />
                  <Card.Body>
                    <Text variant="body" color="secondary">
                      Zero-runtime styling overhead with CSS variables. Fully
                      tree-shakable packages with dedicated platform boundaries.
                    </Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button size="sm" variant="ghost">
                      Learn More
                    </Button>
                    <Button size="sm" variant="primary">
                      Deploy
                    </Button>
                  </Card.Footer>
                </Card>
              )}

              {/* Explicit Skeleton Primitive Showcase */}
              <Card padding="md" variant="outlined">
                <Card.Header
                  title="Skeleton Primitives"
                  subtitle="Sub-components for custom layouts"
                />
                <Card.Body>
                  <VStack gap="md">
                    <HStack gap="sm">
                      <Skeleton.Circle size={36} />
                      <div style={{ flex: 1 }}>
                        <Skeleton width="45%" height="14px" />
                      </div>
                    </HStack>
                    <Skeleton.Text lines={3} />
                  </VStack>
                </Card.Body>
              </Card>
            </div>
          </VStack>

          {/* Footer */}
          <Divider />
          <HStack justify="space-between" py="md">
            <Text variant="caption" color="muted">
              Kaiwen Design System © 2026. Production-Grade.
            </Text>
            <HStack gap="md">
              <Text variant="caption" color="muted">
                React Web
              </Text>
              <Text variant="caption" color="muted">
                React Native
              </Text>
              <Text variant="caption" color="muted">
                AI Agent Ready
              </Text>
            </HStack>
          </HStack>
        </Stack>
      </Container>
    </div>
  );
}
