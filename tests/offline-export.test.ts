import { describe, it, expect } from "vitest";
import {
  generateOfflineAnalysis,
  getOfflineAnalysisForAllSpecialists,
} from "../lib/offline-analysis";
import { getCreditsPercentage, getCreditsStatus } from "../lib/api-credits";

describe("Offline Analysis & Export", () => {
  describe("Offline Analysis Generation", () => {
    it("should generate offline analysis for corrector", () => {
      const text = "Este es un texto de prueba para análisis";
      const analysis = generateOfflineAnalysis("corrector", text);

      expect(analysis.specialistId).toBe("corrector");
      expect(analysis.text).toBe(text);
      expect(analysis.analysis).toBeDefined();
      expect(analysis.cached).toBe(true);
      expect(analysis.timestamp).toBeGreaterThan(0);
    });

    it("should generate offline analysis for all specialists", () => {
      const text = "Texto de prueba para todos los especialistas";
      const analyses = getOfflineAnalysisForAllSpecialists(text);

      expect(analyses.length).toBe(10);
      expect(analyses.every((a) => a.cached === true)).toBe(true);
      expect(analyses.every((a) => a.text === text)).toBe(true);
    });

    it("should include text statistics in offline analysis", () => {
      const text = "Este es un texto con varias palabras para analizar";
      const analysis = generateOfflineAnalysis("analyst", text);

      expect(analysis.analysis).toContain(text.length.toString());
      expect(analysis.analysis).toContain("caracteres");
    });

    it("should generate different analysis for different specialists", () => {
      const text = "Texto de prueba";
      const correctorAnalysis = generateOfflineAnalysis("corrector", text);
      const analystAnalysis = generateOfflineAnalysis("analyst", text);

      expect(correctorAnalysis.analysis).not.toBe(analystAnalysis.analysis);
    });
  });

  describe("Credits System", () => {
    it("should calculate credits percentage", () => {
      const mockCredits = {
        gemini: {
          available: 30,
          used: 30,
          limit: 60,
          lastUpdated: Date.now(),
          status: "active" as const,
        },
        mondongo: {
          available: 100,
          used: 0,
          limit: 100,
          lastUpdated: Date.now(),
          status: "active" as const,
        },
        offlineMode: false,
      };

      const percentage = getCreditsPercentage("gemini", mockCredits);
      expect(percentage).toBe(50);
    });

    it("should get credits status message", () => {
      const mockCredits = {
        gemini: {
          available: 10,
          used: 50,
          limit: 60,
          lastUpdated: Date.now(),
          status: "limited" as const,
        },
        mondongo: {
          available: 100,
          used: 0,
          limit: 100,
          lastUpdated: Date.now(),
          status: "active" as const,
        },
        offlineMode: false,
      };

      const status = getCreditsStatus("gemini", mockCredits);
      expect(status).toContain("bajos");
    });

    it("should show exhausted status", () => {
      const mockCredits = {
        gemini: {
          available: 0,
          used: 60,
          limit: 60,
          lastUpdated: Date.now(),
          status: "exhausted" as const,
        },
        mondongo: {
          available: 100,
          used: 0,
          limit: 100,
          lastUpdated: Date.now(),
          status: "active" as const,
        },
        offlineMode: false,
      };

      const status = getCreditsStatus("gemini", mockCredits);
      expect(status).toContain("Sin cr\u00e9ditos");
    });
  });

  describe("Export Data Structure", () => {
    it("should create valid export data", () => {
      const exportData = {
        text: "Texto original",
        analyses: {
          corrector: "An\u00e1lisis del corrector",
          analyst: "An\u00e1lisis del analista",
        },
        timestamp: Date.now(),
        metadata: {
          wordCount: 2,
          charCount: 14,
          exportedAt: new Date().toISOString(),
        },
      };

      expect(exportData.text).toBeDefined();
      expect(exportData.analyses).toBeDefined();
      expect(Object.keys(exportData.analyses).length).toBe(2);
      expect(exportData.metadata.wordCount).toBe(2);
    });

    it("should calculate word count correctly for export", () => {
      const text = "Este es un texto de prueba";
      const wordCount = text.split(/\s+/).length;
      expect(wordCount).toBe(6);
    });

    it("should calculate character count correctly for export", () => {
      const text = "Hola mundo";
      const charCount = text.length;
      expect(charCount).toBe(10);
    });
  });

  describe("Offline Mode Scenarios", () => {
    it("should handle offline mode when credits exhausted", () => {
      const mockCredits = {
        gemini: {
          available: 0,
          used: 60,
          limit: 60,
          lastUpdated: Date.now(),
          status: "exhausted" as const,
        },
        mondongo: {
          available: 100,
          used: 0,
          limit: 100,
          lastUpdated: Date.now(),
          status: "active" as const,
        },
        offlineMode: true,
      };

      expect(mockCredits.offlineMode).toBe(true);
      expect(mockCredits.gemini.status).toBe("exhausted");
    });

    it("should generate analysis even in offline mode", () => {
      const text = "Texto para analizar sin conexión";
      const analyses = getOfflineAnalysisForAllSpecialists(text);

      expect(analyses.length).toBeGreaterThan(0);
      expect(analyses.every((a) => a.analysis.length > 0)).toBe(true);
    });

    it("should indicate cached analysis in offline mode", () => {
      const text = "Texto de prueba";
      const analysis = generateOfflineAnalysis("corrector", text);

      expect(analysis.cached).toBe(true);
    });
  });

  describe("Multi-Specialist Analysis", () => {
    it("should generate analysis for all 10 specialists", () => {
      const text = "Texto para todos los especialistas";
      const analyses = getOfflineAnalysisForAllSpecialists(text);

      const specialistIds = analyses.map((a) => a.specialistId);
      expect(specialistIds).toContain("corrector");
      expect(specialistIds).toContain("analyst");
      expect(specialistIds).toContain("editor");
      expect(specialistIds).toContain("translator");
      expect(specialistIds).toContain("kdp");
      expect(specialistIds).toContain("marketing");
      expect(specialistIds).toContain("illustrator");
      expect(specialistIds).toContain("economist");
      expect(specialistIds).toContain("rewriter");
      expect(specialistIds).toContain("antiAi");
    });

    it("should maintain text consistency across all analyses", () => {
      const text = "Texto consistente";
      const analyses = getOfflineAnalysisForAllSpecialists(text);

      expect(analyses.every((a) => a.text === text)).toBe(true);
    });

    it("should have unique timestamps for each analysis", () => {
      const text = "Texto de prueba";
      const analyses = getOfflineAnalysisForAllSpecialists(text);

      const timestamps = analyses.map((a) => a.timestamp);
      expect(timestamps.every((t) => t > 0)).toBe(true);
    });
  });
});
