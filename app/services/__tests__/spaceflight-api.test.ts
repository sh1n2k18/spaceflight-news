import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchArticles,
  fetchArticleById,
  fetchLatestArticles,
  SpaceflightApiError,
} from "../spaceflight-api";
import type {
  SpaceflightApiResponse,
  SpaceflightArticle,
} from "~/types/spaceflight";

// Mock data
const mockArticle: SpaceflightArticle = {
  id: 1,
  title: "Test Article",
  summary: "This is a test article summary",
  image_url: "https://example.com/image.jpg",
  news_site: "Test News",
  published_at: "2024-01-01T12:00:00Z",
  url: "https://example.com/article",
};

const mockApiResponse: SpaceflightApiResponse = {
  count: 1,
  next: null,
  previous: null,
  results: [mockArticle],
};

// Helper function to create proper Response objects
function createMockResponse(data: any, status = 200, statusText = "OK") {
  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: { "Content-Type": "application/json" },
  });
}

describe("SpaceflightApiError", () => {
  it("should create error with message", () => {
    const error = new SpaceflightApiError("Test error");
    expect(error.message).toBe("Test error");
    expect(error.name).toBe("SpaceflightApiError");
    expect(error.status).toBeUndefined();
    expect(error.code).toBeUndefined();
  });

  it("should create error with status and code", () => {
    const error = new SpaceflightApiError("Test error", 404, "NOT_FOUND");
    expect(error.message).toBe("Test error");
    expect(error.status).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
  });
});

describe("fetchArticles", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch articles successfully", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(createMockResponse(mockApiResponse));

    const result = await fetchArticles();

    expect(result).toEqual(mockApiResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://api.spaceflightnewsapi.net/v4/articles/",
      ),
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
  });

  it("should handle custom parameters", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(createMockResponse(mockApiResponse));

    await fetchArticles(10, 5, "title");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=10&offset=5&ordering=title"),
      expect.any(Object),
    );
  });

  it("should throw SpaceflightApiError on HTTP error", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue(createMockResponse(null, 404, "Not Found"));

    const error = await fetchArticles().catch((e) => e);
    expect(error).toBeInstanceOf(SpaceflightApiError);
    expect(error.message).toContain("HTTP error! status: 404");
  });

  it("should throw SpaceflightApiError on network error", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValue(new Error("Network error"));

    const error = await fetchArticles().catch((e) => e);
    expect(error).toBeInstanceOf(SpaceflightApiError);
    expect(error.message).toContain("Network error: Network error");
  });

  it("should throw SpaceflightApiError on timeout", async () => {
    const mockFetch = vi.mocked(fetch);
    const abortError = new Error("The operation was aborted");
    abortError.name = "AbortError";
    mockFetch.mockRejectedValue(abortError);

    const error = await fetchArticles().catch((e) => e);
    expect(error).toBeInstanceOf(SpaceflightApiError);
    expect(error.message).toContain("Request timeout");
  });

  it("should throw SpaceflightApiError on invalid response format", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue(createMockResponse({ invalid: "response" }));

    const error = await fetchArticles().catch((e) => e);
    expect(error).toBeInstanceOf(SpaceflightApiError);
    expect(error.message).toContain("Invalid response format from API");
  });

  it("should validate response structure correctly", async () => {
    const mockFetch = vi.mocked(fetch);

    // Test with missing required fields
    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Test",
            // missing required fields
          },
        ],
      }),
    );

    await expect(fetchArticles()).rejects.toThrow(SpaceflightApiError);
  });
});

describe("fetchArticleById", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch single article successfully", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(createMockResponse(mockArticle));

    const result = await fetchArticleById(1);

    expect(result).toEqual(mockArticle);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.spaceflightnewsapi.net/v4/articles/1/",
      expect.any(Object),
    );
  });

  it("should throw SpaceflightApiError on HTTP error", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(createMockResponse(null, 404, "Not Found"));

    await expect(fetchArticleById(1)).rejects.toThrow(SpaceflightApiError);
  });

  it("should throw SpaceflightApiError on invalid article format", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue(createMockResponse({ invalid: "article" }));

    const error = await fetchArticleById(1).catch((e) => e);
    expect(error).toBeInstanceOf(SpaceflightApiError);
    expect(error.message).toContain("Invalid article format from API");
  });
});

describe("fetchLatestArticles", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch latest articles successfully", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(createMockResponse(mockApiResponse));

    const result = await fetchLatestArticles(10);

    expect(result).toEqual([mockArticle]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=10&offset=0&ordering=-published_at"),
      expect.any(Object),
    );
  });

  it("should use default limit when not specified", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(createMockResponse(mockApiResponse));

    await fetchLatestArticles();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=20"),
      expect.any(Object),
    );
  });
});
