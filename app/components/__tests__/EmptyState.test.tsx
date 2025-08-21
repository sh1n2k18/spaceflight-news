import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  const defaultProps = {
    title: "No results found",
    description: "Try adjusting your search criteria.",
  };

  it("renders title and description", () => {
    render(<EmptyState {...defaultProps} />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your search criteria."),
    ).toBeInTheDocument();
  });

  it("renders without action button by default", () => {
    render(<EmptyState {...defaultProps} />);

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("renders action button when provided", () => {
    const action = {
      label: "Clear filters",
      onClick: vi.fn(),
    };

    render(<EmptyState {...defaultProps} action={action} />);

    const button = screen.getByRole("button", { name: "Clear filters" });
    expect(button).toBeInTheDocument();
  });

  it("calls action onClick when button is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const action = {
      label: "Clear filters",
      onClick,
    };

    render(<EmptyState {...defaultProps} action={action} />);

    const button = screen.getByRole("button", { name: "Clear filters" });
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(
      <EmptyState {...defaultProps} className="custom-class" />,
    );

    const emptyStateContainer = container.firstChild as HTMLElement;
    expect(emptyStateContainer.className).toContain("custom-class");
  });

  it("has proper semantic structure", () => {
    render(<EmptyState {...defaultProps} />);

    const title = screen.getByRole("heading", { level: 3 });
    expect(title).toHaveTextContent("No results found");

    const description = screen.getByText("Try adjusting your search criteria.");
    expect(description.tagName).toBe("P");
  });

  it("renders search icon", () => {
    const { container } = render(<EmptyState {...defaultProps} />);

    const icon = container.querySelector('svg[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("handles long descriptions properly", () => {
    const longDescription =
      "This is a very long description that should wrap properly and maintain good readability across different screen sizes and devices.";

    render(
      <EmptyState
        title="Long Description Test"
        description={longDescription}
      />,
    );

    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  it("handles keyboard navigation for action button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const action = {
      label: "Clear filters",
      onClick,
    };

    render(<EmptyState {...defaultProps} action={action} />);

    const button = screen.getByRole("button");

    // Tab to the button
    await user.tab();
    expect(button).toHaveFocus();

    // Press Enter
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);

    // Press Space
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
