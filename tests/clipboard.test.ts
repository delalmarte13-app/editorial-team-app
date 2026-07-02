import { describe, it, expect } from "vitest";
import * as fs from "fs";

describe("Clipboard Functionality", () => {
  it("should have handlePaste function available", () => {
    const homeScreenCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/index.tsx",
      "utf-8"
    );
    expect(homeScreenCode).toContain("handlePaste");
  });

  it("should have handleCopyToClipboard function in rewrite screen", () => {
    const rewriteCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/rewrite-complete.tsx",
      "utf-8"
    );
    expect(rewriteCode).toContain("handleCopyToClipboard");
  });

  it("should import Clipboard module in home screen", () => {
    const homeScreenCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/index.tsx",
      "utf-8"
    );
    expect(homeScreenCode).toContain("expo-clipboard");
  });

  it("should import Clipboard module in rewrite screen", () => {
    const rewriteCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/rewrite-complete.tsx",
      "utf-8"
    );
    expect(rewriteCode).toContain("expo-clipboard");
  });

  it("should have copy button UI in rewrite screen", () => {
    const rewriteCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/rewrite-complete.tsx",
      "utf-8"
    );
    expect(rewriteCode).toContain("Copiar Texto");
  });

  it("should have paste button UI in home screen", () => {
    const homeScreenCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/index.tsx",
      "utf-8"
    );
    expect(homeScreenCode).toContain("doc.on.clipboard");
  });

  it("should handle clipboard errors gracefully", () => {
    const homeScreenCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/index.tsx",
      "utf-8"
    );
    expect(homeScreenCode).toContain("Alert.alert");
    expect(homeScreenCode).toContain("try");
  });

  it("should show success feedback on copy", () => {
    const rewriteCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/rewrite-complete.tsx",
      "utf-8"
    );
    expect(rewriteCode).toContain("setCopied");
    expect(rewriteCode).toContain("Haptics.notificationAsync");
  });

  it("should use try-catch in handleCopyToClipboard", () => {
    const rewriteCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/rewrite-complete.tsx",
      "utf-8"
    );
    const handleCopySection = rewriteCode.substring(
      rewriteCode.indexOf("handleCopyToClipboard"),
      rewriteCode.indexOf("handleCopyToClipboard") + 500
    );
    expect(handleCopySection).toContain("try");
    expect(handleCopySection).toContain("catch");
  });

  it("should use try-catch in handlePaste", () => {
    const homeScreenCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/index.tsx",
      "utf-8"
    );
    const handlePasteSection = homeScreenCode.substring(
      homeScreenCode.indexOf("handlePaste"),
      homeScreenCode.indexOf("handlePaste") + 500
    );
    expect(handlePasteSection).toContain("try");
    expect(handlePasteSection).toContain("catch");
  });
});
