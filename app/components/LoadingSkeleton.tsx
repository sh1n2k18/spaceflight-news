import { css } from "styled-system/css";

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 6 }: LoadingSkeletonProps) {
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateColumns: {
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        },
        gap: "6",
      })}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={css({
            backgroundColor: "white",
            borderRadius: "lg",
            boxShadow: "sm",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "gray.200",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          })}
        >
          {/* Image skeleton */}
          <div
            className={css({
              width: "full",
              height: "48",
              backgroundColor: "gray.200",
            })}
          />

          {/* Content skeleton */}
          <div
            className={css({
              padding: "6",
            })}
          >
            {/* Title skeleton */}
            <div
              className={css({
                height: "6",
                backgroundColor: "gray.200",
                borderRadius: "md",
                marginBottom: "3",
              })}
            />
            <div
              className={css({
                height: "4",
                backgroundColor: "gray.200",
                borderRadius: "md",
                width: "3/4",
                marginBottom: "4",
              })}
            />

            {/* Summary skeleton */}
            <div
              className={css({
                spaceY: "2",
                marginBottom: "4",
              })}
            >
              <div
                className={css({
                  height: "4",
                  backgroundColor: "gray.200",
                  borderRadius: "md",
                  marginBottom: "2",
                })}
              />
              <div
                className={css({
                  height: "4",
                  backgroundColor: "gray.200",
                  borderRadius: "md",
                  width: "5/6",
                  marginBottom: "2",
                })}
              />
              <div
                className={css({
                  height: "4",
                  backgroundColor: "gray.200",
                  borderRadius: "md",
                  width: "2/3",
                })}
              />
            </div>

            {/* Metadata skeleton */}
            <div
              className={css({
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              })}
            >
              <div
                className={css({
                  height: "4",
                  width: "20",
                  backgroundColor: "gray.200",
                  borderRadius: "md",
                })}
              />
              <div
                className={css({
                  height: "4",
                  width: "16",
                  backgroundColor: "gray.200",
                  borderRadius: "md",
                })}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for search bar
 */
export function SearchBarSkeleton() {
  return (
    <div
      className={css({
        width: "full",
        maxWidth: "md",
        height: "10",
        backgroundColor: "gray.200",
        borderRadius: "md",
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      })}
    />
  );
}

/**
 * Loading skeleton for sort controls
 */
export function SortControlsSkeleton() {
  return (
    <div
      className={css({
        display: "flex",
        gap: "2",
      })}
    >
      <div
        className={css({
          width: "20",
          height: "10",
          backgroundColor: "gray.200",
          borderRadius: "md",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        })}
      />
      <div
        className={css({
          width: "24",
          height: "10",
          backgroundColor: "gray.200",
          borderRadius: "md",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        })}
      />
    </div>
  );
}
