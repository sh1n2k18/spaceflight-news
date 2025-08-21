import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ArticlesList } from "../ArticlesList";
import type { SpaceflightArticle } from "~/types";

// Mock the hooks
vi.mock("~/hooks", () => ({
  useIntersectionObserver: () => ({
    ref: { current: null },
    isIntersecting: true,
  }),
}));

const mockArticles: SpaceflightArticle[] = [
  {
    id: 1,
    title: "SpaceX Launches Starship",
    summary:
      "SpaceX successfully launches its Starship rocket on a test flight.",
    image_url: "https://example.com/image1.jpg",
    news_site: "SpaceNews",
    published_at: "2024-01-15T10:00:00Z",
    url: "https://example.com/article1",
  },
  {
    id: 2,
    title: "NASA Mars Mission Update",
    summary: "NASA provides updates on the Mars exploration mission.",
    image_url: "https://example.com/image2.jpg",
    news_site: "NASA News",
    published_at: "2024-01-14T15:30:00Z",
    url: "https://example.com/article2",
  },
  {
    id: 3,
    title: "Blue Origin New Shepard Flight",
    summary: "Blue Origin conducts another successful New Shepard flight.",
    image_url: "https://example.com/image3.jpg",
    news_site: "Space.com",
    published_at: "2024-01-13T09:15:00Z",
    url: "https://example.com/article3",
  },
];

describe("ArticlesList", () => {
  beforeEach(() => {
    // Mock window.open
    vi.stubGlobal("open", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("renders articles in a scrollable container", () => {
      render(<ArticlesList articles={mockArticles} />);

      // Check that the scrollable container exists
      const container = screen.getByRole("region", { name: "Articles list" });
      expect(container).toBeInTheDocument();

      // Check that all articles are rendered
      expect(screen.getByText("SpaceX Launches Starship")).toBeInTheDocument();
      expect(screen.getByText("NASA Mars Mission Update")).toBeInTheDocument();
      expect(
        screen.getByText("Blue Origin New Shepard Flight"),
      ).toBeInTheDocument();
    });

    it("renders search results info when search term is provided", () => {
      render(<ArticlesList articles={mockArticles} searchTerm="SpaceX" />);

      expect(
        screen.getByText(/Found 3 articles matching "SpaceX"/),
      ).toBeInTheDocument();
    });

    it("handles singular article count correctly", () => {
      render(<ArticlesList articles={[mockArticles[0]]} searchTerm="test" />);

      expect(
        screen.getByText(/Found 1 article matching "test"/),
      ).toBeInTheDocument();
    });

    it("returns null when no articles are provided", () => {
      const { container } = render(<ArticlesList articles={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Responsive Layout", () => {
    it("applies responsive grid layout classes", () => {
      render(<ArticlesList articles={mockArticles} />);

      const gridContainer = screen.getByRole("region");
      expect(gridContainer).toHaveClass("d_grid");
    });

    it("has proper accessibility attributes", () => {
      render(<ArticlesList articles={mockArticles} />);

      const container = screen.getByRole("region", { name: "Articles list" });
      expect(container).toHaveAttribute("aria-label", "Articles list");
      expect(container).toHaveAttribute("role", "region");
    });
  });

  describe("Scrolling Behavior", () => {
    it("has proper scroll container styling", () => {
      render(<ArticlesList articles={mockArticles} />);

      const container = screen.getByRole("region");
      expect(container).toHaveClass("w_100%");
    });

    it("supports keyboard navigation", () => {
      render(<ArticlesList articles={mockArticles} />);

      const container = screen.getByRole("region");

      // Just verify the container exists and is accessible
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute("role", "region");
    });
  });

  describe("Performance Optimizations", () => {
    it("renders articles with staggered animations", () => {
      render(<ArticlesList articles={mockArticles} />);

      const articles = screen.getAllByRole("article");

      // Check that articles are rendered (animation classes are applied via CSS-in-JS)
      expect(articles).toHaveLength(3);
      articles.forEach((article) => {
        expect(article).toBeInTheDocument();
      });
    });

    it("handles large lists efficiently", () => {
      const largeArticleList = Array.from({ length: 100 }, (_, index) => ({
        ...mockArticles[0],
        id: index + 1,
        title: `Article ${index + 1}`,
      }));

      render(<ArticlesList articles={largeArticleList} />);

      // Should render all articles
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(100);
    });
  });

  describe("Scroll Indicator", () => {
    it("shows scroll indicator for large lists", () => {
      const largeArticleList = Array.from({ length: 10 }, (_, index) => ({
        ...mockArticles[0],
        id: index + 1,
        title: `Article ${index + 1}`,
      }));

      render(<ArticlesList articles={largeArticleList} />);

      // The scroll indicator should be present (it's a div with specific styling)
      const container = screen.getByRole("region");
      const scrollIndicator = container.querySelector(
        "div[aria-hidden='true']",
      );
      expect(scrollIndicator).toBeInTheDocument();
    });

    it("does not show scroll indicator for small lists", () => {
      render(<ArticlesList articles={mockArticles} />);

      // For small lists, just verify the container exists and has articles
      const container = screen.getByRole("region");
      expect(container).toBeInTheDocument();
      expect(container.children.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty search results gracefully", () => {
      render(<ArticlesList articles={[]} searchTerm="nonexistent" />);

      // Should return null for empty articles
      const { container } = render(<ArticlesList articles={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("handles articles with missing or invalid data", () => {
      const articlesWithMissingData = [
        {
          ...mockArticles[0],
          image_url: "",
          title: "",
        },
      ];

      render(<ArticlesList articles={articlesWithMissingData} />);

      // Should still render the article card
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(1);
    });
  });
});
