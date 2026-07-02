import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RewriteResult {
  originalText: string;
  rewrittenText: string;
  summary: string;
  changes: {
    corrected: number;
    improved: number;
    restructured: number;
  };
  timestamp: number;
}

export function buildRewritePrompt(originalText: string, contributions: string[]): string {
  return `Reescribe el siguiente texto integrando TODAS estas aportaciones:

TEXTO ORIGINAL:
${originalText}

APORTACIONES:
${contributions.join("\n")}

Entrega solo el texto reescrito, sin explicaciones.`;
}

export function extractContributions(analyses: { [key: string]: any }): string[] {
  const contributions: string[] = [];
  for (const [key, value] of Object.entries(analyses)) {
    if (typeof value === "string" && value.length > 10) {
      contributions.push(value.substring(0, 200));
    }
  }
  return contributions;
}

export async function saveRewriteResult(result: RewriteResult): Promise<void> {
  try {
    const key = `rewrite_${result.timestamp}`;
    await AsyncStorage.setItem(key, JSON.stringify(result));
  } catch (error) {
    console.error("Error saving rewrite result:", error);
  }
}

export async function getRecentRewrites(limit: number = 5): Promise<RewriteResult[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const rewriteKeys = keys.filter((k) => k.startsWith("rewrite_")).sort().reverse();
    const results: RewriteResult[] = [];

    for (const key of rewriteKeys.slice(0, limit)) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        try {
          results.push(JSON.parse(data));
        } catch {}
      }
    }
    return results;
  } catch (error) {
    console.error("Error loading recent rewrites:", error);
    return [];
  }
}

export async function deleteRewrite(timestamp: number): Promise<void> {
  try {
    const key = `rewrite_${timestamp}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error deleting rewrite:", error);
  }
}
