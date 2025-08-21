/**
 * TypeScript interfaces for Spaceflight News API data models
 */

export interface SpaceflightArticle {
  id: number;
  title: string;
  summary: string;
  image_url: string;
  news_site: string;
  published_at: string; // ISO 8601 format
  url: string;
}

export interface SpaceflightApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SpaceflightArticle[];
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export type SortBy = "title" | "date";

export interface ArticleFilters {
  searchTerm?: string;
  sortBy?: SortBy;
}

/**
 * Loader data type for the main articles route
 */
export interface ArticlesLoaderData {
  articles: SpaceflightArticle[];
  error: string | null;
  meta: {
    total: number;
    hasMore: boolean;
    loadedAt: string;
  };
}

/**
 * Server-side error response type
 */
export interface ServerError {
  message: string;
  status: number;
  timestamp: string;
  retryAfter?: number;
}
