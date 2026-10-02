import * as React from "react";
import { KaiwenLogo, KaiwenMark } from "@kaiwen/brand";
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
  PromptInput,
  Badge,
  Skeleton,
  Divider,
  Dialog,
  Tabs,
  Tooltip,
  Alert,
} from "@kaiwen/ui-web";

export function App() {
  const { resolvedTheme, setTheme } = useTheme();
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [cardLoading, setCardLoading] = React.useState(false);
  const [otpValue, setOtpValue] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [promptMessage, setPromptMessage] = React.useState("");
  const [submittedMessages, setSubmittedMessages] = React.useState<string[]>([
    "Welcome to Kaiwen Design System. What would you like to build today?",
  ]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handlePromptSubmit = (msg: string) => {
    if (!msg.trim()) return;
    setSubmittedMessages((prev) => [...prev, msg]);
    setPromptMessage("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--kaiwen-color-bg-primary, #0D0D0D)",
        color: "var(--kaiwen-color-text-primary, #ECECEC)",
        paddingBottom: "100px",
        transition: "background-color 200ms ease, color 200ms ease",
      }}
    >
      {/* OpenAI-Style Clean Minimal Top Header */}
      <header
        style={{
          borderBottom:
            "1px solid var(--kaiwen-color-border-subtle, rgba(255, 255, 255, 0.06))",
          backgroundColor: "var(--kaiwen-color-surface-primary, #171717)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <Container size="xl" py="sm">
          <HStack justify="space-between">
            <HStack gap="sm">
              <KaiwenLogo
                size="md"
                color="var(--kaiwen-color-text-primary, #ECECEC)"
              />
              <Badge variant="outline" size="sm">
                OpenAI Edition
              </Badge>
            </HStack>

            <HStack gap="sm">
              <Tooltip content="Toggle Dark / Light">
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
              </Tooltip>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => setDialogOpen(true)}
              >
                Open Dialog
              </Button>

              <Button
                size="sm"
                variant="primary"
                endIcon={<ArrowRightIcon size={14} />}
                onClick={() =>
                  window.open(
                    "https://github.com/ImtheKaiwen/kaiwen-design",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                GitHub
              </Button>
            </HStack>
          </HStack>
        </Container>
      </header>

      {/* Main Content Area */}
      <Container size="lg" pt="xl">
        <Stack gap="2xl">
          {/* Hero Section with Official Brand Mark */}
          <VStack
            gap="md"
            align="center"
            style={{ textAlign: "center", paddingTop: "24px" }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                backgroundColor:
                  "var(--kaiwen-color-surface-secondary, #212121)",
                border:
                  "1px solid var(--kaiwen-color-border-default, rgba(255, 255, 255, 0.1))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              }}
            >
              <KaiwenMark
                size={36}
                color="var(--kaiwen-color-text-primary, #ECECEC)"
              />
            </div>

            <VStack gap="xs" align="center">
              <Text variant="display" style={{ letterSpacing: "-0.03em" }}>
                Kaiwen Design System
              </Text>
              <Text
                variant="title"
                color="secondary"
                style={{ maxWidth: "560px" }}
              >
                Production-grade, modular design system designed with modern
                OpenAI-level aesthetic, quiet confidence, and strict
                accessibility.
              </Text>
            </VStack>

            <HStack gap="sm">
              <Badge variant="success" dot>
                Official Mark
              </Badge>
              <Badge variant="info" dot>
                Strict TypeScript
              </Badge>
              <Badge variant="default">Zero Layout Shift</Badge>
              <Badge variant="secondary">Reduced Motion Safe</Badge>
            </HStack>
          </VStack>

          {/* Interactive OpenAI-Style Prompt Composer */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <Text variant="h2">Prompt Composer</Text>
              <Text variant="bodySmall" color="secondary">
                OpenAI-style multi-line auto-expanding prompt input with
                keyboard dispatch and bottom actions.
              </Text>
            </VStack>

            <Card padding="md">
              <Stack gap="md">
                {/* Chat Feed */}
                <VStack gap="sm" align="stretch">
                  {submittedMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "14px",
                        backgroundColor:
                          idx === 0
                            ? "var(--kaiwen-color-surface-primary, #171717)"
                            : "var(--kaiwen-color-surface-secondary, #212121)",
                        border:
                          "1px solid var(--kaiwen-color-border-subtle, rgba(255, 255, 255, 0.06))",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      <HStack gap="xs" style={{ marginBottom: "4px" }}>
                        <KaiwenMark
                          size={14}
                          color="var(--kaiwen-color-status-success, #10A37F)"
                        />
                        <Text variant="caption" color="muted">
                          {idx === 0 ? "Kaiwen Assistant" : "User"}
                        </Text>
                      </HStack>
                      <Text variant="body">{msg}</Text>
                    </div>
                  ))}
                </VStack>

                {/* Prompt Input */}
                <PromptInput
                  value={promptMessage}
                  onChange={setPromptMessage}
                  onSubmit={handlePromptSubmit}
                  placeholder="Ask Kaiwen anything... (Enter to submit, Shift+Enter for newline)"
                  startAction={
                    <Tooltip content="Attach File">
                      <IconButton
                        size="sm"
                        variant="ghost"
                        aria-label="Attach"
                        icon={<CopyIcon size={14} />}
                      />
                    </Tooltip>
                  }
                  endActions={
                    <Badge variant="outline" size="sm">
                      GPT-4o
                    </Badge>
                  }
                />
              </Stack>
            </Card>
          </VStack>

          <Divider />

          {/* Section: Status Alerts */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <Text variant="h2">Feedback & Status Alerts</Text>
              <Text variant="bodySmall" color="secondary">
                High-contrast semantic feedback banners with dismiss actions.
              </Text>
            </VStack>

            <Stack gap="sm">
              <Alert
                variant="success"
                title="Synchronized Successfully"
                onClose={() => {}}
              >
                All design tokens and brand assets have been verified and
                compiled to ESM + CJS.
              </Alert>
              <Alert
                variant="info"
                title="New Release Available"
                onClose={() => {}}
              >
                Kaiwen Design System v0.1.0 is published with strict TypeScript
                support.
              </Alert>
            </Stack>
          </VStack>

          <Divider />

          {/* Section: Tabs & Settings */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <Text variant="h2">Navigation & Tabs</Text>
              <Text variant="bodySmall" color="secondary">
                Pill and line variants matching OpenAI application settings.
              </Text>
            </VStack>

            <Card padding="md">
              <Tabs defaultValue="account" variant="pill">
                <Tabs.List>
                  <Tabs.Trigger value="account">Account</Tabs.Trigger>
                  <Tabs.Trigger value="security">Security</Tabs.Trigger>
                  <Tabs.Trigger value="appearance">Appearance</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="account">
                  <VStack gap="sm" align="flex-start">
                    <Text variant="title">Account Settings</Text>
                    <Text variant="body" color="secondary">
                      Manage your profile information and verified email
                      addresses.
                    </Text>
                    <Input
                      label="Display Name"
                      defaultValue="Kaiwen Developer"
                    />
                  </VStack>
                </Tabs.Content>

                <Tabs.Content value="security">
                  <VStack gap="sm" align="flex-start">
                    <Text variant="title">Security & Credentials</Text>
                    <Text variant="body" color="secondary">
                      Manage multi-factor authentication and active sessions.
                    </Text>
                    <PasswordInput
                      label="Current Password"
                      defaultValue="supersecret"
                    />
                  </VStack>
                </Tabs.Content>

                <Tabs.Content value="appearance">
                  <VStack gap="sm" align="flex-start">
                    <Text variant="title">Appearance & Theme</Text>
                    <Text variant="body" color="secondary">
                      Select theme preference: currently set to {resolvedTheme}.
                    </Text>
                    <Button variant="secondary" size="sm" onClick={toggleTheme}>
                      Switch to {resolvedTheme === "dark" ? "Light" : "Dark"}
                    </Button>
                  </VStack>
                </Tabs.Content>
              </Tabs>
            </Card>
          </VStack>

          <Divider />

          {/* Section: Typography */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <Text variant="h2">Typography Scale</Text>
              <Text variant="bodySmall" color="secondary">
                High-contrast, clean typographic hierarchy with precision
                tracking.
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
            <HStack gap="xs">
              <KaiwenMark
                size={18}
                color="var(--kaiwen-color-text-muted, #737373)"
              />
              <Text variant="caption" color="muted">
                Kaiwen Design System © 2026. Production-Grade.
              </Text>
            </HStack>

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

      {/* Accessible Dialog / Modal Component */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Content>
          <Dialog.Header
            title="Kaiwen Preferences"
            subtitle="Configure your OpenAI-inspired workspace"
          />
          <Dialog.Body>
            <Stack gap="md">
              <Text variant="body" color="secondary">
                You can toggle themes, manage prompt defaults, or adjust
                accessibility preferences like reduced motion.
              </Text>
              <Input label="Workspace Name" defaultValue="Production Agent" />
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setDialogOpen(false)}>
              Save Preferences
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
