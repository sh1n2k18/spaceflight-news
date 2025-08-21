import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { css } from "styled-system/css";
import { useEffect } from "react";

interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export function ErrorBoundary({ fallback: Fallback }: ErrorBoundaryProps = {}) {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    // Log error to console for debugging
    console.error("Route error:", error);
  }, [error]);

  const handleRetry = () => {
    // Refresh the current route
    navigate(".", { replace: true });
  };

  if (Fallback && error instanceof Error) {
    return <Fallback error={error} retry={handleRetry} />;
  }

  if (isRouteErrorResponse(error)) {
    return (
      <div
        className={css({
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8",
        })}
      >
        <div
          className={css({
            maxWidth: "md",
            width: "full",
            backgroundColor: "white",
            boxShadow: "lg",
            borderRadius: "lg",
            padding: "8",
            textAlign: "center",
            border: "1px solid",
            borderColor: "red.200",
          })}
        >
          <div
            className={css({
              width: "16",
              height: "16",
              backgroundColor: "red.100",
              borderRadius: "full",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginX: "auto",
              marginBottom: "4",
            })}
          >
            <svg
              className={css({
                width: "8",
                height: "8",
                color: "red.600",
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
          </div>

          <h1
            className={css({
              fontSize: "2xl",
              fontWeight: "bold",
              color: "gray.900",
              marginBottom: "2",
            })}
          >
            {error.status} {error.statusText}
          </h1>

          <p
            className={css({
              color: "gray.600",
              marginBottom: "6",
              fontSize: "lg",
            })}
          >
            {error.status === 404
              ? "The page you're looking for doesn't exist."
              : error.status === 500
              ? "We're experiencing technical difficulties. Please try again later."
              : "Something went wrong while loading this page."}
          </p>

          <div
            className={css({
              display: "flex",
              gap: "3",
              justifyContent: "center",
              flexWrap: "wrap",
            })}
          >
            <button
              onClick={handleRetry}
              className={css({
                backgroundColor: "blue.600",
                color: "white",
                paddingX: "6",
                paddingY: "2",
                borderRadius: "md",
                fontWeight: "medium",
                transition: "colors",
                _hover: {
                  backgroundColor: "blue.700",
                },
                _focus: {
                  outline: "2px solid",
                  outlineColor: "blue.500",
                  outlineOffset: "2px",
                },
              })}
            >
              Try Again
            </button>

            <a
              href="/"
              className={css({
                backgroundColor: "gray.100",
                color: "gray.700",
                paddingX: "6",
                paddingY: "2",
                borderRadius: "md",
                fontWeight: "medium",
                transition: "colors",
                textDecoration: "none",
                _hover: {
                  backgroundColor: "gray.200",
                },
                _focus: {
                  outline: "2px solid",
                  outlineColor: "gray.500",
                  outlineOffset: "2px",
                },
              })}
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Generic error fallback
  return (
    <div
      className={css({
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8",
      })}
    >
      <div
        className={css({
          maxWidth: "md",
          width: "full",
          backgroundColor: "white",
          boxShadow: "lg",
          borderRadius: "lg",
          padding: "8",
          textAlign: "center",
          border: "1px solid",
          borderColor: "red.200",
        })}
      >
        <div
          className={css({
            width: "16",
            height: "16",
            backgroundColor: "red.100",
            borderRadius: "full",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginX: "auto",
            marginBottom: "4",
          })}
        >
          <svg
            className={css({
              width: "8",
              height: "8",
              color: "red.600",
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
        </div>

        <h1
          className={css({
            fontSize: "2xl",
            fontWeight: "bold",
            color: "gray.900",
            marginBottom: "2",
          })}
        >
          Oops! Something went wrong
        </h1>

        <p
          className={css({
            color: "gray.600",
            marginBottom: "6",
            fontSize: "lg",
          })}
        >
          We encountered an unexpected error while loading the spaceflight news.
          Please try refreshing the page.
        </p>

        <div
          className={css({
            display: "flex",
            gap: "3",
            justifyContent: "center",
            flexWrap: "wrap",
          })}
        >
          <button
            onClick={handleRetry}
            className={css({
              backgroundColor: "blue.600",
              color: "white",
              paddingX: "6",
              paddingY: "2",
              borderRadius: "md",
              fontWeight: "medium",
              transition: "colors",
              _hover: {
                backgroundColor: "blue.700",
              },
              _focus: {
                outline: "2px solid",
                outlineColor: "blue.500",
                outlineOffset: "2px",
              },
            })}
          >
            Try Again
          </button>

          <a
            href="/"
            className={css({
              backgroundColor: "gray.100",
              color: "gray.700",
              paddingX: "6",
              paddingY: "2",
              borderRadius: "md",
              fontWeight: "medium",
              transition: "colors",
              textDecoration: "none",
              _hover: {
                backgroundColor: "gray.200",
              },
              _focus: {
                outline: "2px solid",
                outlineColor: "gray.500",
                outlineOffset: "2px",
              },
            })}
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Specific error component for API failures
 */
export function ApiErrorFallback({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <div
      className={css({
        backgroundColor: "red.50",
        border: "1px solid",
        borderColor: "red.200",
        borderRadius: "lg",
        padding: "6",
        marginY: "8",
      })}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          marginBottom: "4",
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
        {error.message ||
          "We couldn't load the latest spaceflight news. This might be due to a network issue or temporary service unavailability."}
      </p>

      <button
        onClick={retry}
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
    </div>
  );
}
