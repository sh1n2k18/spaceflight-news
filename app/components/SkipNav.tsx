import { css } from "styled-system/css";

export default function SkipNav() {
  return (
    <a
      href="#main-content"
      className={css({
        position: "absolute",
        top: "-40px",
        left: "6px",
        backgroundColor: "blue.600",
        color: "white",
        padding: "8px",
        borderRadius: "md",
        textDecoration: "none",
        zIndex: "1000",
        fontSize: "sm",
        fontWeight: "medium",
        transition: "top 0.2s",
        _focus: {
          top: "6px",
          outline: "2px solid white",
          outlineOffset: "2px",
        },
      })}
    >
      Skip to main content
    </a>
  );
}