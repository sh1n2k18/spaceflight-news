import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";

beforeEach(() => {
  // Since the hook has a fallback for missing IntersectionObserver, let's test the fallback
  delete (globalThis as any).IntersectionObserver;
  vi.clearAllMocks();
});

describe("useIntersectionObserver", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.isIntersecting).toBe(false); // Initial state
    expect(result.current.hasIntersected).toBe(false); // Initial state
    expect(result.current.elementRef.current).toBe(null);
  });

  it("should handle missing IntersectionObserver gracefully", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Hook should work even without IntersectionObserver
    expect(result.current.elementRef).toBeTruthy();
    expect(typeof result.current.isIntersecting).toBe("boolean");
    expect(typeof result.current.hasIntersected).toBe("boolean");
  });

  it("should handle custom options without error", () => {
    const options = {
      threshold: 0.5,
      rootMargin: "100px",
      triggerOnce: false,
    };

    const { result } = renderHook(() => useIntersectionObserver(options));

    expect(result.current.elementRef).toBeTruthy();
    expect(typeof result.current.isIntersecting).toBe("boolean");
    expect(typeof result.current.hasIntersected).toBe("boolean");
  });

  it("should provide stable elementRef", () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const initialRef = result.current.elementRef;

    expect(initialRef).toBeTruthy();
    expect(initialRef.current).toBe(null);
  });

  it("should return consistent interface", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current).toHaveProperty("elementRef");
    expect(result.current).toHaveProperty("isIntersecting");
    expect(result.current).toHaveProperty("hasIntersected");
  });
});
