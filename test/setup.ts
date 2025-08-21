import "@testing-library/jest-dom";
import { vi, beforeEach, afterEach } from "vitest";

// Mock fetch globally for tests
globalThis.fetch = vi.fn();

// Suppress console.error in tests to reduce noise
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
  vi.resetAllMocks();
});

// Restore console.error after tests
afterEach(() => {
  console.error = originalConsoleError;
});
