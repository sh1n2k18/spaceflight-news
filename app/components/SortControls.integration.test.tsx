import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useState } from "react";
import { SortControls } from "./SortControls";
import { sortArticles } from "~/utils";
import type { SpaceflightArticle, SortBy } from "~/types";

// Integration test component that simulates the main route behavior
function TestSortingApp() {
  const [sortBy, setSortBy] = useState<SortBy>("date");

  const mockArticles: SpaceflightArticle[] = [
    {
      id: 1,
      title: "Zebra Mission Launch",
      summary: "A mission about zebras",
      image_url: "https://example.com/zebra.jpg",
      news_site: "Space News",
      published_at: "2024-01-15T10:00:00Z",
      url: "https://example.com/zebra",
    },
    {
      id: 2,
      title: "Alpha Space Station",
      summary: "A space station story",
      image_url: "https://example.com/alpha.jpg",
      news_site: "Space Today",
      published_at: "2024-01-20T15:30:00Z",
      url: "https://example.com/alpha",
    },
    {
      id: 3,
      title: "Beta Rocket Test",
      summary: "Testing a new rocket",
      image_url: "https://example.com/beta.jpg",
      news_site: "Rocket News",
      published_at: "2024-01-10T08:45:00Z",
      url: "https://example.com/beta",
    },
  ];

  const sortedArticles = sortArticles(mockArticles, sortBy);

  return (
    <div>
      <SortControls sortBy={sortBy} onSortChange={setSortBy} />
      <div data-testid="articles-list">
        {sortedArticles.map((article, index) => (
          <div key={article.id} data-testid={`article-${index}`}>
            {article.title}
          </div>
        ))}
      </div>
    </div>
  );
}

describe("SortControls Integration", () => {
  it("sorts articles chronologically by default (newest first)", () => {
    render(<TestSortingApp />);

    const articles = screen.getAllByTestId(/^article-/);
    expect(articles[0]).toHaveTextContent("Alpha Space Station"); // 2024-01-20 (newest)
    expect(articles[1]).toHaveTextContent("Zebra Mission Launch"); // 2024-01-15 (middle)
    expect(articles[2]).toHaveTextContent("Beta Rocket Test"); // 2024-01-10 (oldest)
  });

  it("sorts articles alphabetically when title sort is selected", () => {
    render(<TestSortingApp />);

    const titleButton = screen.getByRole("button", {
      name: /sort articles alphabetically by title/i,
    });
    fireEvent.click(titleButton);

    const articles = screen.getAllByTestId(/^article-/);
    expect(articles[0]).toHaveTextContent("Alpha Space Station");
    expect(articles[1]).toHaveTextContent("Beta Rocket Test");
    expect(articles[2]).toHaveTextContent("Zebra Mission Launch");
  });

  it("switches back to chronological sorting when date button is clicked", () => {
    render(<TestSortingApp />);

    // First switch to title sorting
    const titleButton = screen.getByRole("button", {
      name: /sort articles alphabetically by title/i,
    });
    fireEvent.click(titleButton);

    // Then switch back to date sorting
    const dateButton = screen.getByRole("button", {
      name: /sort articles by publication date/i,
    });
    fireEvent.click(dateButton);

    const articles = screen.getAllByTestId(/^article-/);
    expect(articles[0]).toHaveTextContent("Alpha Space Station"); // 2024-01-20 (newest)
    expect(articles[1]).toHaveTextContent("Zebra Mission Launch"); // 2024-01-15 (middle)
    expect(articles[2]).toHaveTextContent("Beta Rocket Test"); // 2024-01-10 (oldest)
  });

  it("maintains sort state correctly across multiple interactions", () => {
    render(<TestSortingApp />);

    const titleButton = screen.getByRole("button", {
      name: /sort articles alphabetically by title/i,
    });
    const dateButton = screen.getByRole("button", {
      name: /sort articles by publication date/i,
    });

    // Initial state should be date sorting
    expect(dateButton).toHaveAttribute("aria-pressed", "true");
    expect(titleButton).toHaveAttribute("aria-pressed", "false");

    // Switch to title sorting
    fireEvent.click(titleButton);
    expect(dateButton).toHaveAttribute("aria-pressed", "false");
    expect(titleButton).toHaveAttribute("aria-pressed", "true");

    // Switch back to date sorting
    fireEvent.click(dateButton);
    expect(dateButton).toHaveAttribute("aria-pressed", "true");
    expect(titleButton).toHaveAttribute("aria-pressed", "false");
  });
});
