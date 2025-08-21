import type { SpaceflightArticle, SortBy } from "~/types";

/**
 * Filters articles by search term (searches in title)
 */
export function filterArticlesBySearch(
  articles: SpaceflightArticle[],
  searchTerm: string,
): SpaceflightArticle[] {
  if (!searchTerm.trim()) {
    return articles;
  }

  const lowercaseSearch = searchTerm.trim().toLowerCase();
  return articles.filter((article) =>
    article.title.toLowerCase().includes(lowercaseSearch),
  );
}

/**
 * Sorts articles by the specified criteria
 */
export function sortArticles(
  articles: SpaceflightArticle[],
  sortBy: SortBy,
): SpaceflightArticle[] {
  const sortedArticles = [...articles];

  switch (sortBy) {
    case "title":
      return sortedArticles.sort((a, b) => a.title.localeCompare(b.title));
    case "date":
      return sortedArticles.sort(
        (a, b) =>
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime(),
      );
    default:
      return sortedArticles;
  }
}

/**
 * Formats a date string for display
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Validates if an image URL is accessible (basic validation)
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Gets a fallback image URL if the original is invalid
 */
export function getImageUrlWithFallback(imageUrl: string): string {
  if (isValidImageUrl(imageUrl)) {
    return imageUrl;
  }
  // Return a placeholder image URL - in production, this should be a real placeholder
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f3f4f6'/%3E%3Ctext x='200' y='112.5' text-anchor='middle' fill='%236b7280' font-family='Arial, sans-serif' font-size='14'%3ESpace News Image%3C/text%3E%3C/svg%3E";
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: globalThis.NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Export accessibility utilities
export * from "./accessibility-utils";
