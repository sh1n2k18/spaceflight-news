import type { SpaceflightArticle, SortBy } from "~/types/spaceflight";

/**
 * Formats a date string to a human-readable format
 */
export function formatPublishedDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Unknown date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Unknown date";
  }
}

/**
 * Formats a date string to a relative time format (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Unknown date";
    }
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
      }
      return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    }

    if (diffInDays === 1) {
      return "Yesterday";
    }

    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }

    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }

    return formatPublishedDate(dateString);
  } catch {
    return "Unknown date";
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
 * Filters articles based on search term (searches in title and summary)
 */
export function filterArticlesBySearch(
  articles: SpaceflightArticle[],
  searchTerm: string,
): SpaceflightArticle[] {
  if (!searchTerm.trim()) {
    return articles;
  }

  const normalizedSearch = searchTerm.toLowerCase().trim();

  return articles.filter((article) => {
    const titleMatch = article.title.toLowerCase().includes(normalizedSearch);
    const summaryMatch = article.summary
      .toLowerCase()
      .includes(normalizedSearch);
    const sourceMatch = article.news_site
      .toLowerCase()
      .includes(normalizedSearch);

    return titleMatch || summaryMatch || sourceMatch;
  });
}

/**
 * Sorts articles based on the specified criteria
 */
export function sortArticles(
  articles: SpaceflightArticle[],
  sortBy: SortBy,
): SpaceflightArticle[] {
  const sortedArticles = [...articles];

  switch (sortBy) {
    case "title":
      return sortedArticles.sort((a, b) =>
        a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
      );

    case "date":
      return sortedArticles.sort((a, b) => {
        const dateA = new Date(a.published_at);
        const dateB = new Date(b.published_at);
        return dateB.getTime() - dateA.getTime(); // Newest first
      });

    default:
      return sortedArticles;
  }
}

/**
 * Combines filtering and sorting operations
 */
export function processArticles(
  articles: SpaceflightArticle[],
  searchTerm: string = "",
  sortBy: SortBy = "date",
): SpaceflightArticle[] {
  const filtered = filterArticlesBySearch(articles, searchTerm);
  return sortArticles(filtered, sortBy);
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
  // Return a placeholder image URL
  return "/placeholder-space-image.jpg";
}

/**
 * Extracts domain from news site URL for display
 */
export function extractDomain(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace("www.", "");
  } catch {
    return "Unknown source";
  }
}
