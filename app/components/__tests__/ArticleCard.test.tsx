import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ArticleCard } from "../ArticleCard";
import type { SpaceflightArticle } from "~/types";

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

describe("ArticleCard", () => {
  const mockArticle: SpaceflightArticle = {
    id: 1,
    title: "SpaceX Launches New Mission to Mars",
    summary:
      "SpaceX successfully launched a new mission to Mars with advanced technology and scientific equipment aboard the spacecraft.",
    image_url: "https://example.com/spacex-mars.jpg",
    news_site: "SpaceNews",
    published_at: "2024-01-15T10:30:00Z",
    url: "https://example.com/spacex-mars-mission",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders article card with all required elements", () => {
      render(<ArticleCard article={mockArticle} />);

      expect(screen.getByRole("article")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument(); // Image has role="button"
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
      expect(screen.getByText(mockArticle.summary)).toBeInTheDocument();
      expect(screen.getByText(mockArticle.news_site)).toBeInTheDocument();
    });

    it("renders image with correct attributes", () => {
      render(<ArticleCard article={mockArticle} />);

      const image = screen.getByRole("button");
      expect(image).toHaveAttribute("src", mockArticle.image_url);
      expect(image).toHaveAttribute(
        "alt",
        `${mockArticle.title} - Click to read full article`,
      );
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).toHaveAttribute("role", "button");
      expect(image).toHaveAttribute("tabIndex", "0");
    });

    it("renders metadata with proper semantic elements", () => {
      render(<ArticleCard article={mockArticle} />);

      const newsSource = screen.getByTitle(`Source: ${mockArticle.news_site}`);
      expect(newsSource).toHaveTextContent(mockArticle.news_site);

      const publishedDate = screen.getByRole("time");
      expect(publishedDate).toHaveAttribute(
        "dateTime",
        mockArticle.published_at,
      );
    });
  });

  describe("Interactions", () => {
    it("opens external link when image is clicked", () => {
      render(<ArticleCard article={mockArticle} />);

      const image = screen.getByRole("button");
      fireEvent.click(image);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        mockArticle.url,
        "_blank",
        "noopener,noreferrer",
      );
    });

    it("opens external link when Enter key is pressed on image", () => {
      render(<ArticleCard article={mockArticle} />);

      const image = screen.getByRole("button");
      fireEvent.keyDown(image, { key: "Enter" });

      expect(mockWindowOpen).toHaveBeenCalledWith(
        mockArticle.url,
        "_blank",
        "noopener,noreferrer",
      );
    });

    it("opens external link when Space key is pressed on image", () => {
      render(<ArticleCard article={mockArticle} />);

      const image = screen.getByRole("button");
      fireEvent.keyDown(image, { key: " " });

      expect(mockWindowOpen).toHaveBeenCalledWith(
        mockArticle.url,
        "_blank",
        "noopener,noreferrer",
      );
    });

    it("does not open link when other keys are pressed", () => {
      render(<ArticleCard article={mockArticle} />);

      const image = screen.getByRole("button");
      fireEvent.keyDown(image, { key: "Tab" });
      fireEvent.keyDown(image, { key: "Escape" });

      expect(mockWindowOpen).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels and roles", () => {
      render(<ArticleCard article={mockArticle} />);

      const image = screen.getByRole("button");
      expect(image).toHaveAttribute(
        "aria-label",
        `Read full article: ${mockArticle.title}`,
      );
      expect(image).toHaveAttribute("role", "button");
      expect(image).toHaveAttribute("tabIndex", "0");
    });

    it("has semantic HTML structure", () => {
      render(<ArticleCard article={mockArticle} />);

      expect(screen.getByRole("article")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("time")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles very long titles", () => {
      const articleWithLongTitle = {
        ...mockArticle,
        title:
          "This is a very long title that should be truncated properly when displayed in the article card component to maintain good user experience and layout consistency across different screen sizes and devices",
      };

      render(<ArticleCard article={articleWithLongTitle} />);

      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveAttribute("title", articleWithLongTitle.title);
      expect(title).toHaveTextContent(articleWithLongTitle.title);
    });

    it("handles invalid date strings", () => {
      const articleWithBadDate = {
        ...mockArticle,
        published_at: "invalid-date",
      };

      render(<ArticleCard article={articleWithBadDate} />);

      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveAttribute("dateTime", "invalid-date");
    });
  });

  describe("Responsive Design", () => {
    it("renders with responsive structure", () => {
      render(<ArticleCard article={mockArticle} />);

      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();

      const image = screen.getByRole("button");
      const title = screen.getByRole("heading", { level: 3 });
      const summary = screen.getByText(mockArticle.summary);

      expect(image.parentElement).toBeInTheDocument();
      expect(title.parentElement).toBeInTheDocument();
      expect(summary.parentElement).toBeInTheDocument();
    });
  });
});
