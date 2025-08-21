import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader } from "~/routes/_index";
import {
  fetchLatestArticles,
  SpaceflightApiError,
} from "~/services/spaceflight-api";
import type { SpaceflightArticle } from "~/types";

// Mock the API service
vi.mock("~/services/spaceflight-api", () => ({
  fetchLatestArticles: vi.fn(),
  SpaceflightApiError: class extends Error {
    constructor(
      message: string,
      public status?: number,
      public code?: string,
    ) {
      super(message);
      this.name = "SpaceflightApiError";
    }
  },
}));

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
  {
    id: 2,
    title: "NASA Mars Mission Update",
    summary: "NASA provides updates on the Mars exploration mission.",
    image_url: "https://example.com/image2.jpg",
    news_site: "NASA",
    published_at: "2024-01-14T15:30:00Z",
    url: "https://example.com/article2",
  },
];

describe("Server-side data loading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loader function", () => {
    it("should successfully fetch and return articles data", async () => {
      mockFetchLatestArticles.mockResolvedValue(mockArticles);

      const request = new Request("http://localhost:3000/");
      const response = await loader({ request, params: {}, context: {} });
      const data = await response.json();

      expect(data.articles).toEqual(mockArticles);
      expect(data.error).toBeNull();
      expect(data.meta.total).toBe(2);
      expect(data.meta.hasMore).toBe(false);
      expect(data.meta.loadedAt).toBeDefined();
    });

    it("should handle API errors gracefully", async () => {
      const apiError = new SpaceflightApiError(
        "API is down",
        503,
        "SERVICE_UNAVAILABLE",
      );
      mockFetchLatestArticles.mockRejectedValue(apiError);

      const request = new Request("http://localhost:3000/");
      const response = await loader({ request, params: {}, context: {} });
      const data = await response.json();

      expect(data.articles).toEqual([]);
      expect(data.error).toBe("API is down");
      expect(data.meta.total).toBe(0);
      expect(data.meta.hasMore).toBe(false);
      expect(response.status).toBe(500);
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network connection failed");
      mockFetchLatestArticles.mockRejectedValue(networkError);

      const request = new Request("http://localhost:3000/");
      const response = await loader({ request, params: {}, context: {} });
      const data = await response.json();

      expect(data.articles).toEqual([]);
      expect(data.error).toBe("Network connection failed");
      expect(data.meta.total).toBe(0);
      expect(response.status).toBe(500);
    });

    it("should respect limit parameter from URL", async () => {
      mockFetchLatestArticles.mockResolvedValue(mockArticles);

      const request = new Request("http://localhost:3000/?limit=10");
      await loader({ request, params: {}, context: {} });

      expect(mockFetchLatestArticles).toHaveBeenCalledWith(10);
    });

    it("should cap limit parameter at 50", async () => {
      mockFetchLatestArticles.mockResolvedValue(mockArticles);

      const request = new Request("http://localhost:3000/?limit=100");
      await loader({ request, params: {}, context: {} });

      expect(mockFetchLatestArticles).toHaveBeenCalledWith(50);
    });

    it("should set appropriate cache headers for successful responses", async () => {
      mockFetchLatestArticles.mockResolvedValue(mockArticles);

      const request = new Request("http://localhost:3000/");
      const response = await loader({ request, params: {}, context: {} });

      expect(response.headers.get("Cache-Control")).toBe(
        "public, max-age=300, stale-while-revalidate=600",
      );
    });

    it("should set no-cache headers for error responses", async () => {
      const apiError = new SpaceflightApiError("API error", 500);
      mockFetchLatestArticles.mockRejectedValue(apiError);

      const request = new Request("http://localhost:3000/");
      const response = await loader({ request, params: {}, context: {} });

      expect(response.headers.get("Cache-Control")).toBe(
        "no-cache, no-store, must-revalidate",
      );
    });

    it("should set retry-after header for rate limiting errors", async () => {
      const rateLimitError = new SpaceflightApiError("Rate limited", 429);
      mockFetchLatestArticles.mockRejectedValue(rateLimitError);

      const request = new Request("http://localhost:3000/");
      const response = await loader({ request, params: {}, context: {} });

      expect(response.headers.get("Retry-After")).toBe("60");
    });

    it("should include metadata in successful responses", async () => {
      const fullLimitArticles = Array.from({ length: 20 }, (_, i) => ({
        ...mockArticles[0],
        id: i + 1,
        title: `Article ${i + 1}`,
      }));

      mockFetchLatestArticles.mockResolvedValue(fullLimitArticles);

      const request = new Request("http://localhost:3000/?limit=20");
      const response = await loader({ request, params: {}, context: {} });
      const data = await response.json();

      expect(data.meta.total).toBe(20);
      expect(data.meta.hasMore).toBe(true); // Should be true when we get the full limit
      expect(data.meta.loadedAt).toBeDefined();
      expect(new Date(data.meta.loadedAt)).toBeInstanceOf(Date);
    });

    it("should handle empty results", async () => {
      mockFetchLatestArticles.mockResolvedValue([]);

      const request = new Request("http://localhost:3000/");
      const response = await loader({ request, params: {}, context: {} });
      const data = await response.json();

      expect(data.articles).toEqual([]);
      expect(data.error).toBeNull();
      expect(data.meta.total).toBe(0);
      expect(data.meta.hasMore).toBe(false);
    });
  });

  describe("Error handling", () => {
    it("should differentiate between client and server errors", async () => {
      const clientError = new SpaceflightApiError("Bad request", 400);
      mockFetchLatestArticles.mockRejectedValue(clientError);

      const request = new Request("http://localhost:3000/");
      const response = await loader({ request, params: {}, context: {} });

      // Client errors should return 200 with error data for graceful handling
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.error).toBe("Bad request");
    });

    it("should return 500 for server errors", async () => {
      const serverError = new SpaceflightApiError("Internal server error", 500);
      mockFetchLatestArticles.mockRejectedValue(serverError);

      const request = new Request("http://localhost:3000/");
      const response = await loader({ request, params: {}, context: {} });

      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data.error).toBe("Internal server error");
    });
  });
});
