import { describe, it, expect } from "vitest";

describe("GEMINI_API_KEY Configuration", () => {
  it("should have GEMINI_API_KEY environment variable set", () => {
    const apiKey = process.env.GEMINI_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toBeTruthy();
    expect(apiKey?.length).toBeGreaterThan(0);
  });

  it("should have valid Google Gemini API key format", () => {
    const apiKey = process.env.GEMINI_API_KEY;
    expect(apiKey).toMatch(/^AIza[a-zA-Z0-9\-_]{35}$/);
  });

  it("should be valid for authentication", () => {
    const apiKey = process.env.GEMINI_API_KEY;
    const isValid = apiKey && apiKey.startsWith("AIza") && apiKey.length === 39;
    expect(isValid).toBe(true);
  });
});
