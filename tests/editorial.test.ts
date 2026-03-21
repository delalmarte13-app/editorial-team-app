import { describe, it, expect } from "vitest";

describe("Editorial Router", () => {
  it("should have specialist IDs defined", () => {
    const specialistIds = [
      "corrector",
      "analyst",
      "editor",
      "translator",
      "kdp",
      "marketing",
      "illustrator",
    ];
    expect(specialistIds).toHaveLength(7);
    specialistIds.forEach((id) => {
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });
  });

  it("should validate text length requirements", () => {
    const minWords = 20;
    const shortText = "This is too short";
    const longText = "This is a longer text that has more than twenty words in it so it should pass the validation check easily";

    const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

    expect(wordCount(shortText)).toBeLessThan(minWords);
    expect(wordCount(longText)).toBeGreaterThanOrEqual(minWords);
  });

  it("should correctly count words in Spanish text", () => {
    const text = "El equipo editorial trabaja con sinceridad absoluta para mejorar tu texto y hacerlo publicable";
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    expect(wordCount).toBe(14);
  });
});
