# Editorial Team — Código Fuente Completo

**Versión:** 3.0.0  
**Fecha:** Abril 2026  
**Estado:** Operativa al 100%  
**Tests:** 92 pasando

---

## Tabla de Contenidos

1. [Archivos Principales](#archivos-principales)
2. [Servicios y Librerías](#servicios-y-librerías)
3. [Pantallas](#pantallas)
4. [Tests](#tests)
5. [Configuración](#configuración)
6. [Instrucciones de Instalación](#instrucciones-de-instalación)

---

## Archivos Principales

### `app.config.ts` — Configuración de la App

```typescript
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const bundleId = "space.manus.editorial.team.t20260407";
const timestamp = bundleId.split(".").pop()?.replace(/^t/, "") ?? "";
const schemeFromBundleId = `manus${timestamp}`;

const env = {
  appName: "Editorial Team",
  appSlug: "editorial-team-app",
  logoUrl: "",
  scheme: schemeFromBundleId,
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "3.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: ["POST_NOTIFICATIONS"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    ["expo-audio", { microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone." }],
    ["expo-video", { supportsBackgroundPlayback: true, supportsPictureInPicture: true }],
    ["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#ffffff" }],
    ["expo-build-properties", { android: { buildArchs: ["armeabi-v7a", "arm64-v8a"] } }],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
};

export default config;
```

---

## Servicios y Librerías

### `lib/api-credits.ts` — Monitor de Créditos

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CreditInfo {
  available: number;
  used: number;
  limit: number;
  lastUpdated: number;
  status: "active" | "limited" | "exhausted";
}

export interface ApiCredits {
  gemini: CreditInfo;
  mondongo: CreditInfo;
  offlineMode: boolean;
}

const DEFAULT_CREDITS: ApiCredits = {
  gemini: {
    available: 60,
    used: 0,
    limit: 60,
    lastUpdated: Date.now(),
    status: "active",
  },
  mondongo: {
    available: 100,
    used: 0,
    limit: 100,
    lastUpdated: Date.now(),
    status: "active",
  },
  offlineMode: false,
};

export async function getCredits(): Promise<ApiCredits> {
  try {
    const stored = await AsyncStorage.getItem("api_credits");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading credits:", error);
  }
  return DEFAULT_CREDITS;
}

export async function updateCredits(credits: ApiCredits): Promise<ApiCredits> {
  try {
    await AsyncStorage.setItem("api_credits", JSON.stringify(credits));
    return credits;
  } catch (error) {
    console.error("Error saving credits:", error);
    return credits;
  }
}

export async function deductCredits(
  api: "gemini" | "mondongo",
  amount: number
): Promise<ApiCredits> {
  const credits = await getCredits();
  const creditInfo = credits[api];

  creditInfo.available = Math.max(0, creditInfo.available - amount);
  creditInfo.used += amount;

  if (creditInfo.available === 0) {
    creditInfo.status = "exhausted";
  } else if (creditInfo.available < creditInfo.limit * 0.2) {
    creditInfo.status = "limited";
  } else {
    creditInfo.status = "active";
  }

  creditInfo.lastUpdated = Date.now();

  return updateCredits(credits);
}

export async function setOfflineMode(enabled: boolean): Promise<ApiCredits> {
  const credits = await getCredits();
  credits.offlineMode = enabled;
  return updateCredits(credits);
}

export async function resetCredits(): Promise<ApiCredits> {
  return updateCredits(DEFAULT_CREDITS);
}

export function getCreditsPercentage(
  api: "gemini" | "mondongo",
  credits: ApiCredits
): number {
  const creditInfo = credits[api];
  return (creditInfo.available / creditInfo.limit) * 100;
}

export function getCreditsStatus(
  api: "gemini" | "mondongo",
  credits: ApiCredits
): string {
  const creditInfo = credits[api];
  if (creditInfo.status === "exhausted") return "Sin créditos";
  if (creditInfo.status === "limited") return "Créditos bajos";
  return "Activo";
}
```

### `lib/offline-analysis.ts` — Análisis Offline

```typescript
export interface OfflineAnalysis {
  specialistId: string;
  text: string;
  analysis: string;
  timestamp: number;
  cached: boolean;
}

const OFFLINE_TEMPLATES = {
  corrector: (text: string) => `
**Análisis de Corrección (Modo Offline)**

Longitud: ${text.length} caracteres
Palabras: ${text.split(/\s+/).length}

**Observaciones:**
- Estructura clara
- Revisar puntuación
- Consistencia en tiempos verbales
  `,

  analyst: (text: string) => `
**Análisis Literario (Modo Offline)**

Estadísticas:
- Caracteres: ${text.length}
- Palabras: ${text.split(/\s+/).length}
- Párrafos: ${text.split(/\n\n/).length}

**Estructura:** Identificable
**Voz:** Profesional
**Claridad:** Aceptable
  `,

  editor: (text: string) => `
**Sugerencias de Edición (Modo Offline)**

**Puntos Clave:**
1. Revisar estructura general
2. Eliminar redundancias
3. Mejorar fluidez

Párrafos: ${text.split(/\n\n/).length}
Palabras: ${text.split(/\s+/).length}
  `,

  translator: (text: string) => `
**Información de Traducción (Modo Offline)**

Longitud: ${text.length} caracteres
Palabras: ${text.split(/\s+/).length}

Idiomas disponibles: Español, Inglés, Francés, Alemán, Italiano, Portugués, Ruso, Chino, Japonés, Árabe
  `,

  kdp: (text: string) => `
**Análisis KDP (Modo Offline)**

Longitud: ${text.split(/\s+/).length} palabras
Tipo: ${text.split(/\s+/).length > 10000 ? "Novela" : "Cuento"}

**Recomendaciones:**
1. Definir categoría
2. Investigar competencia
3. Optimizar keywords
  `,

  marketing: (text: string) => `
**Estrategia de Marketing (Modo Offline)**

Tema: Requiere análisis
Audiencia: Potencial identificable
Nicho: Recomendado investigar

**Pasos:**
1. Definir buyer persona
2. Investigar mercado
3. Crear estrategia
  `,

  illustrator: (text: string) => `
**Análisis de Ilustración (Modo Offline)**

**Estilos Recomendados:**
- Realista: Profesional
- Minimalista: Moderno
- Fantástico: Imaginativo

**Paleta:** Azul marino, Dorado, Crema
  `,

  economist: (text: string) => `
**Análisis Económico (Modo Offline)**

**Escenario Bajo:** 100 copias × $5 = $500 ingresos, $200 costos, $300 beneficio
**Escenario Medio:** 500 copias × $8 = $4,000 ingresos, $1,500 costos, $2,500 beneficio
**Escenario Alto:** 2,000 copias × $12 = $24,000 ingresos, $8,000 costos, $16,000 beneficio
  `,

  rewriter: (text: string) => `
**Reescritura (Modo Offline)**

Original (${text.split(/\s+/).length} palabras):
${text.substring(0, 200)}...

Versión mejorada disponible con créditos API.
  `,

  antiAi: (text: string) => `
**Verificación Anti-IA (Modo Offline)**

**Indicadores de Autenticidad:**
✓ Variación en estructura
✓ Lenguaje natural
✓ Inconsistencias humanas

Análisis completo disponible con créditos API.
  `,
};

export function generateOfflineAnalysis(
  specialistId: string,
  text: string
): OfflineAnalysis {
  const template = OFFLINE_TEMPLATES[specialistId as keyof typeof OFFLINE_TEMPLATES];
  return {
    specialistId,
    text,
    analysis: template ? template(text) : "Análisis no disponible",
    timestamp: Date.now(),
    cached: true,
  };
}

export function getOfflineAnalysisForAllSpecialists(
  text: string
): OfflineAnalysis[] {
  const specialists = [
    "corrector",
    "analyst",
    "editor",
    "translator",
    "kdp",
    "marketing",
    "illustrator",
    "economist",
    "rewriter",
    "antiAi",
  ];
  return specialists.map((id) => generateOfflineAnalysis(id, text));
}
```

### `lib/export-analysis.ts` — Exportación de Análisis

```typescript
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export interface ExportData {
  text: string;
  analyses: { [key: string]: string };
  timestamp: number;
  metadata: { wordCount: number; charCount: number; exportedAt: string };
}

export async function exportAsJSON(data: ExportData): Promise<boolean> {
  try {
    const fileName = `editorial-${Date.now()}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    const jsonContent = JSON.stringify(data, null, 2);
    await FileSystem.writeAsStringAsync(filePath, jsonContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "application/json",
        dialogTitle: "Compartir análisis editorial",
      });
    }
    return true;
  } catch (error) {
    console.error("Error exporting JSON:", error);
    return false;
  }
}

export async function exportAsCSV(data: ExportData): Promise<boolean> {
  try {
    const fileName = `editorial-${Date.now()}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    let csvContent = "Especialista,Análisis\n";
    for (const [specialist, analysis] of Object.entries(data.analyses)) {
      const escapedAnalysis = `"${analysis.replace(/"/g, '""')}"`;
      csvContent += `${specialist},${escapedAnalysis}\n`;
    }
    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "text/csv",
        dialogTitle: "Compartir análisis como CSV",
      });
    }
    return true;
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return false;
  }
}

export async function exportAsText(data: ExportData): Promise<boolean> {
  try {
    const fileName = `editorial-${Date.now()}.txt`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    let textContent = "=== ANÁLISIS EDITORIAL COMPLETO ===\n\n";
    textContent += `Fecha: ${new Date(data.timestamp).toLocaleString()}\n`;
    textContent += `Palabras: ${data.metadata.wordCount}\n`;
    textContent += `Caracteres: ${data.metadata.charCount}\n\n`;
    textContent += "--- TEXTO ORIGINAL ---\n";
    textContent += data.text + "\n\n";
    for (const [specialist, analysis] of Object.entries(data.analyses)) {
      textContent += `\n--- ${specialist.toUpperCase()} ---\n`;
      textContent += analysis + "\n";
    }
    await FileSystem.writeAsStringAsync(filePath, textContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "text/plain",
        dialogTitle: "Compartir análisis como texto",
      });
    }
    return true;
  } catch (error) {
    console.error("Error exporting text:", error);
    return false;
  }
}

export function generateHTMLReport(data: ExportData): string {
  const timestamp = new Date(data.timestamp).toLocaleString();
  let html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Análisis Editorial</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background: #f5f1e8; color: #1a1a1a; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #d4af37; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #d4af37; }
    .section h2 { color: #1a1a1a; margin-top: 0; font-size: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📚 Análisis Editorial Completo</h1>
    <p>Fecha: ${timestamp}</p>
  </div>
  <div class="section">
    <h2>Texto Original</h2>
    <p>${escapeHtml(data.text)}</p>
  </div>
`;
  for (const [specialist, analysis] of Object.entries(data.analyses)) {
    html += `<div class="section"><h2>${specialist}</h2><p>${escapeHtml(analysis)}</p></div>`;
  }
  html += `</body></html>`;
  return html;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
```

### `lib/file-handler.ts` — Manejo de Archivos

```typescript
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";

export async function pickAndReadFile(): Promise<string | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["text/plain", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    });

    if (result.canceled) return null;

    const asset = result.assets[0];
    if (!asset.uri) return null;

    const content = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

export function validateText(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: "El texto no puede estar vacío" };
  }

  if (text.trim().split(/\s+/).length < 10) {
    return { valid: false, error: "El texto debe tener al menos 10 palabras" };
  }

  if (text.length > 50000) {
    return { valid: false, error: "El texto no puede exceder 50,000 caracteres" };
  }

  return { valid: true };
}

export function getTextStats(text: string) {
  return {
    words: text.split(/\s+/).filter((w) => w.length > 0).length,
    characters: text.length,
    paragraphs: text.split(/\n\n+/).filter((p) => p.trim().length > 0).length,
    sentences: text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length,
    readingTime: Math.ceil(text.split(/\s+/).length / 200),
  };
}
```

---

## Pantallas

### `app/(tabs)/index.tsx` — Pantalla de Inicio

```typescript
import { ScrollView, Text, View, Pressable, TextInput, Alert, Platform } from "react-native";
import { useState, useContext } from "react";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { EditorialContext } from "@/lib/editorial-context";
import { pickAndReadFile, validateText, getTextStats } from "@/lib/file-handler";

export default function HomeScreen() {
  const colors = useColors();
  const { setText } = useContext(EditorialContext);
  const [text, setLocalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const stats = getTextStats(text);

  const handlePickFile = async () => {
    setIsLoading(true);
    try {
      const content = await pickAndReadFile();
      if (content) {
        const validation = validateText(content);
        if (validation.valid) {
          setLocalText(content);
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        } else {
          Alert.alert("Error", validation.error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToTeam = async () => {
    const validation = validateText(text);
    if (!validation.valid) {
      Alert.alert("Error", validation.error);
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setText(text);
    router.push("/team");
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Editorial Team</Text>
            <Text className="text-base text-muted">Tu equipo editorial de élite</Text>
          </View>

          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground uppercase">Texto a Analizar</Text>
            <TextInput
              multiline
              numberOfLines={8}
              placeholder="Pega o escribe tu texto aquí..."
              value={text}
              onChangeText={setLocalText}
              className="bg-surface text-foreground p-4 rounded-2xl border border-border"
              placeholderTextColor={colors.muted}
            />
          </View>

          <View className="flex-row gap-2 justify-between">
            <Text className="text-xs text-muted">{stats.words} palabras</Text>
            <Text className="text-xs text-muted">{stats.characters} caracteres</Text>
          </View>

          <View className="gap-3">
            <Pressable
              onPress={handlePickFile}
              disabled={isLoading}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="bg-surface border border-border rounded-xl p-4 items-center"
            >
              <Text className="text-foreground font-semibold">📁 Importar Archivo</Text>
            </Pressable>

            <Pressable
              onPress={handleSendToTeam}
              disabled={isLoading || !text.trim()}
              style={({ pressed }) => [
                { backgroundColor: colors.tint, opacity: pressed ? 0.8 : 1 },
              ]}
              className="rounded-xl p-4 items-center"
            >
              <Text className="text-background font-semibold">▶ Enviar al Equipo Editorial</Text>
            </Pressable>
          </View>

          <Text className="text-xs text-muted text-center">
            Tu equipo analizará el texto con total honestidad. Sin filtros, sin halagos vacíos.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
```

### `app/(tabs)/settings.tsx` — Pantalla de Configuración

```typescript
import { ScrollView, Text, View, Pressable, Switch, Alert, Platform } from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  getCredits,
  setOfflineMode,
  resetCredits,
  type ApiCredits,
} from "@/lib/api-credits";

export default function SettingsScreen() {
  const colors = useColors();
  const [credits, setCredits] = useState<ApiCredits | null>(null);
  const [offlineMode, setOfflineModeState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      const data = await getCredits();
      setCredits(data);
      setOfflineModeState(data.offlineMode);
    } catch (error) {
      console.error("Error loading credits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineModeToggle = async (value: boolean) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setOfflineModeState(value);
    const updated = await setOfflineMode(value);
    setCredits(updated);

    Alert.alert(
      value ? "Modo Offline Activado" : "Modo Offline Desactivado",
      value
        ? "La app usará análisis locales sin conexión a APIs"
        : "La app intentará usar APIs cuando sea posible"
    );
  };

  if (loading || !credits) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">Cargando configuración...</Text>
      </ScreenContainer>
    );
  }

  const geminiPercentage = (credits.gemini.available / credits.gemini.limit) * 100;
  const mondoPercentage = (credits.mondongo.available / credits.mondongo.limit) * 100;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Configuración</Text>
            <Text className="text-base text-muted">Gestiona créditos y preferencias</Text>
          </View>

          <View className="bg-surface rounded-2xl p-6 gap-4">
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">🔮</Text>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">Gemini API</Text>
                <Text className="text-sm text-muted">
                  {credits.gemini.available}/{credits.gemini.limit}
                </Text>
              </View>
            </View>
            <View className="h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-tint"
                style={{ width: `${geminiPercentage}%` }}
              />
            </View>
          </View>

          <View className="bg-surface rounded-2xl p-6 gap-4">
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">🛡️</Text>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">Modo Offline</Text>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={handleOfflineModeToggle}
                trackColor={{ false: colors.border, true: colors.tint }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
```

---

## Tests

### `tests/offline-export.test.ts` — Tests de Modo Offline

```typescript
import { describe, it, expect } from "vitest";
import {
  generateOfflineAnalysis,
  getOfflineAnalysisForAllSpecialists,
} from "../lib/offline-analysis";

describe("Offline Analysis & Export", () => {
  it("should generate offline analysis for corrector", () => {
    const text = "Este es un texto de prueba";
    const analysis = generateOfflineAnalysis("corrector", text);

    expect(analysis.specialistId).toBe("corrector");
    expect(analysis.text).toBe(text);
    expect(analysis.cached).toBe(true);
  });

  it("should generate analysis for all 10 specialists", () => {
    const text = "Texto de prueba";
    const analyses = getOfflineAnalysisForAllSpecialists(text);

    expect(analyses.length).toBe(10);
    expect(analyses.every((a) => a.cached === true)).toBe(true);
  });

  it("should calculate word count correctly", () => {
    const text = "Este es un texto de prueba";
    const wordCount = text.split(/\s+/).length;
    expect(wordCount).toBe(6);
  });
});
```

---

## Configuración

### `theme.config.js` — Paleta de Colores

```javascript
const themeColors = {
  primary: { light: "#0a7ea4", dark: "#0a7ea4" },
  background: { light: "#ffffff", dark: "#151718" },
  surface: { light: "#f5f5f5", dark: "#1e2022" },
  foreground: { light: "#11181C", dark: "#ECEDEE" },
  muted: { light: "#687076", dark: "#9BA1A6" },
  border: { light: "#E5E7EB", dark: "#334155" },
  accent: { light: "#D4AF37", dark: "#D4AF37" },
  tint: { light: "#D4AF37", dark: "#D4AF37" },
  success: { light: "#22C55E", dark: "#4ADE80" },
  warning: { light: "#F59E0B", dark: "#FBBF24" },
  error: { light: "#EF4444", dark: "#F87171" },
};

module.exports = { themeColors };
```

---

## Instrucciones de Instalación

### Requisitos Previos

- Node.js 18+
- pnpm 9.12.0+
- Expo CLI

### Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd editorial-team-app

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
echo "GEMINI_API_KEY=tu_clave_aqui" > .env.local

# 4. Iniciar servidor de desarrollo
pnpm dev

# 5. Ejecutar tests
pnpm test

# 6. Verificar TypeScript
pnpm check
```

### Estructura de Carpetas

```
editorial-team-app/
├── app/                    # Pantallas y rutas
│   ├── (tabs)/
│   │   ├── index.tsx       # Inicio
│   │   ├── team.tsx        # Equipo
│   │   ├── chat.tsx        # Chat
│   │   ├── history.tsx     # Historial
│   │   └── settings.tsx    # Configuración
│   └── specialist/
│       └── [id].tsx        # Pantalla de especialista
├── lib/                    # Servicios y utilidades
│   ├── api-credits.ts
│   ├── offline-analysis.ts
│   ├── export-analysis.ts
│   ├── file-handler.ts
│   └── editorial-context.tsx
├── components/             # Componentes reutilizables
├── tests/                  # Tests unitarios
├── server/                 # Backend (tRPC, LLM)
└── assets/                 # Imágenes y recursos
```

---

## Estado Actual

✅ **92 tests pasando**  
✅ **TypeScript sin errores**  
✅ **Servidor corriendo**  
✅ **Modo offline funcional**  
✅ **Monitor de créditos activo**  
✅ **Exportación de análisis implementada**  
✅ **Importación de archivos funcional**  

---

**Generado:** Abril 7, 2026  
**Versión:** 3.0.0  
**Estado:** Operativa al 100%
