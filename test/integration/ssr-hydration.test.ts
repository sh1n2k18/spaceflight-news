import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchLatestArticles } from "~/services/spaceflight-api";
import type { SpaceflightArticle } from "~/types";

// Mock the API service
vi.mock("~/services/spaceflight-api");

const mockFetchLatestArticles = vi.mocked(fetchLatestArticles);

const mockArticles: SpaceflightArticle[] = [
  {
    id: 1,
    title: "SpaceX Launches Starship",
    summary:
      "SpaceX successfully launched its Starship rocket on a test flight.",
    image_url: "https://example.com/image1.jpg",
    news_site: "SpaceNews",
    published_at: "2024-01-15T10:00:00Z",
    url: "https://example.com/article1",
  },
];

describe("SSR and Hydration Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle server-side data loading correctly", async () => {
    mockFetchLatestArticles.mockResolvedValue(mockArticles);

    // Import the loader function
    const { loader } = await import("~/routes/_index");

    const request = new Request("http://localhost:3000/");
    const response = await loader({ request, params: {}, context: {} });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.articles).toHaveLength(1);
    expect(data.articles[0].title).toBe("SpaceX Launches Starship");
    expect(data.error).toBeNull();
    expect(data.meta.loadedAt).toBeDefined();
  });

  it("should provide proper TypeScript types for loader data", async () => {
    mockFetchLatestArticles.mockResolvedValue(mockArticles);

    const { loader } = await import("~/routes/_index");

    const request = new Request("http://localhost:3000/");
    const response = await loader({ request, params: {}, context: {} });
    const data = await response.json();

    // TypeScript should infer these types correctly
    expect(typeof data.articles).toBe("object");
    expect(Array.isArray(data.articles)).toBe(true);
    expect(typeof data.error).toBe("object"); // null is typeof object
    expect(typeof data.meta).toBe("object");
    expect(typeof data.meta.total).toBe("number");
    expect(typeof data.meta.hasMore).toBe("boolean");
    expect(typeof data.meta.loadedAt).toBe("string");
  });

  it("should handle error boundary scenarios", async () => {
    // Test that error boundary component exists and can be imported
    const { ErrorBoundary } = await import("~/routes/_index");
    expect(ErrorBoundary).toBeDefined();
    expect(typeof ErrorBoundary).toBe("function");
  });

  it("should provide fallback data structure on errors", async () => {
    const error = new Error("Network failure");
    mockFetchLatestArticles.mockRejectedValue(error);

    const { loader } = await import("~/routes/_index");

    const request = new Request("http://localhost:3000/");
    const response = await loader({ request, params: {}, context: {} });
    const data = await response.json();

    // Should still provide consistent data structure
    expect(data).toHaveProperty("articles");
    expect(data).toHaveProperty("error");
    expect(data).toHaveProperty("meta");
    expect(data.articles).toEqual([]);
    expect(data.error).toBe("Network failure");
    expect(data.meta.total).toBe(0);
    expect(data.meta.hasMore).toBe(false);
  });

  it("should set appropriate HTTP headers for caching", async () => {
    mockFetchLatestArticles.mockResolvedValue(mockArticles);

    const { loader } = await import("~/routes/_index");

    const request = new Request("http://localhost:3000/");
    const response = await loader({ request, params: {}, context: {} });

    // Check cache headers
    const cacheControl = response.headers.get("Cache-Control");
    expect(cacheControl).toContain("public");
    expect(cacheControl).toContain("max-age=300");
    expect(cacheControl).toContain("stale-while-revalidate=600");
  });

  it("should handle URL parameters correctly", async () => {
    mockFetchLatestArticles.mockResolvedValue(mockArticles);

    const { loader } = await import("~/routes/_index");

    // Test with limit parameter
    const request = new Request("http://localhost:3000/?limit=15");
    await loader({ request, params: {}, context: {} });

    expect(mockFetchLatestArticles).toHaveBeenCalledWith(15);
  });
});
