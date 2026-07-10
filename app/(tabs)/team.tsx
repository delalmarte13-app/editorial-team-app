import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useEditorial, type SpecialistId } from "@/lib/editorial-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SpecialistCard } from "@/components/specialist-card";
import { trpc } from "@/lib/trpc";
import { exportAsDocx, type ExportData } from "@/lib/export-analysis";

const SPECIALISTS: {
  id: SpecialistId;
  name: string;
  fullName: string;
  role: string;
  emoji: string;
  description: string;
  color: string;
}[] = [
  {
    id: "corrector",
    name: "Elena Voss",
    fullName: "Elena Voss",
    role: "Correctora Senior",
    emoji: "✍️",
    description: "Ortografía, gramática y estilo. 20 años de experiencia en editoriales europeas.",
    color: "#4A7C59",
  },
  {
    id: "analyst",
    name: "Marco Reyes",
    fullName: "Marco Reyes",
    role: "Analista Literario",
    emoji: "🔍",
    description: "Estructura narrativa, voz y tono. Crítico literario con criterio propio.",
    color: "#2E4A7C",
  },
  {
    id: "editor",
    name: "Sophia Laurent",
    fullName: "Sophia Laurent",
    role: "Editora Jefe",
    emoji: "📝",
    description: "Reescritura y restructuración. Editora de bestsellers en tres idiomas.",
    color: "#7C2E4A",
  },
  {
    id: "translator",
    name: "Hiroshi Tanaka",
    fullName: "Hiroshi Tanaka",
    role: "Traductor Literario",
    emoji: "🌐",
    description: "Traducción multilingüe con sensibilidad cultural. 8 idiomas.",
    color: "#4A4A7C",
  },
  {
    id: "kdp",
    name: "Rachel Stone",
    fullName: "Rachel Stone",
    role: "Experta KDP",
    emoji: "📚",
    description: "Amazon KDP, nichos, keywords y posicionamiento. 500+ libros publicados.",
    color: "#7C5A2E",
  },
  {
    id: "marketing",
    name: "Diego Vargas",
    fullName: "Diego Vargas",
    role: "Director de Marketing",
    emoji: "📊",
    description: "Estrategia de ventas, buyer persona y lanzamiento editorial.",
    color: "#2E7C5A",
  },
  {
    id: "illustrator",
    name: "Amara Osei",
    fullName: "Amara Osei",
    role: "Directora de Arte",
    emoji: "🎨",
    description: "Estilo visual, ilustración y diseño de portada. Artista premiada.",
    color: "#7C2E2E",
  },
  {
    id: "economist",
    name: "Carlos Mendez",
    fullName: "Carlos Mendez",
    role: "Economista Editorial",
    emoji: "💰",
    description: "Análisis de ventas, beneficios y viabilidad económica en 3 escenarios.",
    color: "#5A7C2E",
  },
];

