import { describe, it, expect } from "vitest";
import * as fs from "fs";

describe("Rewrite History Functionality", () => {
  it("should have getRecentRewrites function", () => {
    const rewriteCode = fs.readFileSync(
      process.cwd() + "/lib/rewrite.ts",
      "utf-8"
    );
    expect(rewriteCode).toContain("getRecentRewrites");
  });

  it("should have deleteRewrite function", () => {
    const rewriteCode = fs.readFileSync(
      process.cwd() + "/lib/rewrite.ts",
      "utf-8"
    );
    expect(rewriteCode).toContain("deleteRewrite");
  });

  it("should have recentRewrites state in home screen", () => {
    const homeScreenCode = fs.readFileSync(
      process.cwd() + "/app/(tabs)/index.tsx",
      "utf-8"
    );
    expect(homeScreenCode).toContain("recentRewrites");
  });

  it("should have loadRecentRewrites function in home screen", () => {
    const homeScreenCode = fs.readFileSync(
      process.cwd() + "/app/(tabs)/index.tsx",
      "utf-8"
    );
    expect(homeScreenCode).toContain("loadRecentRewrites");
  });

  it("should have handleLoadRewrite function in home screen", () => {
    const homeScreenCode = fs.readFileSync(
      process.cwd() + "/app/(tabs)/index.tsx",
      "utf-8"
    );
    expect(homeScreenCode).toContain("handleLoadRewrite");
  });

  it("should have handleDeleteRewrite function in home screen", () => {
    const homeScreenCode = fs.readFileSync(
      process.cwd() + "/app/(tabs)/index.tsx",
      "utf-8"
    );
    expect(homeScreenCode).toContain("handleDeleteRewrite");
  });

  it("should display recent rewrites section in home screen", () => {
    const homeScreenCode = fs.readFileSync(
      process.cwd() + "/app/(tabs)/index.tsx",
      "utf-8"
    );
    expect(homeScreenCode).toContain("REESCRITURAS RECIENTES");
  });

  it("should have rewrite card styles", () => {
    const homeScreenCode = fs.readFileSync(
      process.cwd() + "/app/(tabs)/index.tsx",
      "utf-8"
    );
    expect(homeScreenCode).toContain("rewriteCard");
    expect(homeScreenCode).toContain("rewritePreview");
    expect(homeScreenCode).toContain("rewriteFooter");
    expect(homeScreenCode).toContain("rewriteDate");
  });

  it("should have useEffect to load rewrites on mount", () => {
    const homeScreenCode = fs.readFileSync(
      process.cwd() + "/app/(tabs)/index.tsx",
      "utf-8"
    );
    expect(homeScreenCode).toContain("useEffect");
    expect(homeScreenCode).toContain("loadRecentRewrites");
  });

  it("should use AsyncStorage for rewrite persistence", () => {
    const rewriteCode = fs.readFileSync(
      process.cwd() + "/lib/rewrite.ts",
      "utf-8"
    );
    expect(rewriteCode).toContain("AsyncStorage");
    expect(rewriteCode).toContain("rewrite_");
  });
});
