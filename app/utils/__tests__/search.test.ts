import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { filterArticlesBySearch, debounce } from "../index";
import type { SpaceflightArticle } from "~/types";

// Mock articles for testing
const mockArticles: SpaceflightArticle[] = [
  {
    id: 1,
    title: "SpaceX Launches Starship",
    summary: "SpaceX successfully launched its Starship rocket",
    image_url: "https://example.com/image1.jpg",
    news_site: "SpaceNews",
    published_at: "2024-01-01T00:00:00Z",
    url: "https://example.com/article1",
  },
  {
    id: 2,
    title: "NASA Mars Mission Update",
    summary: "Latest updates from NASA's Mars exploration mission",
    image_url: "https://example.com/image2.jpg",
    news_site: "NASA News",
    published_at: "2024-01-02T00:00:00Z",
    url: "https://example.com/article2",
  },
  {
    id: 3,
    title: "Blue Origin Rocket Test",
    summary: "Blue Origin conducts successful rocket engine test",
    image_url: "https://example.com/image3.jpg",
    news_site: "Space Today",
    published_at: "2024-01-03T00:00:00Z",
    url: "https://example.com/article3",
  },
  {
    id: 4,
    title: "International Space Station News",
    summary: "Crew rotation and experiments aboard the ISS",
    image_url: "https://example.com/image4.jpg",
    news_site: "Space Daily",
    published_at: "2024-01-04T00:00:00Z",
    url: "https://example.com/article4",
  },
];

describe("filterArticlesBySearch", () => {
  it("returns all articles when search term is empty", () => {
    const result = filterArticlesBySearch(mockArticles, "");
    expect(result).toEqual(mockArticles);
  });

  it("returns all articles when search term is only whitespace", () => {
    const result = filterArticlesBySearch(mockArticles, "   ");
    expect(result).toEqual(mockArticles);
  });

  it("filters articles by title (case insensitive)", () => {
    const result = filterArticlesBySearch(mockArticles, "spacex");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("SpaceX Launches Starship");
  });

  it("filters articles by title (exact case)", () => {
    const result = filterArticlesBySearch(mockArticles, "SpaceX");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("SpaceX Launches Starship");
  });

  it("filters articles by partial title match", () => {
    const result = filterArticlesBySearch(mockArticles, "rocket");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3); // Blue Origin Rocket Test
  });

  it("returns empty array when no articles match", () => {
    const result = filterArticlesBySearch(mockArticles, "nonexistent");
    expect(result).toHaveLength(0);
  });

  it("handles special characters in search term", () => {
    const result = filterArticlesBySearch(mockArticles, "nasa's");
    expect(result).toHaveLength(0); // No exact match for "nasa's"
  });

  it("filters by multiple words", () => {
    const result = filterArticlesBySearch(mockArticles, "space station");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("International Space Station News");
  });

  it("trims whitespace from search term", () => {
    const result = filterArticlesBySearch(mockArticles, "  spacex  ");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("SpaceX Launches Starship");
  });

  it("handles empty articles array", () => {
    const result = filterArticlesBySearch([], "spacex");
    expect(result).toHaveLength(0);
  });

  it("is case insensitive for mixed case search", () => {
    const result = filterArticlesBySearch(mockArticles, "SpAcEx");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("SpaceX Launches Starship");
  });

  it("matches articles with numbers in title", () => {
    const articlesWithNumbers: SpaceflightArticle[] = [
      {
        id: 1,
        title: "Falcon 9 Launch Success",
        summary: "Falcon 9 rocket launches successfully",
        image_url: "https://example.com/image.jpg",
        news_site: "SpaceNews",
        published_at: "2024-01-01T00:00:00Z",
        url: "https://example.com/article",
      },
    ];

    const result = filterArticlesBySearch(articlesWithNumbers, "falcon 9");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Falcon 9 Launch Success");
  });
});

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("delays function execution", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("test");
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledWith("test");
  });

  it("cancels previous calls when called multiple times", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("first");
    debouncedFn("second");
    debouncedFn("third");

    vi.advanceTimersByTime(300);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("third");
  });

  it("handles multiple arguments", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("arg1", "arg2", "arg3");
    vi.advanceTimersByTime(300);

    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2", "arg3");
  });

  it("works with different delay times", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn("test");

    vi.advanceTimersByTime(300);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(mockFn).toHaveBeenCalledWith("test");
  });

  it("resets timer on subsequent calls", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("first");
    vi.advanceTimersByTime(200);

    debouncedFn("second");
    vi.advanceTimersByTime(200);

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith("second");
  });
});
