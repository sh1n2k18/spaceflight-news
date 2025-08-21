import type { MetaFunction, LoaderFunctionArgs } from "react-router";
// Using native Response constructor for React Router v7
import { useLoaderData } from "react-router";
import { useState, useMemo } from "react";
import { css } from "styled-system/css";
import {
  ArticlesList,
  SearchBar,
  EmptyState,
  SortControls,
  ErrorBoundary as CustomErrorBoundary,
} from "~/components";
import {
  fetchLatestArticles,
  SpaceflightApiError,
} from "~/services/spaceflight-api";
import { filterArticlesBySearch, sortArticles } from "~/utils";
import type { SortBy, ArticlesLoaderData } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Spaceflight News - Latest Space Mission Updates" },
    {
      name: "description",
      content:
        "Discover the latest spaceflight news, mission updates, and space exploration stories from around the world.",
    },
  ];
};

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<Response> {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50); // Cap at 50 articles
  const loadedAt = new Date().toISOString();

  try {
    // Attempt to fetch articles with timeout and retry logic
    const articles = await fetchLatestArticles(limit);

    const loaderData: ArticlesLoaderData = {
      articles,
      error: null,
      meta: {
        total: articles.length,
        hasMore: articles.length === limit, // Assume there might be more if we got the full limit
        loadedAt,
      },
    };

    return new Response(JSON.stringify(loaderData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600", // Cache for 5 minutes, serve stale for 10 minutes
      },
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);

    // Enhanced error handling with different fallback strategies
    let errorMessage = "Failed to load articles";
    let statusCode = 500;
    let retryAfter: number | undefined;

    if (error instanceof SpaceflightApiError) {
      errorMessage = error.message;
      statusCode = error.status || 500;

      // Set retry-after for rate limiting or temporary failures
      if (error.status === 429 || error.status === 503) {
        retryAfter = 60; // Retry after 1 minute
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Return fallback data with error information
    const fallbackData: ArticlesLoaderData = {
      articles: [], // Empty array as fallback
      error: errorMessage,
      meta: {
        total: 0,
        hasMore: false,
        loadedAt,
      },
    };

    const headers: Record<string, string> = {
      "Cache-Control": "no-cache, no-store, must-revalidate", // Don't cache errors
    };

    if (retryAfter) {
      headers["Retry-After"] = retryAfter.toString();
    }

    // For server errors, return 500 status but still provide JSON response
    // This allows the client to handle the error gracefully
    return new Response(JSON.stringify(fallbackData), {
      status: statusCode >= 500 ? 500 : 200, // Return 500 for server errors, 200 for client errors with error data
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  }
}

export function ErrorBoundary() {
  return <CustomErrorBoundary />;
}

export default function Index() {
  const { articles, error, meta } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("date"); // Default to chronological (newest first)

  // Filter and sort articles based on search term and sort criteria
  const filteredAndSortedArticles = useMemo(() => {
    const filtered = filterArticlesBySearch(articles, searchTerm);
    return sortArticles(filtered, sortBy);
  }, [articles, searchTerm, sortBy]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSortChange = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <div
      className={css({
        minHeight: "100vh",
        backgroundColor: "gray.50",
      })}
    >
      {/* Header */}
      <header
        className={css({
          backgroundColor: "white",
          boxShadow: "sm",
          borderBottom: "1px solid",
          borderColor: "gray.200",
        })}
      >
        <div
          className={css({
            maxWidth: "7xl",
            marginX: "auto",
            paddingX: { base: "4", sm: "6", lg: "8" },
          })}
        >
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "16",
            })}
          >
            <div
              className={css({
                display: "flex",
                alignItems: "center",
              })}
            >
              <h1
                className={css({
                  fontSize: "2xl",
                  fontWeight: "bold",
                  color: "gray.900",
                })}
              >
                🚀 Spaceflight News
              </h1>
            </div>
            <nav
              className={css({
                display: { base: "none", md: "block" },
              })}
            >
              <div
                className={css({
                  marginLeft: "10",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "4",
                })}
              >
                <span
                  className={css({
                    color: "gray.500",
                    fontSize: "sm",
                  })}
                >
                  Latest space mission updates
                </span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className={css({
          maxWidth: "7xl",
          marginX: "auto",
          paddingX: { base: "4", sm: "6", lg: "8" },
          paddingY: "8",
        })}
      >
        {/* Error State */}
        {error && (
          <div
            className={css({
              backgroundColor: "red.50",
              border: "1px solid",
              borderColor: "red.200",
              borderRadius: "lg",
              padding: "6",
              marginBottom: "8",
            })}
          >
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                marginBottom: "3",
              })}
            >
              <svg
                className={css({
                  height: "6",
                  width: "6",
                  color: "red.400",
                  marginRight: "3",
                })}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3
                className={css({
                  fontSize: "lg",
                  fontWeight: "medium",
                  color: "red.800",
                })}
              >
                Failed to Load Articles
              </h3>
            </div>
            <p
              className={css({
                fontSize: "sm",
                color: "red.700",
                marginBottom: "4",
              })}
            >
              {error}
            </p>
            <div
              className={css({
                display: "flex",
                gap: "3",
                alignItems: "center",
              })}
            >
              <button
                onClick={() => window.location.reload()}
                className={css({
                  backgroundColor: "red.600",
                  color: "white",
                  paddingX: "4",
                  paddingY: "2",
                  borderRadius: "md",
                  fontSize: "sm",
                  fontWeight: "medium",
                  transition: "colors",
                  _hover: {
                    backgroundColor: "red.700",
                  },
                  _focus: {
                    outline: "2px solid",
                    outlineColor: "red.500",
                    outlineOffset: "2px",
                  },
                })}
              >
                Try Again
              </button>
              {meta.loadedAt && (
                <span
                  className={css({
                    fontSize: "xs",
                    color: "red.600",
                  })}
                >
                  Last attempted: {new Date(meta.loadedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Search and Sort Controls */}
        <div
          className={css({
            marginBottom: "8",
          })}
        >
          <div
            className={css({
              display: "flex",
              flexDirection: { base: "column", sm: "row" },
              gap: "4",
              alignItems: { base: "flex-start", sm: "center" },
              justifyContent: "space-between",
            })}
          >
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search articles..."
            />
            <SortControls
              sortBy={sortBy}
              onSortChange={handleSortChange}
              disabled={articles.length === 0 || !!error}
            />
          </div>
        </div>

        {/* Articles Content */}
        {articles.length === 0 && !error ? (
          <EmptyState
            title="No articles available"
            description="We couldn't load any articles at the moment. Please try again later."
          />
        ) : filteredAndSortedArticles.length === 0 && searchTerm ? (
          <EmptyState
            title="No articles found"
            description={`No articles match your search for "${searchTerm}". Try different keywords or clear your search.`}
            action={{
              label: "Clear search",
              onClick: handleClearSearch,
            }}
          />
        ) : (
          <ArticlesList
            articles={filteredAndSortedArticles}
            searchTerm={searchTerm}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className={css({
          backgroundColor: "white",
          borderTop: "1px solid",
          borderColor: "gray.200",
          marginTop: "16",
        })}
      >
        <div
          className={css({
            maxWidth: "7xl",
            marginX: "auto",
            paddingX: { base: "4", sm: "6", lg: "8" },
            paddingY: "8",
          })}
        >
          <div
            className={css({
              textAlign: "center",
              color: "gray.500",
              fontSize: "sm",
            })}
          >
            <p>
              Powered by{" "}
              <a
                href="https://api.spaceflightnewsapi.net/"
                target="_blank"
                rel="noopener noreferrer"
                className={css({
                  color: "blue.600",
                  _hover: {
                    color: "blue.800",
                  },
                })}
              >
                Spaceflight News API
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
