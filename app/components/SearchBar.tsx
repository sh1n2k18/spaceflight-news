import React, { useState, useRef } from "react";
import { css } from "styled-system/css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search articles...",
  disabled = false,
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop value changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    onChange(newValue); // Call onChange immediately for real-time search
  };

  const handleSubmit = () => {
    onChange(localValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    } else if (event.key === "Escape") {
      handleClear();
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className={`${css({
        position: "relative",
        width: "100%",
        maxWidth: "md",
        display: "flex",
        gap: "2",
      })} ${className || ""}`}
    >
      <div className={css({ position: "relative", flex: "1" })}>
        {/* Search Icon */}
        <div
          className={css({
            position: "absolute",
            inset: "0",
            left: "0",
            paddingLeft: "3",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 1,
          })}
        >
          <svg
            className={css({
              height: "5",
              width: "5",
              color: disabled ? "gray.300" : "gray.400",
              transition: "color 0.2s",
            })}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={css({
            display: "block",
            width: "full",
            paddingLeft: "10",
            paddingRight: localValue ? "10" : "3",
            paddingY: "2",
            border: "1px solid",
            borderColor: disabled ? "gray.200" : "gray.300",
            borderRadius: "md",
            lineHeight: "1",
            backgroundColor: disabled ? "gray.50" : "white",
            fontSize: "sm",
            transition: "all 0.2s",
            _placeholder: {
              color: disabled ? "gray.300" : "gray.500",
            },
            _focus: {
              outline: "none",
              _placeholder: {
                color: "gray.400",
              },
              ring: "2",
              ringColor: "blue.500",
              borderColor: "blue.500",
            },
            _disabled: {
              opacity: "0.6",
              cursor: "not-allowed",
            },
          })}
          aria-label="Search articles by title"
          aria-describedby="search-help"
        />

        {/* Clear Button */}
        {localValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={css({
              position: "absolute",
              right: "0",
              top: "0",
              bottom: "0",
              paddingX: "3",
              display: "flex",
              alignItems: "center",
              color: "gray.400",
              _hover: {
                color: "gray.600",
              },
              _focus: {
                outline: "none",
                color: "gray.600",
                ring: "2",
                ringColor: "blue.500",
                borderRadius: "sm",
              },
            })}
            aria-label="Clear search"
          >
            <svg
              className={css({
                height: "4",
                width: "4",
              })}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Screen reader help text */}
        <div id="search-help" className={css({ srOnly: true })}>
          Search articles by title. Press Enter to search, Escape to clear.
        </div>
      </div>

      {/* Search Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled}
        className={css({
          paddingX: "4",
          paddingY: "2",
          backgroundColor: disabled ? "gray.300" : "blue.600",
          color: "white",
          borderRadius: "md",
          fontSize: "sm",
          fontWeight: "medium",
          transition: "all 0.2s",
          flexShrink: 0,
          _hover: {
            backgroundColor: disabled ? "gray.300" : "blue.700",
          },
          _focus: {
            outline: "none",
            ring: "2",
            ringColor: "blue.500",
            ringOffset: "2",
          },
          _disabled: {
            opacity: "0.6",
            cursor: "not-allowed",
          },
        })}
        aria-label="Search articles"
      >
        Search
      </button>
    </div>
  );
}
