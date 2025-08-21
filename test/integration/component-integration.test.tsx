import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SearchBar } from "~/components/SearchBar";
import { SortControls } from "~/components/SortControls";
import { ArticlesList } from "~/components/ArticlesList";
import type { SpaceflightArticle } from "~/types";

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, "open", {
  writable: true,
  value: mockWindowOpen,
});

const mockArticles: SpaceflightArticle[] = [
  {
    id: 1,
    title: "SpaceX Launches Starship Rocket",
    summary:
      "SpaceX successfully launches its Starship rocket on a test flight to Mars.",
    image_url: "https://example.com/image1.jpg",
    news_site: "SpaceNews",
    published_at: "2024-01-15T10:00:00Z",
    url: "https://example.com/article1",
  },
  {
    id: 2,
    title: "NASA Mars Mission Update",
    summary:
      "NASA provides comprehensive updates on the ongoing Mars exploration mission.",
    image_url: "https://example.com/image2.jpg",
    news_site: "NASA News",
    published_at: "2024-01-14T15:30:00Z",
    url: "https://example.com/article2",
  },
];

describe("Component Integration Tests", () => {
  describe("SearchBar Integration", () => {
    it("should call onChange when user types", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          placeholder="Search articles..."
        />,
      );

      const searchInput = screen.getByLabelText("Search articles by title");
      await user.type(searchInput, "SpaceX");

      expect(mockOnChange).toHaveBeenCalledWith("SpaceX");
    });

    it("should clear search when clear button is clicked", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(
        <SearchBar
          value="test"
          onChange={mockOnChange}
          placeholder="Search articles..."
        />,
      );

      const clearButton = screen.getByRole("button", { name: /clear search/i });
      await user.click(clearButton);

      expect(mockOnChange).toHaveBeenCalledWith("");
    });
  });

  describe("SortControls Integration", () => {
    it("should call onSortChange when sort button is clicked", async () => {
      const user = userEvent.setup();
      const mockOnSortChange = vi.fn();

      render(<SortControls sortBy="date" onSortChange={mockOnSortChange} />);

      const sortByTitle = screen.getByRole("button", {
        name: "Sort articles alphabetically by title",
      });
      await user.click(sortByTitle);

      expect(mockOnSortChange).toHaveBeenCalledWith("title");
    });

    it("should show correct active state", () => {
      const mockOnSortChange = vi.fn();

      render(<SortControls sortBy="title" onSortChange={mockOnSortChange} />);

      const sortByTitle = screen.getByRole("button", {
        name: "Sort articles alphabetically by title",
      });
      expect(sortByTitle).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("ArticlesList Integration", () => {
    it("should render articles correctly", () => {
      render(<ArticlesList articles={mockArticles} />);

      expect(screen.getAllByRole("article")).toHaveLength(2);
      expect(
        screen.getByText("SpaceX Launches Starship Rocket"),
      ).toBeInTheDocument();
      expect(screen.getByText("NASA Mars Mission Update")).toBeInTheDocument();
    });

    it("should show search results info when search term is provided", () => {
      render(<ArticlesList articles={mockArticles} searchTerm="SpaceX" />);

      expect(
        screen.getByText(/Found 2 articles matching "SpaceX"/i),
      ).toBeInTheDocument();
    });

    it("should handle article clicks", async () => {
      const user = userEvent.setup();

      render(<ArticlesList articles={mockArticles} />);

      const firstArticleButton =
        screen.getAllByLabelText(/Read full article:/)[0];
      await user.click(firstArticleButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        "https://example.com/article1",
        "_blank",
        "noopener,noreferrer",
      );
    });
  });

  describe("Component Workflow Integration", () => {
    it("should handle search functionality", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          placeholder="Search articles..."
        />,
      );

      const searchInput = screen.getByLabelText("Search articles by title");
      await user.type(searchInput, "NASA");

      expect(mockOnChange).toHaveBeenCalledWith("NASA");
    });

    it("should handle keyboard navigation", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          placeholder="Search articles..."
        />,
      );

      const searchInput = screen.getByLabelText("Search articles by title");

      // Focus and type
      searchInput.focus();
      await user.type(searchInput, "test");

      expect(mockOnChange).toHaveBeenCalledWith("test");

      // Test Escape key
      await user.keyboard("{Escape}");

      expect(mockOnChange).toHaveBeenCalledWith("");
    });
  });
});
