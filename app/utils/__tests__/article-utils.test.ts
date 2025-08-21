import { describe, it, expect } from "vitest";
import {
  formatPublishedDate,
  formatRelativeTime,
  truncateText,
  filterArticlesBySearch,
  sortArticles,
  processArticles,
  isValidImageUrl,
  getImageUrlWithFallback,
  extractDomain,
} from "../article-utils";
import type { SpaceflightArticle } from "~/types/spaceflight";

// Mock articles for testing
const mockArticles: SpaceflightArticle[] = [
  {
    id: 1,
    title: "SpaceX Launches Starship",
    summary: "SpaceX successfully launched its Starship rocket",
    image_url: "https://example.com/spacex.jpg",
    news_site: "Space News",
    published_at: "2024-01-15T10:00:00Z",
    url: "https://spacenews.com/article1",
  },
  {
    id: 2,
    title: "NASA Mars Mission Update",
    summary: "NASA provides update on Mars exploration mission",
    image_url: "https://example.com/nasa.jpg",
    news_site: "NASA News",
    published_at: "2024-01-10T15:30:00Z",
    url: "https://nasa.gov/article2",
  },
  {
    id: 3,
    title: "Blue Origin Test Flight",
    summary: "Blue Origin conducts successful test flight",
    image_url: "https://example.com/blueorigin.jpg",
    news_site: "Aviation Week",
    published_at: "2024-01-20T08:45:00Z",
    url: "https://aviationweek.com/article3",
  },
];

describe("formatPublishedDate", () => {
  it("should format valid date string", () => {
    const result = formatPublishedDate("2024-01-15T10:00:00Z");
    expect(result).toBe("January 15, 2024");
  });

  it("should handle invalid date string", () => {
    const result = formatPublishedDate("invalid-date");
    expect(result).toBe("Unknown date");
  });

  it("should handle empty string", () => {
    const result = formatPublishedDate("");
    expect(result).toBe("Unknown date");
  });
});

describe("formatRelativeTime", () => {
  it("should return 'Just now' for very recent dates", () => {
    const now = new Date();
    const result = formatRelativeTime(now.toISOString());
    expect(result).toBe("Just now");
  });

  it("should return hours ago for same day", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const result = formatRelativeTime(twoHoursAgo.toISOString());
    expect(result).toBe("2 hours ago");
  });

  it("should return 'Yesterday' for previous day", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(yesterday.toISOString());
    expect(result).toBe("Yesterday");
  });

  it("should return days ago for recent dates", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(threeDaysAgo.toISOString());
    expect(result).toBe("3 days ago");
  });

  it("should return weeks ago for older dates", () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(twoWeeksAgo.toISOString());
    expect(result).toBe("2 weeks ago");
  });

  it("should return formatted date for very old dates", () => {
    const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(twoMonthsAgo.toISOString());
    expect(result).toMatch(/\w+ \d+, \d{4}/); // Should match "Month Day, Year" format
  });

  it("should handle invalid date string", () => {
    const result = formatRelativeTime("invalid-date");
    expect(result).toBe("Unknown date");
  });
});

describe("truncateText", () => {
  it("should not truncate text shorter than max length", () => {
    const result = truncateText("Short text", 20);
    expect(result).toBe("Short text");
  });

  it("should truncate text longer than max length", () => {
    const result = truncateText(
      "This is a very long text that should be truncated",
      20,
    );
    expect(result).toBe("This is a very long...");
  });

  it("should handle exact length", () => {
    const text = "Exactly twenty chars";
    const result = truncateText(text, 20);
    expect(result).toBe(text);
  });

  it("should handle empty string", () => {
    const result = truncateText("", 10);
    expect(result).toBe("");
  });
});

