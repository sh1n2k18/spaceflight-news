import { css } from "styled-system/css";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`${css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingY: { base: "12", md: "16" },
        paddingX: "4",
      })} ${className || ""}`}
    >
      {/* Icon */}
      <div
        className={css({
          marginBottom: "4",
        })}
      >
        <svg
          className={css({
            height: { base: "12", md: "16" },
            width: { base: "12", md: "16" },
            color: "gray.400",
          })}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3
        className={css({
          fontSize: { base: "lg", md: "xl" },
          fontWeight: "semibold",
          color: "gray.900",
          marginBottom: "2",
        })}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={css({
          fontSize: { base: "sm", md: "base" },
          color: "gray.500",
          maxWidth: "md",
          lineHeight: "relaxed",
          marginBottom: action ? "6" : "0",
        })}
      >
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={css({
            paddingX: "4",
            paddingY: "2",
            fontSize: "sm",
            fontWeight: "medium",
            color: "blue.600",
            backgroundColor: "white",
            border: "1px solid",
            borderColor: "blue.600",
            borderRadius: "md",
            transition: "all 0.2s",
            _hover: {
              backgroundColor: "blue.50",
              borderColor: "blue.700",
              color: "blue.700",
            },
            _focus: {
              outline: "none",
              ring: "2",
              ringOffset: "2",
              ringColor: "blue.500",
            },
          })}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
