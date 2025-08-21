import { css } from "styled-system/css";
import type { SortBy } from "~/types";

interface SortControlsProps {
  sortBy: SortBy;
  onSortChange: (sortBy: SortBy) => void;
  disabled?: boolean;
  className?: string;
}

export function SortControls({
  sortBy,
  onSortChange,
  disabled = false,
  className,
}: SortControlsProps) {
  const handleSortChange = (newSortBy: SortBy) => {
    if (!disabled && newSortBy !== sortBy) {
      onSortChange(newSortBy);
    }
  };

  const buttonBaseStyles = css({
    paddingX: "4",
    paddingY: "2",
    fontSize: "sm",
    fontWeight: "medium",
    border: "1px solid",
    borderRadius: "md",
    transition: "all 0.2s",
    cursor: "pointer",
    _focus: {
      outline: "none",
      ring: "2",
      ringOffset: "2",
      ringColor: "blue.500",
    },
    _disabled: {
      opacity: "0.6",
      cursor: "not-allowed",
    },
  });

  const activeButtonStyles = css({
    color: "white",
    backgroundColor: "blue.600",
    borderColor: "blue.600",
    _hover: {
      backgroundColor: "blue.700",
      borderColor: "blue.700",
    },
  });

  const inactiveButtonStyles = css({
    color: "gray.700",
    backgroundColor: "white",
    borderColor: "gray.300",
    _hover: {
      backgroundColor: "gray.50",
    },
  });

  return (
    <div
      className={`${css({
        display: "flex",
        gap: "2",
        alignItems: "center",
      })} ${className || ""}`}
      role="group"
      aria-label="Sort articles"
    >
      <span
        className={css({
          fontSize: "sm",
          fontWeight: "medium",
          color: "gray.700",
          marginRight: "2",
          display: { base: "none", sm: "inline" },
        })}
      >
        Sort by:
      </span>

      <button
        type="button"
        onClick={() => handleSortChange("date")}
        disabled={disabled}
        className={`${buttonBaseStyles} ${
          sortBy === "date" ? activeButtonStyles : inactiveButtonStyles
        }`}
        aria-pressed={sortBy === "date"}
        aria-label="Sort articles by publication date (newest first)"
      >
        <span className={css({ display: { base: "none", sm: "inline" } })}>
          Date
        </span>
        <span className={css({ display: { base: "inline", sm: "none" } })}>
          📅
        </span>
      </button>

      <button
        type="button"
        onClick={() => handleSortChange("title")}
        disabled={disabled}
        className={`${buttonBaseStyles} ${
          sortBy === "title" ? activeButtonStyles : inactiveButtonStyles
        }`}
        aria-pressed={sortBy === "title"}
        aria-label="Sort articles alphabetically by title"
      >
        <span className={css({ display: { base: "none", sm: "inline" } })}>
          A-Z
        </span>
        <span className={css({ display: { base: "inline", sm: "none" } })}>
          🔤
        </span>
      </button>
    </div>
  );
}
