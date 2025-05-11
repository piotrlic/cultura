import { afterEach, expect, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// No need to extend matchers manually as the import should register them

// Reset all mocks after each test
afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

// Mock global fetch if needed
const originalFetch = global.fetch;
global.fetch = vi.fn();

// Restore fetch after all tests
afterEach(() => {
  global.fetch = originalFetch;
});

// Silence console errors during tests
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (args[0]?.includes?.("Warning:") || args[0]?.includes?.("React does not recognize the")) {
    return;
  }
  originalConsoleError(...args);
};

// No need to add vi to global explicitly since Vitest adds it when globals:true is set
