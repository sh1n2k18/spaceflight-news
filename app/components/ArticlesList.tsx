import { css } from "styled-system/css";
import type { SpaceflightArticle } from "~/types";
import { ArticleCard } from "./ArticleCard";

interface ArticlesListProps {
  articles: SpaceflightArticle[];
  searchTerm?: string;
  className?: string;
}

export function ArticlesList({
  articles,
  searchTerm,
  className,
}: ArticlesListProps) {

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Search Results Info */}
      {searchTerm && (
        <div
          className={css({
            marginBottom: "6",
            paddingX: "1",
          })}
        >
          <p
            className={css({
              fontSize: "sm",
              color: "gray.600",
            })}
          >
            Found {articles.length} article
            {articles.length !== 1 ? "s" : ""}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}

      {/* Articles Grid */}
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: {
            base: "1fr",
            sm: "repeat(auto-fit, minmax(300px, 1fr))",
            md: "repeat(auto-fit, minmax(350px, 1fr))",
            lg: "repeat(auto-fit, minmax(380px, 1fr))",
            xl: "repeat(auto-fit, minmax(400px, 1fr))",
          },
          gap: {
            base: "4",
            sm: "5",
            md: "6",
            lg: "7",
            xl: "8",
          },
          padding: {
            base: "2",
            sm: "3",
            md: "4",
            lg: "5",
          },
          width: "100%",
          "& > *": {
            maxWidth: "500px",
            justifySelf: "center",
          },
        })}
        role="region"
        aria-label="Articles list"
      >
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            className={css({
              animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
            })}
          />
        ))}
      </div>
    </div>
  );
}
