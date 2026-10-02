import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Button,
  Input,
  PasswordInput,
  Card,
  Skeleton,
  Badge,
  Text,
  Stack,
  HStack,
  PromptInput,
  Dialog,
  Tabs,
  Alert,
} from "../index.js";

describe("@kaiwen/ui-web Components", () => {
  describe("Button", () => {
    it("renders label and handles click", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const btn = screen.getByRole("button", { name: "Click Me" });
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled or loading", () => {
      const handleClick = vi.fn();
      const { rerender } = render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Disabled" }));
      expect(handleClick).not.toHaveBeenCalled();

      rerender(
        <Button loading onClick={handleClick}>
          Loading
        </Button>,
      );
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Input", () => {
    it("renders with label and helper text", () => {
      render(
        <Input
          label="Email Address"
          helperText="We will never share your email"
          placeholder="user@example.com"
        />,
      );
      expect(screen.getByLabelText("Email Address")).toBeDefined();
      expect(screen.getByText("We will never share your email")).toBeDefined();
    });

    it("displays error and sets aria-invalid", () => {
      render(<Input label="Email" error="Invalid email format" />);
      const input = screen.getByLabelText("Email");
      expect(input.getAttribute("aria-invalid")).toBe("true");
      expect(screen.getByText("Invalid email format")).toBeDefined();
    });
  });

  describe("PasswordInput", () => {
    it("toggles password visibility", () => {
      render(<PasswordInput label="Password" defaultValue="secret123" />);
      const input = screen.getByLabelText("Password") as HTMLInputElement;
      expect(input.type).toBe("password");

      const toggle = screen.getByLabelText("Show password");
      fireEvent.click(toggle);
      expect(input.type).toBe("text");

      const hideToggle = screen.getByLabelText("Hide password");
      fireEvent.click(hideToggle);
      expect(input.type).toBe("password");
    });
  });

  describe("Card", () => {
    it("renders card with header, body and footer", () => {
      render(
        <Card>
          <Card.Header title="Card Title" subtitle="Card Subtitle" />
          <Card.Body>Main Content</Card.Body>
          <Card.Footer>Footer Info</Card.Footer>
        </Card>,
      );
      expect(screen.getByText("Card Title")).toBeDefined();
      expect(screen.getByText("Card Subtitle")).toBeDefined();
      expect(screen.getByText("Main Content")).toBeDefined();
      expect(screen.getByText("Footer Info")).toBeDefined();
    });
  });

  describe("Skeleton", () => {
    it("renders Skeleton primitives and text lines", () => {
      const { container } = render(
        <div>
          <Skeleton width="100px" height="20px" />
          <Skeleton.Circle size={32} />
          <Skeleton.Text lines={2} />
        </div>,
      );
      const skeletons = container.querySelectorAll(".kaiwen-skeleton");
      expect(skeletons.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Badge", () => {
    it("renders with variant and children", () => {
      render(
        <Badge variant="success" dot>
          Active
        </Badge>,
      );
      expect(screen.getByText("Active")).toBeDefined();
    });
  });

  describe("PromptInput", () => {
    it("renders prompt composer and invokes onSubmit on click", () => {
      const handleSubmit = vi.fn();
      render(
        <PromptInput defaultValue="Hello Kaiwen" onSubmit={handleSubmit} />,
      );
      const btn = screen.getByLabelText("Send prompt");
      fireEvent.click(btn);
      expect(handleSubmit).toHaveBeenCalledWith("Hello Kaiwen");
    });
  });

  describe("Dialog", () => {
    it("renders dialog when open=true", () => {
      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <Dialog.Content>
            <Dialog.Header title="Test Dialog" />
            <Dialog.Body>Dialog body message</Dialog.Body>
          </Dialog.Content>
        </Dialog>,
      );
      expect(screen.getByText("Test Dialog")).toBeDefined();
      expect(screen.getByText("Dialog body message")).toBeDefined();
    });
  });

  describe("Tabs", () => {
    it("switches tabs on trigger click", () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );
      expect(screen.getByText("Content 1")).toBeDefined();
      expect(screen.queryByText("Content 2")).toBeNull();

      fireEvent.click(screen.getByText("Tab 2"));
      expect(screen.getByText("Content 2")).toBeDefined();
      expect(screen.queryByText("Content 1")).toBeNull();
    });
  });

  describe("Alert", () => {
    it("renders alert message and title", () => {
      render(
        <Alert variant="success" title="Success!">
          Operation complete
        </Alert>,
      );
      expect(screen.getByText("Success!")).toBeDefined();
      expect(screen.getByText("Operation complete")).toBeDefined();
    });
  });

  describe("Typography & Primitives", () => {
    it("Text renders with correct variant", () => {
      render(<Text variant="h1">Heading 1</Text>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toBe("Heading 1");
    });

    it("Stack and HStack render children correctly", () => {
      render(
        <Stack gap="md">
          <HStack gap="sm">
            <span>Item 1</span>
            <span>Item 2</span>
          </HStack>
        </Stack>,
      );
      expect(screen.getByText("Item 1")).toBeDefined();
      expect(screen.getByText("Item 2")).toBeDefined();
    });
  });
});
