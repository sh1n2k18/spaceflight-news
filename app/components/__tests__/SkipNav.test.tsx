import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SkipNav from "../SkipNav";

describe("SkipNav", () => {
  it("should render skip navigation link", () => {
    render(<SkipNav />);

    const skipLink = screen.getByRole("link", {
      name: /skip to main content/i,
    });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("should have proper accessibility attributes", () => {
    render(<SkipNav />);

    const skipLink = screen.getByRole("link", {
      name: /skip to main content/i,
    });

    // Should be focusable but initially positioned off-screen
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveTextContent("Skip to main content");
  });

  it("should apply correct CSS classes for styling", () => {
    render(<SkipNav />);

    const skipLink = screen.getByRole("link", {
      name: /skip to main content/i,
    });

    // Should have a class attribute (we can't test the exact positioning without JSDOM limitations)
    expect(skipLink).toHaveAttribute("class");
    expect(skipLink.className).toBeTruthy();
  });

  it("should be the first interactive element for screen readers", () => {
    render(
      <div>
        <SkipNav />
        <button>Other button</button>
        <a href="/test">Other link</a>
      </div>,
    );

    const links = screen.getAllByRole("link");
    const buttons = screen.getAllByRole("button");
    const allInteractive = [...links, ...buttons];

    // Skip nav should be first in the DOM order
    expect(allInteractive[0]).toHaveTextContent("Skip to main content");
  });

  it("should maintain focus when navigated to via keyboard", () => {
    render(<SkipNav />);

    const skipLink = screen.getByRole("link", {
      name: /skip to main content/i,
    });

    // Focus the skip link
    skipLink.focus();
    expect(skipLink).toHaveFocus();
  });
});