export default function TeamScreen() {
  const router = useRouter();
  const { currentText, specialists, setSpecialistResult } = useEditorial();
  const colors = useColors();

  const analyzeAll = trpc.editorial.analyzeAll.useMutation();

  const hasText = currentText.trim().length > 0;

  const handleSpecialistPress = (id: SpecialistId) => {
    if (!hasText) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/specialist/${id}` as any);
  };

  const handleAnalyzeAll = async () => {
    if (!hasText) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Set all to analyzing
    SPECIALISTS.forEach((s) => {
      setSpecialistResult(s.id, { status: "analyzing" });
    });

    try {
      const result = await analyzeAll.mutateAsync({ text: currentText });
      // Update each specialist with their result
      Object.entries(result).forEach(([id, data]) => {
        setSpecialistResult(id as SpecialistId, {
          status: "ready",
          result: data as string,
          generatedAt: Date.now(),
        });
      });
    } catch {
      SPECIALISTS.forEach((s) => {
        if (specialists[s.id].status === "analyzing") {
          setSpecialistResult(s.id, { status: "error", error: "Error al conectar con el servidor." });
        }
      });
    }
  };

  const readyCount = Object.values(specialists).filter((s) => s.status === "ready").length;
  const analyzingCount = Object.values(specialists).filter((s) => s.status === "analyzing").length;

  const handleExportDocx = async () => {
    if (readyCount === 0) {
      Alert.alert("Sin análisis", "Completa al menos un análisis antes de exportar.");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const analyses: { [key: string]: string } = {};
    Object.entries(specialists).forEach(([id, specialist]) => {
      if (specialist.result) {
        analyses[id] = specialist.result;
      }
    });

    const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;
    const charCount = currentText.length;

    const exportData: ExportData = {
      text: currentText,
      analyses,
      timestamp: Date.now(),
      metadata: {
        wordCount,
        charCount,
        exportedAt: new Date().toLocaleString("es-ES"),
      },
    };

    try {
      const success = await exportAsDocx(exportData);
      if (success) {
        Alert.alert("Éxito", "Documento exportado correctamente.");
      } else {
        Alert.alert("Error", "No se pudo exportar el documento.");
      }
    } catch (error) {
      console.error("Error al exportar DOCX:", error);
      Alert.alert("Error", "Ocurrió un error al exportar.");
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Tu Equipo Editorial</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {hasText
              ? `${currentText.trim().split(/\s+/).filter(Boolean).length} palabras · Selecciona un especialista`
              : "Sube un texto en la pestaña Inicio para comenzar"}
          </Text>
        </View>

        {/* Progress bar */}
        {readyCount > 0 && (
          <View style={styles.progressSection}>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.success,
                    width: `${(readyCount / SPECIALISTS.length) * 100}%` as any,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.muted }]}>
              {readyCount}/{SPECIALISTS.length} análisis completados
            </Text>
          </View>
        )}

        {/* Analyze All Button */}
        {hasText && (
          <View style={styles.analyzeSection}>
            <Pressable
              onPress={handleAnalyzeAll}
              disabled={analyzingCount > 0}
              style={({ pressed }) => [
                styles.analyzeBtn,
                {
                  backgroundColor: analyzingCount > 0 ? colors.border : colors.primary,
                  transform: [{ scale: pressed && analyzingCount === 0 ? 0.97 : 1 }],
                },
              ]}
            >
              <IconSymbol
                name="sparkles"
                size={18}
                color={analyzingCount > 0 ? colors.muted : colors.accent}
              />
              <Text
                style={[
                  styles.analyzeBtnText,
                  { color: analyzingCount > 0 ? colors.muted : colors.accent },
                ]}
              >
                {analyzingCount > 0 ? "Analizando..." : "Analizar con todo el equipo"}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Export Button */}
        {readyCount > 0 && (
          <View style={styles.exportSection}>
            <Pressable
              onPress={handleExportDocx}
              style={({ pressed }) => [
                styles.exportBtn,
                {
                  backgroundColor: colors.primary,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <IconSymbol name="doc.fill" size={18} color={colors.accent} />
              <Text style={[styles.exportBtnText, { color: colors.accent }]}>
                Exportar como Word
              </Text>
            </Pressable>
            <Text style={[styles.exportHint, { color: colors.muted }]}>
              Descarga un documento editable con todos los análisis
            </Text>
          </View>
        )}

        {/* Specialists Grid */}
        <View style={styles.grid}>
          {SPECIALISTS.map((specialist) => (
            <SpecialistCard
              key={specialist.id}
              id={specialist.id}
              name={specialist.name}
              role={specialist.role}
              emoji={specialist.emoji}
              description={specialist.description}
              accentColor={specialist.color}
              status={specialists[specialist.id].status}
              disabled={!hasText}
              onPress={() => handleSpecialistPress(specialist.id)}
            />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressSection: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    gap: 6,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
  },
  analyzeSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  analyzeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  analyzeBtnText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  grid: {
    paddingHorizontal: 16,
    gap: 10,
  },
  exportSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  exportBtnText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  exportHint: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});
