import { css } from "styled-system/css";
import type { SpaceflightArticle } from "~/types";
import { formatDate, getImageUrlWithFallback } from "~/utils";
import { useIntersectionObserver } from "~/hooks";

interface ArticleCardProps {
  article: SpaceflightArticle;
  className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  // Use intersection observer for performance optimization
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px", // Load images 100px before they come into view
    triggerOnce: true,
  });

  const handleImageClick = () => {
    window.open(article.url, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleImageClick();
    }
  };

  return (
    <article
      ref={elementRef}
      className={css(
        {
          // Mobile-first responsive design
          display: "flex",
          flexDirection: "column",
          border: "1px solid",
          borderColor: "gray.200",
          borderRadius: { base: "md", md: "lg" },
          overflow: "hidden",
          bg: "white",
          shadow: "sm",
          transition: "all 0.2s ease-in-out",
          height: "100%",
          // Mobile: full width with margin
          width: "100%",
          maxWidth: { base: "100%", sm: "400px", md: "100%" },
          mx: { base: "auto", md: "0" },
          // Animation based on intersection
          opacity: hasIntersected ? 1 : 0,
          transform: hasIntersected ? "translateY(0)" : "translateY(20px)",
          _hover: {
            shadow: "md",
            transform: hasIntersected ? "translateY(-2px)" : "translateY(20px)",
            borderColor: "gray.300",
          },
          _focus: {
            outline: "2px solid",
            outlineColor: "blue.500",
            outlineOffset: "2px",
          },
        },
        className || "",
      )}
    >
      {/* Image Container */}
      <div
        className={css({
          position: "relative",
          // Mobile-first aspect ratios
          aspectRatio: { base: "16/9", sm: "4/3", md: "16/9" },
          overflow: "hidden",
          flexShrink: 0,
        })}
      >
        {/* Lazy load images only when in view */}
        {hasIntersected ? (
          <img
            src={getImageUrlWithFallback(article.image_url)}
            alt={`${article.title} - Click to read full article`}
            className={css({
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
              _hover: {
                transform: "scale(1.05)",
              },
            })}
            onClick={handleImageClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Read full article: ${article.title}`}
            loading="lazy"
          />
        ) : (
          // Placeholder while image loads
          <div
            className={css({
              width: "100%",
              height: "100%",
              backgroundColor: "gray.200",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            })}
            onClick={handleImageClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Read full article: ${article.title}`}
          >
            <div
              className={css({
                width: "12",
                height: "12",
                backgroundColor: "gray.300",
                borderRadius: "md",
                animation: "pulse 2s infinite",
              })}
            />
          </div>
        )}

        {/* Overlay for better accessibility */}
        <div
          className={css({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: "rgba(0, 0, 0, 0)",
            transition: "background-color 0.2s",
            cursor: "pointer",
            _hover: {
              bg: "rgba(0, 0, 0, 0.1)",
            },
          })}
          onClick={handleImageClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {/* Content Container */}
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          flex: 1,
          p: { base: 3, sm: 4, md: 5 },
          gap: { base: 2, md: 3 },
        })}
      >
        {/* Title */}
        <h3
          className={css({
            fontSize: { base: "md", sm: "lg", md: "xl" },
            fontWeight: "semibold",
            lineHeight: "tight",
            color: "gray.900",
            // Ensure title doesn't get too long on mobile
            display: "-webkit-box",
            WebkitLineClamp: { base: 3, md: 2 },
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          })}
          title={article.title}
        >
          {article.title}
        </h3>

        {/* Summary */}
        <p
          className={css({
            color: "gray.600",
            fontSize: { base: "sm", md: "base" },
            lineHeight: "relaxed",
            flex: 1,
            // Responsive text truncation
            display: "-webkit-box",
            WebkitLineClamp: { base: 3, sm: 4, md: 3 },
            overflow: "hidden",
            textOverflow: "ellipsis",
          })}
          title={article.summary}
        >
          {article.summary}
        </p>

        {/* Metadata */}
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: { base: "flex-start", sm: "center" },
            flexDirection: { base: "column", sm: "row" },
            gap: { base: 1, sm: 2 },
            fontSize: { base: "xs", md: "sm" },
            color: "gray.500",
            mt: "auto",
            pt: 2,
            borderTop: "1px solid",
            borderColor: "gray.100",
          })}
        >
          <span
            className={css({
              fontWeight: "medium",
              color: "gray.600",
              fontSize: { base: "xs", md: "sm" },
            })}
            title={`Source: ${article.news_site}`}
          >
            {article.news_site}
          </span>
          <time
            className={css({
              fontSize: { base: "xs", md: "sm" },
              color: "gray.500",
            })}
            dateTime={article.published_at}
            title={`Published: ${formatDate(article.published_at)}`}
          >
            {formatDate(article.published_at)}
          </time>
        </div>
      </div>
    </article>
  );
}
