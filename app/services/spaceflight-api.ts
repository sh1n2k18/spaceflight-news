import type {
  SpaceflightApiResponse,
  SpaceflightArticle,
} from "~/types/spaceflight";

const BASE_URL = "https://api.spaceflightnewsapi.net/v4";
const ARTICLES_ENDPOINT = "/articles/";

/**
 * Custom error class for API-related errors
 */
export class SpaceflightApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "SpaceflightApiError";
  }
}

/**
 * Validates if the response matches the expected SpaceflightApiResponse structure
 */
function validateApiResponse(data: unknown): data is SpaceflightApiResponse {
  if (!data || typeof data !== "object") {
    return false;
  }

  const response = data as Record<string, unknown>;

  return (
    typeof response.count === "number" &&
    (response.next === null || typeof response.next === "string") &&
    (response.previous === null || typeof response.previous === "string") &&
    Array.isArray(response.results) &&
    response.results.every(validateArticle)
  );
}

/**
 * Validates if an object matches the SpaceflightArticle structure
 */
function validateArticle(article: unknown): article is SpaceflightArticle {
  if (!article || typeof article !== "object") {
    return false;
  }

  const art = article as Record<string, unknown>;

  return (
    typeof art.id === "number" &&
    typeof art.title === "string" &&
    typeof art.summary === "string" &&
    typeof art.image_url === "string" &&
    typeof art.news_site === "string" &&
    typeof art.published_at === "string" &&
    typeof art.url === "string"
  );
}

/**
 * Makes HTTP requests with error handling and timeout
 */
async function makeRequest(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new SpaceflightApiError(
        `HTTP error! status: ${response.status}`,
        response.status,
        response.statusText,
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof SpaceflightApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new SpaceflightApiError("Request timeout", 408, "TIMEOUT");
      }
      throw new SpaceflightApiError(
        `Network error: ${error.message}`,
        0,
        "NETWORK_ERROR",
      );
    }

    throw new SpaceflightApiError("Unknown error occurred", 0, "UNKNOWN_ERROR");
  }
}

/**
 * Fetches articles from the Spaceflight News API
 */
export async function fetchArticles(
  limit: number = 20,
  offset: number = 0,
  ordering: string = "-published_at",
): Promise<SpaceflightApiResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    ordering,
  });

  const url = `${BASE_URL}${ARTICLES_ENDPOINT}?${params}`;

  try {
    const response = await makeRequest(url);
    const data = await response.json();

    if (!validateApiResponse(data)) {
      throw new SpaceflightApiError(
        "Invalid response format from API",
        response.status,
        "INVALID_RESPONSE",
      );
    }

    return data;
  } catch (error) {
    if (error instanceof SpaceflightApiError) {
      throw error;
    }
    throw new SpaceflightApiError("Failed to fetch articles", 0, "FETCH_ERROR");
  }
}

/**
 * Fetches a single article by ID
 */
export async function fetchArticleById(
  id: number,
): Promise<SpaceflightArticle> {
  const url = `${BASE_URL}${ARTICLES_ENDPOINT}${id}/`;

  try {
    const response = await makeRequest(url);
    const data = await response.json();

    if (!validateArticle(data)) {
      throw new SpaceflightApiError(
        "Invalid article format from API",
        response.status,
        "INVALID_ARTICLE",
      );
    }

    return data;
  } catch (error) {
    if (error instanceof SpaceflightApiError) {
      throw error;
    }
    throw new SpaceflightApiError(
      `Failed to fetch article ${id}`,
      0,
      "FETCH_ERROR",
    );
  }
}

/**
 * Fetches the latest articles (convenience function)
 */
export async function fetchLatestArticles(
  limit: number = 20,
): Promise<SpaceflightArticle[]> {
  const response = await fetchArticles(limit, 0, "-published_at");
  return response.results;
}
