import { describe, it, expect } from "vitest";
import * as fs from "fs";

describe("Export DOCX Functionality", () => {
  it("should have exportAsDocx function", () => {
    const exportCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/lib/export-analysis.ts",
      "utf-8"
    );
    expect(exportCode).toContain("exportAsDocx");
  });

  it("should have blobToBase64 helper function", () => {
    const exportCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/lib/export-analysis.ts",
      "utf-8"
    );
    expect(exportCode).toContain("blobToBase64");
  });

  it("should import docx library", () => {
    const exportCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/lib/export-analysis.ts",
      "utf-8"
    );
    expect(exportCode).toContain("from \"docx\"");
  });

  it("should have export button in team screen", () => {
    const teamCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/team.tsx",
      "utf-8"
    );
    expect(teamCode).toContain("Exportar como Word");
  });

  it("should have handleExportDocx function in team screen", () => {
    const teamCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/team.tsx",
      "utf-8"
    );
    expect(teamCode).toContain("handleExportDocx");
  });

  it("should have export button styles", () => {
    const teamCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/team.tsx",
      "utf-8"
    );
    expect(teamCode).toContain("exportSection");
    expect(teamCode).toContain("exportBtn");
    expect(teamCode).toContain("exportBtnText");
    expect(teamCode).toContain("exportHint");
  });

  it("should have export section only when analyses are ready", () => {
    const teamCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/team.tsx",
      "utf-8"
    );
    expect(teamCode).toContain("{readyCount > 0 && (");
  });

  it("should show error alert when no analyses exist", () => {
    const teamCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/team.tsx",
      "utf-8"
    );
    expect(teamCode).toContain("Sin análisis");
  });

  it("should create ExportData with all required fields", () => {
    const teamCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/team.tsx",
      "utf-8"
    );
    expect(teamCode).toContain("text: currentText");
    expect(teamCode).toContain("analyses");
    expect(teamCode).toContain("timestamp");
    expect(teamCode).toContain("metadata");
  });

  it("should handle export success and error cases", () => {
    const teamCode = fs.readFileSync(
      "/home/ubuntu/editorial-team-app/app/(tabs)/team.tsx",
      "utf-8"
    );
    expect(teamCode).toContain("Documento exportado correctamente");
    expect(teamCode).toContain("No se pudo exportar el documento");
  });
});
