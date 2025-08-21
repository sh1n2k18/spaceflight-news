import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { SearchBar } from "../SearchBar";

// Mock the debounce function to make tests synchronous
vi.mock("~/utils", () => ({
  debounce: (fn: any) => fn, // Return the function immediately without debouncing
}));

describe("SearchBar", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByRole("textbox", { name: /search articles/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Search articles...");
    expect(input).not.toBeDisabled();
  });

  it("renders with custom placeholder", () => {
    render(<SearchBar {...defaultProps} placeholder="Custom placeholder" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Custom placeholder");
  });

  it("renders in disabled state", () => {
    render(<SearchBar {...defaultProps} disabled />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("displays the provided value", () => {
    render(<SearchBar {...defaultProps} value="test search" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("test search");
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchBar {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "space");

    expect(onChange).toHaveBeenCalledWith("space");
  });

  it("shows clear button when there is text", () => {
    render(<SearchBar {...defaultProps} value="test" />);

    const clearButton = screen.getByRole("button", { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();
  });

  it("does not show clear button when input is empty", () => {
    render(<SearchBar {...defaultProps} value="" />);

    const clearButton = screen.queryByRole("button", { name: /clear search/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it("does not show clear button when disabled", () => {
    render(<SearchBar {...defaultProps} value="test" disabled />);

    const clearButton = screen.queryByRole("button", { name: /clear search/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchBar {...defaultProps} value="test" onChange={onChange} />);

    const clearButton = screen.getByRole("button", { name: /clear search/i });
    await user.click(clearButton);

    expect(onChange).toHaveBeenCalledWith("");
  });

  it("clears input when Escape key is pressed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchBar {...defaultProps} value="test" onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.keyboard("{Escape}");

    expect(onChange).toHaveBeenCalledWith("");
  });

  it("has proper accessibility attributes", () => {
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-label", "Search articles by title");
    expect(input).toHaveAttribute("aria-describedby", "search-help");

    const helpText = screen.getByText(/search articles by title/i);
    expect(helpText).toHaveAttribute("id", "search-help");
  });

  it("updates local value when prop value changes", () => {
    const { rerender } = render(
      <SearchBar {...defaultProps} value="initial" />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("initial");

    rerender(<SearchBar {...defaultProps} value="updated" />);
    expect(input).toHaveValue("updated");
  });

  it("applies custom className", () => {
    const { container } = render(
      <SearchBar {...defaultProps} className="custom-class" />,
    );

    const searchContainer = container.firstChild as HTMLElement;
    expect(searchContainer.className).toContain("custom-class");
  });

  it("handles focus and blur events properly", async () => {
    const user = userEvent.setup();

    render(<SearchBar {...defaultProps} />);

    const input = screen.getByRole("textbox");

    await user.click(input);
    expect(input).toHaveFocus();

    await user.tab();
    expect(input).not.toHaveFocus();
  });

  it("maintains input focus when typing", async () => {
    const user = userEvent.setup();

    render(<SearchBar {...defaultProps} />);

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.type(input, "test");

    expect(input).toHaveFocus();
    expect(input).toHaveValue("test");
  });
});
