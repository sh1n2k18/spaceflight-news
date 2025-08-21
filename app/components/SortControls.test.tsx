import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SortControls } from "./SortControls";

describe("SortControls", () => {
  const mockOnSortChange = vi.fn();

  beforeEach(() => {
    mockOnSortChange.mockClear();
  });

  it("renders sort controls with correct initial state", () => {
    render(<SortControls sortBy="date" onSortChange={mockOnSortChange} />);

    expect(
      screen.getByRole("group", { name: "Sort articles" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /sort articles by publication date/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /sort articles alphabetically by title/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows date button as active when sortBy is 'date'", () => {
    render(<SortControls sortBy="date" onSortChange={mockOnSortChange} />);

    const dateButton = screen.getByRole("button", {
      name: /sort articles by publication date/i,
    });
    const titleButton = screen.getByRole("button", {
      name: /sort articles alphabetically by title/i,
    });

    expect(dateButton).toHaveAttribute("aria-pressed", "true");
    expect(titleButton).toHaveAttribute("aria-pressed", "false");
  });

  it("shows title button as active when sortBy is 'title'", () => {
    render(<SortControls sortBy="title" onSortChange={mockOnSortChange} />);

    const dateButton = screen.getByRole("button", {
      name: /sort articles by publication date/i,
    });
    const titleButton = screen.getByRole("button", {
      name: /sort articles alphabetically by title/i,
    });

    expect(dateButton).toHaveAttribute("aria-pressed", "false");
    expect(titleButton).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onSortChange when date button is clicked", () => {
    render(<SortControls sortBy="title" onSortChange={mockOnSortChange} />);

    const dateButton = screen.getByRole("button", {
      name: /sort articles by publication date/i,
    });
    fireEvent.click(dateButton);

    expect(mockOnSortChange).toHaveBeenCalledWith("date");
    expect(mockOnSortChange).toHaveBeenCalledTimes(1);
  });

  it("calls onSortChange when title button is clicked", () => {
    render(<SortControls sortBy="date" onSortChange={mockOnSortChange} />);

    const titleButton = screen.getByRole("button", {
      name: /sort articles alphabetically by title/i,
    });
    fireEvent.click(titleButton);

    expect(mockOnSortChange).toHaveBeenCalledWith("title");
    expect(mockOnSortChange).toHaveBeenCalledTimes(1);
  });

  it("does not call onSortChange when clicking the already active button", () => {
    render(<SortControls sortBy="date" onSortChange={mockOnSortChange} />);

    const dateButton = screen.getByRole("button", {
      name: /sort articles by publication date/i,
    });
    fireEvent.click(dateButton);

    expect(mockOnSortChange).not.toHaveBeenCalled();
  });

  it("disables buttons when disabled prop is true", () => {
    render(
      <SortControls sortBy="date" onSortChange={mockOnSortChange} disabled />,
    );

    const dateButton = screen.getByRole("button", {
      name: /sort articles by publication date/i,
    });
    const titleButton = screen.getByRole("button", {
      name: /sort articles alphabetically by title/i,
    });

    expect(dateButton).toBeDisabled();
    expect(titleButton).toBeDisabled();
  });

  it("does not call onSortChange when disabled", () => {
    render(
      <SortControls sortBy="title" onSortChange={mockOnSortChange} disabled />,
    );

    const dateButton = screen.getByRole("button", {
      name: /sort articles by publication date/i,
    });
    fireEvent.click(dateButton);

    expect(mockOnSortChange).not.toHaveBeenCalled();
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-sort-controls";
    render(
      <SortControls
        sortBy="date"
        onSortChange={mockOnSortChange}
        className={customClass}
      />,
    );

    const container = screen.getByRole("group", { name: "Sort articles" });
    expect(container).toHaveClass(customClass);
  });

  it("shows responsive text and icons correctly", () => {
    render(<SortControls sortBy="date" onSortChange={mockOnSortChange} />);

    // Check that both text and emoji versions are present (responsive design)
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("📅")).toBeInTheDocument();
    expect(screen.getByText("A-Z")).toBeInTheDocument();
    expect(screen.getByText("🔤")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<SortControls sortBy="date" onSortChange={mockOnSortChange} />);

    const dateButton = screen.getByRole("button", {
      name: /sort articles by publication date/i,
    });
    const titleButton = screen.getByRole("button", {
      name: /sort articles alphabetically by title/i,
    });

    expect(dateButton).toHaveAttribute("type", "button");
    expect(titleButton).toHaveAttribute("type", "button");
    expect(dateButton).toHaveAttribute("aria-pressed");
    expect(titleButton).toHaveAttribute("aria-pressed");
  });
});