describe("filterArticlesBySearch", () => {
  it("should return all articles when search term is empty", () => {
    const result = filterArticlesBySearch(mockArticles, "");
    expect(result).toEqual(mockArticles);
  });

  it("should return all articles when search term is whitespace", () => {
    const result = filterArticlesBySearch(mockArticles, "   ");
    expect(result).toEqual(mockArticles);
  });

  it("should filter articles by title", () => {
    const result = filterArticlesBySearch(mockArticles, "SpaceX");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("SpaceX Launches Starship");
  });

  it("should filter articles by summary", () => {
    const result = filterArticlesBySearch(mockArticles, "Mars");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("NASA Mars Mission Update");
  });

  it("should filter articles by news site", () => {
    const result = filterArticlesBySearch(mockArticles, "NASA");
    expect(result).toHaveLength(1);
    expect(result[0].news_site).toBe("NASA News");
  });

  it("should be case insensitive", () => {
    const result = filterArticlesBySearch(mockArticles, "spacex");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("SpaceX Launches Starship");
  });

  it("should return empty array when no matches", () => {
    const result = filterArticlesBySearch(mockArticles, "nonexistent");
    expect(result).toHaveLength(0);
  });

  it("should handle partial matches", () => {
    const result = filterArticlesBySearch(mockArticles, "test");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Blue Origin Test Flight");
  });
});

describe("sortArticles", () => {
  it("should sort articles by title alphabetically", () => {
    const result = sortArticles(mockArticles, "title");
    expect(result[0].title).toBe("Blue Origin Test Flight");
    expect(result[1].title).toBe("NASA Mars Mission Update");
    expect(result[2].title).toBe("SpaceX Launches Starship");
  });

  it("should sort articles by date (newest first)", () => {
    const result = sortArticles(mockArticles, "date");
    expect(result[0].published_at).toBe("2024-01-20T08:45:00Z"); // Blue Origin (newest)
    expect(result[1].published_at).toBe("2024-01-15T10:00:00Z"); // SpaceX
    expect(result[2].published_at).toBe("2024-01-10T15:30:00Z"); // NASA (oldest)
  });

  it("should not mutate original array", () => {
    const originalOrder = [...mockArticles];
    sortArticles(mockArticles, "title");
    expect(mockArticles).toEqual(originalOrder);
  });

  it("should handle empty array", () => {
    const result = sortArticles([], "title");
    expect(result).toEqual([]);
  });

  it("should handle invalid sort criteria", () => {
    const result = sortArticles(mockArticles, "invalid" as any);
    expect(result).toEqual(mockArticles);
  });
});

describe("processArticles", () => {
  it("should filter and sort articles", () => {
    const result = processArticles(mockArticles, "NASA", "title");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("NASA Mars Mission Update");
  });

  it("should use default parameters", () => {
    const result = processArticles(mockArticles);
    expect(result).toHaveLength(3);
    // Should be sorted by date (newest first)
    expect(result[0].published_at).toBe("2024-01-20T08:45:00Z");
  });

  it("should handle empty search with sorting", () => {
    const result = processArticles(mockArticles, "", "title");
    expect(result).toHaveLength(3);
    expect(result[0].title).toBe("Blue Origin Test Flight");
  });
});

describe("isValidImageUrl", () => {
  it("should return true for valid HTTP URL", () => {
    const result = isValidImageUrl("http://example.com/image.jpg");
    expect(result).toBe(true);
  });

  it("should return true for valid HTTPS URL", () => {
    const result = isValidImageUrl("https://example.com/image.jpg");
    expect(result).toBe(true);
  });

  it("should return false for invalid URL", () => {
    const result = isValidImageUrl("not-a-url");
    expect(result).toBe(false);
  });

  it("should return false for FTP URL", () => {
    const result = isValidImageUrl("ftp://example.com/image.jpg");
    expect(result).toBe(false);
  });

  it("should return false for empty string", () => {
    const result = isValidImageUrl("");
    expect(result).toBe(false);
  });
});

describe("getImageUrlWithFallback", () => {
  it("should return original URL if valid", () => {
    const url = "https://example.com/image.jpg";
    const result = getImageUrlWithFallback(url);
    expect(result).toBe(url);
  });

  it("should return fallback URL if invalid", () => {
    const result = getImageUrlWithFallback("invalid-url");
    expect(result).toBe("/placeholder-space-image.jpg");
  });
});

describe("extractDomain", () => {
  it("should extract domain from URL", () => {
    const result = extractDomain("https://www.example.com/path");
    expect(result).toBe("example.com");
  });

  it("should handle URL without www", () => {
    const result = extractDomain("https://example.com/path");
    expect(result).toBe("example.com");
  });

  it("should handle invalid URL", () => {
    const result = extractDomain("not-a-url");
    expect(result).toBe("Unknown source");
  });

  it("should handle empty string", () => {
    const result = extractDomain("");
    expect(result).toBe("Unknown source");
  });
});
