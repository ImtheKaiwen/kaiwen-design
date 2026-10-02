import * as React from "react";
import { KaiwenLogo, KaiwenMark } from "@kaiwen/brand";
import {
  MoonIcon,
  SunIcon,
  ArrowRightIcon,
  UserIcon,
  SparklesIcon,
  PaperclipIcon,
} from "@kaiwen/icons";
import {
  useTheme,
  useToast,
  Container,
  Card,
  Stack,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  Input,
  PromptInput,
  Badge,
  Skeleton,
  Divider,
  Dialog,
  Tabs,
  Tooltip,
  Alert,
  TextArea,
  Checkbox,
  Switch,
  Radio,
  RadioGroup,
  Select,
  SearchInput,
  Drawer,
  Progress,
  CircularProgress,
  EmptyState,
} from "@kaiwen/ui-web";

export function App() {
  const { resolvedTheme, setTheme } = useTheme();
  const toast = useToast();

  const [cardLoading, setCardLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [promptMessage, setPromptMessage] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState("gpt-4o");
  const [streamChecked, setStreamChecked] = React.useState(true);
  const [webSearchEnabled, setWebSearchEnabled] = React.useState(true);
  const [reasoningEffort, setReasoningEffort] = React.useState("medium");
  const [progressVal, setProgressVal] = React.useState(68);

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
    toast.success(
      "Prompt dispatched",
      "Your message was streamed to the agent.",
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--kw-color-bg-canvas, #0D0D0D)",
        color: "var(--kw-color-text-primary, #ECECEC)",
        transition:
          "background-color var(--kw-motion-duration-fast) var(--kw-motion-ease-out)",
        paddingBottom: "80px",
      }}
    >
      {/* Top Navigation Bar */}
      <header
        style={{
          borderBottom: "1px solid var(--kw-color-border-subtle)",
          backgroundColor: "var(--kw-color-bg-canvas)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(12px)",
        }}
      >
        <Container size="lg">
          <HStack justify="space-between" py="sm">
            <HStack gap="sm">
              <KaiwenMark
                size={26}
                color={resolvedTheme === "dark" ? "#FFFFFF" : "#000000"}
              />
              <KaiwenLogo
                size="sm"
                color={resolvedTheme === "dark" ? "#FFFFFF" : "#000000"}
              />
              <Badge variant="default" size="sm">
                v0.1.0
              </Badge>
              <Badge variant="success" size="sm" dot>
                OpenAI Edition
              </Badge>
            </HStack>

            <HStack gap="xs">
              <Tooltip content="Toggle dark / light mode" position="bottom">
                <IconButton
                  aria-label="Toggle Theme"
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                >
                  {resolvedTheme === "dark" ? (
                    <SunIcon size={18} />
                  ) : (
                    <MoonIcon size={18} />
                  )}
                </IconButton>
              </Tooltip>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setDrawerOpen(true)}
              >
                Sidebar Drawer
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setDialogOpen(true)}
              >
                Preferences
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
                backgroundColor: "var(--kw-color-bg-subtle)",
                border: "1px solid var(--kw-color-border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              }}
            >
              <KaiwenMark
                size={38}
                color={resolvedTheme === "dark" ? "#FFFFFF" : "#000000"}
              />
            </div>

            <VStack gap="2xs" align="center">
              <Text variant="display">Kaiwen Design System</Text>
              <Text
                variant="bodyLarge"
                color="secondary"
                style={{ maxWidth: "640px" }}
              >
                The production-grade React & React Native component library
                engineered with OpenAI-inspired aesthetics, geometric tokens,
                and zero layout shift.
              </Text>
            </VStack>

            <HStack gap="sm">
              <Button
                variant="primary"
                size="lg"
                endIcon={<SparklesIcon size={16} />}
                onClick={() =>
                  toast.success(
                    "Kaiwen Agent Ready",
                    "Tokens and components loaded cleanly.",
                  )
                }
              >
                Explore Components
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  toast.info(
                    "Documentation Note",
                    "Read docs/kaiwen-design-system-plan.md for the full specification.",
                  )
                }
              >
                Read Specs
              </Button>
            </HStack>
          </VStack>

          {/* Section: OpenAI Prompt Composer & Feed */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <HStack gap="xs">
                <Text variant="h2">Prompt Composer & Interaction</Text>
                <Badge variant="info" size="sm">
                  OpenAI Pattern
                </Badge>
              </HStack>
              <Text variant="bodySmall" color="secondary">
                Auto-expanding multi-line text input with circular submit pill,
                action anchors, and quiet hairline border.
              </Text>
            </VStack>

            <Card padding="lg">
              <VStack gap="lg" align="stretch">
                {/* Conversation Stream */}
                <VStack gap="sm" align="stretch">
                  {submittedMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "12px",
                        backgroundColor:
                          idx === 0
                            ? "var(--kw-color-bg-subtle)"
                            : "var(--kw-color-bg-canvas)",
                        border: "1px solid var(--kw-color-border-subtle)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "var(--kw-radius-full)",
                          backgroundColor:
                            idx === 0
                              ? "var(--kw-color-interactive-primary)"
                              : "var(--kw-color-bg-subtle)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {idx === 0 ? (
                          <SparklesIcon size={16} color="#FFFFFF" />
                        ) : (
                          <UserIcon size={16} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text
                          variant="caption"
                          color="muted"
                          style={{ marginBottom: "2px" }}
                        >
                          {idx === 0 ? "Kaiwen Assistant" : "You"}
                        </Text>
                        <Text variant="body" color="primary">
                          {msg}
                        </Text>
                      </div>
                    </div>
                  ))}
                </VStack>

                {/* Prompt Composer */}
                <PromptInput
                  value={promptMessage}
                  onChange={setPromptMessage}
                  onSubmit={handlePromptSubmit}
                  placeholder="Ask Kaiwen anything or explore component variants..."
                  startAction={
                    <Tooltip content="Attach context file">
                      <IconButton
                        aria-label="Attach File"
                        variant="ghost"
                        size="sm"
                      >
                        <PaperclipIcon size={18} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              </VStack>
            </Card>
          </VStack>

          <Divider />

          {/* Section: Toast Notification Trigger Bench */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <Text variant="h2">Toast Notification System</Text>
              <Text variant="bodySmall" color="secondary">
                Auto-dismissing, stacked notification banners with accessible
                ARIA live regions.
              </Text>
            </VStack>

            <Card padding="md">
              <HStack gap="sm" wrap="wrap">
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.success(
                      "Changes Saved",
                      "Model parameters updated successfully.",
                    )
                  }
                >
                  Trigger Success Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.error(
                      "Generation Failed",
                      "Rate limit reached. Please retry in 30s.",
                    )
                  }
                >
                  Trigger Error Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.warning(
                      "Token Threshold",
                      "Context window at 85% capacity.",
                    )
                  }
                >
                  Trigger Warning Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.info(
                      "System Notice",
                      "Streaming engine initialized via SSE.",
                    )
                  }
                >
                  Trigger Info Toast
                </Button>
              </HStack>
            </Card>
          </VStack>

          <Divider />

          {/* Section: Form Controls & Advanced Inputs */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <Text variant="h2">Form Controls & Advanced Inputs</Text>
              <Text variant="bodySmall" color="secondary">
                Accessible, precision-styled form elements conforming strictly
                to design tokens.
              </Text>
            </VStack>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px",
              }}
            >
              {/* Column 1: Select, Search, TextArea */}
              <Card padding="md">
                <Stack gap="md">
                  <Text variant="title">Inputs & Text</Text>

                  <SearchInput
                    label="Search Components"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onClear={() => setSearchValue("")}
                    placeholder="Search tokens, icons, primitives..."
                  />

                  <Select
                    label="Model Selection"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    options={[
                      { value: "gpt-4o", label: "OpenAI GPT-4o (Omni)" },
                      { value: "o1", label: "OpenAI o1 Reasoning" },
                      {
                        value: "claude-3-5-sonnet",
                        label: "Claude 3.5 Sonnet",
                      },
                      { value: "gemini-1-5-pro", label: "Gemini 1.5 Pro" },
                    ]}
                  />

                  <TextArea
                    label="System Instructions"
                    placeholder="You are an expert AI software architect..."
                    rows={3}
                    autoResize
                    showCount
                    maxLength={300}
                    defaultValue="Always adhere to design tokens and maintain zero layout shift."
                  />
                </Stack>
              </Card>

              {/* Column 2: Toggles, Checkboxes & Radio */}
              <Card padding="md">
                <Stack gap="md">
                  <Text variant="title">Toggles & Selections</Text>

                  <VStack gap="sm" align="flex-start">
                    <Text variant="label" color="muted">
                      SWITCHES
                    </Text>
                    <Switch
                      checked={webSearchEnabled}
                      onChange={setWebSearchEnabled}
                      label="Live Web Search"
                      helperText="Allow the agent to query real-time external data"
                    />
                    <Switch
                      defaultChecked
                      label="Code Interpreter"
                      helperText="Execute Python in a secure sandboxed environment"
                    />
                  </VStack>

                  <Divider />

                  <VStack gap="sm" align="flex-start">
                    <Text variant="label" color="muted">
                      CHECKBOXES
                    </Text>
                    <Checkbox
                      checked={streamChecked}
                      onChange={(e) => setStreamChecked(e.target.checked)}
                      label="Stream Tokens in Real Time"
                      helperText="Receive chunks as they are generated"
                    />
                    <Checkbox
                      indeterminate
                      label="Log Citations & Sources"
                      helperText="Partially enabled across workspace workspaces"
                    />
                  </VStack>

                  <Divider />

                  <VStack gap="sm" align="flex-start">
                    <Text variant="label" color="muted">
                      REASONING EFFORT
                    </Text>
                    <RadioGroup
                      value={reasoningEffort}
                      onChange={setReasoningEffort}
                      orientation="horizontal"
                    >
                      <Radio value="low" label="Low" />
                      <Radio value="medium" label="Medium" />
                      <Radio value="high" label="High" />
                    </RadioGroup>
                  </VStack>
                </Stack>
              </Card>
            </div>
          </VStack>

          <Divider />

          {/* Section: Progress & Status Indicators */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <Text variant="h2">Progress & Status Indicators</Text>
              <Text variant="bodySmall" color="secondary">
                Linear and circular progress meters with determinate &
                indeterminate states.
              </Text>
            </VStack>

            <Card padding="lg">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "32px",
                  alignItems: "center",
                }}
              >
                <VStack gap="md" align="stretch">
                  <Progress
                    value={progressVal}
                    label="Context Window Utilization"
                    showValue
                  />
                  <Progress
                    indeterminate
                    label="Background Indexing Process"
                    color="var(--kw-color-interactive-primary)"
                  />
                  <HStack gap="xs">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setProgressVal((p) => Math.max(0, p - 15))}
                    >
                      -15%
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setProgressVal((p) => Math.min(100, p + 15))
                      }
                    >
                      +15%
                    </Button>
                  </HStack>
                </VStack>

                <HStack gap="xl" justify="center">
                  <VStack gap="xs" align="center">
                    <CircularProgress
                      value={progressVal}
                      showValue
                      size={64}
                      strokeWidth={5}
                    />
                    <Text variant="caption" color="muted">
                      Determinate
                    </Text>
                  </VStack>

                  <VStack gap="xs" align="center">
                    <CircularProgress
                      indeterminate
                      size={64}
                      strokeWidth={5}
                      color="var(--kw-color-interactive-primary)"
                    />
                    <Text variant="caption" color="muted">
                      Indeterminate
                    </Text>
                  </VStack>
                </HStack>
              </div>
            </Card>
          </VStack>

          <Divider />

          {/* Section: Empty States */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <Text variant="h2">Empty States</Text>
              <Text variant="bodySmall" color="secondary">
                Minimalist, graceful fallbacks when data is missing or
                conversations are cleared.
              </Text>
            </VStack>

            <EmptyState
              icon={<SparklesIcon size={24} />}
              title="No recent generations"
              description="Start a new conversation with Kaiwen Agent to draft components, inspect design tokens, or debug style contracts."
              action={
                <Button
                  variant="primary"
                  onClick={() =>
                    toast.success(
                      "New Thread Initialized",
                      "Ready for prompts.",
                    )
                  }
                >
                  New Conversation
                </Button>
              }
              secondaryAction={
                <Button variant="outline" onClick={() => setDrawerOpen(true)}>
                  Open Sidebar
                </Button>
              }
            />
          </VStack>

          <Divider />

          {/* Section: Navigation Tabs & Segmented Controls */}
          <VStack gap="md" align="stretch">
            <VStack gap="2xs" align="flex-start">
              <Text variant="h2">Navigation Tabs & Pills</Text>
              <Text variant="bodySmall" color="secondary">
                Smooth capsule pill switcher for switching models, workspaces,
                or views.
              </Text>
            </VStack>

            <Card padding="md">
              <Tabs defaultValue="overview" variant="pill">
                <Tabs.List>
                  <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                  <Tabs.Trigger value="models">Models</Tabs.Trigger>
                  <Tabs.Trigger value="tokens">Tokens</Tabs.Trigger>
                  <Tabs.Trigger value="audit">Accessibility</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="overview">
                  <VStack gap="xs" align="flex-start" pt="md">
                    <Text variant="title">System Architecture</Text>
                    <Text variant="body" color="secondary">
                      Kaiwen Design System is organized as an enterprise-grade
                      monorepo with Turborepo, pnpm workspaces, and dedicated
                      platform boundaries for Web and React Native.
                    </Text>
                  </VStack>
                </Tabs.Content>

                <Tabs.Content value="models">
                  <VStack gap="xs" align="flex-start" pt="md">
                    <Text variant="title">Supported AI Models</Text>
                    <Text variant="body" color="secondary">
                      Designed to integrate seamlessly with OpenAI GPT-4o, o1,
                      Claude 3.5 Sonnet, and local LLM endpoints.
                    </Text>
                  </VStack>
                </Tabs.Content>

                <Tabs.Content value="tokens">
                  <VStack gap="xs" align="flex-start" pt="md">
                    <Text variant="title">Design Token Contracts</Text>
                    <Text variant="body" color="secondary">
                      100% tokenized color palette, spacing scale, border-radii,
                      and spring motion. No raw hardcoded HEX values anywhere.
                    </Text>
                  </VStack>
                </Tabs.Content>

                <Tabs.Content value="audit">
                  <VStack gap="xs" align="flex-start" pt="md">
                    <Text variant="title">WCAG 2.1 AA Compliance</Text>
                    <Text variant="body" color="secondary">
                      All components pass strict ARIA, keyboard navigation,
                      focus trapping, and high-contrast color tests.
                    </Text>
                  </VStack>
                </Tabs.Content>
              </Tabs>
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
                color="var(--kw-color-text-tertiary, #737373)"
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
            <Button
              variant="primary"
              onClick={() => {
                setDialogOpen(false);
                toast.success("Preferences saved successfully!");
              }}
            >
              Save Preferences
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      {/* Accessible Multi-directional Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="right"
        title="Workspace Sidebar"
        description="Quick navigation and active model parameters"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setDrawerOpen(false);
                toast.info("Sidebar configuration updated");
              }}
            >
              Apply Changes
            </Button>
          </>
        }
      >
        <Stack gap="lg">
          <Alert variant="info" title="Session Active">
            Connected to Kaiwen Cloud runtime environment.
          </Alert>

          <VStack gap="xs" align="flex-start">
            <Text variant="label" color="muted">
              QUICK NAVIGATION
            </Text>
            <Button
              variant="ghost"
              fullWidth
              style={{ justifyContent: "flex-start" }}
            >
              Active Chats
            </Button>
            <Button
              variant="ghost"
              fullWidth
              style={{ justifyContent: "flex-start" }}
            >
              Custom Prompts
            </Button>
            <Button
              variant="ghost"
              fullWidth
              style={{ justifyContent: "flex-start" }}
            >
              Design Token Inspector
            </Button>
            <Button
              variant="ghost"
              fullWidth
              style={{ justifyContent: "flex-start" }}
            >
              API Keys & Security
            </Button>
          </VStack>

          <Divider />

          <VStack gap="sm" align="flex-start">
            <Text variant="label" color="muted">
              WORKSPACE PARAMETERS
            </Text>
            <Switch
              defaultChecked
              label="Diagnostic Logging"
              helperText="Capture network and rendering traces"
            />
            <Switch
              defaultChecked
              label="Hardware Acceleration"
              helperText="Leverage GPU for WebGL / canvas tokens"
            />
          </VStack>
        </Stack>
      </Drawer>
    </div>
  );
}
