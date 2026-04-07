import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ApiCredits {
  gemini: {
    available: number;
    used: number;
    limit: number;
    lastUpdated: number;
    status: "active" | "limited" | "exhausted";
  };
  mondongo: {
    available: number;
    used: number;
    limit: number;
    lastUpdated: number;
    status: "active" | "limited" | "exhausted";
  };
  offlineMode: boolean;
}

const STORAGE_KEY = "editorial_api_credits";
const DEFAULT_CREDITS: ApiCredits = {
  gemini: {
    available: 60, // Gemini free tier: 60 requests/min
    used: 0,
    limit: 60,
    lastUpdated: Date.now(),
    status: "active",
  },
  mondongo: {
    available: 100, // Mondongo free tier: 100 requests/day
    used: 0,
    limit: 100,
    lastUpdated: Date.now(),
    status: "active",
  },
  offlineMode: false,
};

export async function initializeCredits(): Promise<ApiCredits> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading credits:", error);
  }
  return DEFAULT_CREDITS;
}

export async function getCredits(): Promise<ApiCredits> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error getting credits:", error);
  }
  return DEFAULT_CREDITS;
}

export async function updateCredits(
  provider: "gemini" | "mondongo",
  used: number
): Promise<ApiCredits> {
  try {
    const credits = await getCredits();

    if (credits[provider]) {
      credits[provider].used += used;
      credits[provider].available = Math.max(
        0,
        credits[provider].limit - credits[provider].used
      );
      credits[provider].lastUpdated = Date.now();

      // Determinar estado
      if (credits[provider].available === 0) {
        credits[provider].status = "exhausted";
        credits.offlineMode = true;
      } else if (credits[provider].available < credits[provider].limit * 0.2) {
        credits[provider].status = "limited";
      } else {
        credits[provider].status = "active";
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(credits));
    }

    return credits;
  } catch (error) {
    console.error("Error updating credits:", error);
    return DEFAULT_CREDITS;
  }
}

export async function resetCredits(): Promise<ApiCredits> {
  try {
    const credits = DEFAULT_CREDITS;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(credits));
    return credits;
  } catch (error) {
    console.error("Error resetting credits:", error);
    return DEFAULT_CREDITS;
  }
}

export async function setOfflineMode(enabled: boolean): Promise<ApiCredits> {
  try {
    const credits = await getCredits();
    credits.offlineMode = enabled;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(credits));
    return credits;
  } catch (error) {
    console.error("Error setting offline mode:", error);
    return DEFAULT_CREDITS;
  }
}

export function getCreditsPercentage(
  provider: "gemini" | "mondongo",
  credits: ApiCredits
): number {
  const providerCredits = credits[provider];
  return (providerCredits.available / providerCredits.limit) * 100;
}

export function getCreditsStatus(
  provider: "gemini" | "mondongo",
  credits: ApiCredits
): string {
  const providerCredits = credits[provider];
  if (providerCredits.status === "exhausted") {
    return "Sin créditos disponibles";
  } else if (providerCredits.status === "limited") {
    return `Créditos bajos: ${providerCredits.available}/${providerCredits.limit}`;
  }
  return `${providerCredits.available}/${providerCredits.limit} disponibles`;
}
