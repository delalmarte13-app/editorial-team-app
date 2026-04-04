import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { MarkdownRenderer } from "@/components/markdown-renderer";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useEditorial, type SpecialistId } from "@/lib/editorial-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { trpc } from "@/lib/trpc";

// ─── Specialist Config ────────────────────────────────────────────────────────

const SPECIALISTS_CONFIG: Record<
  SpecialistId,
  {
    name: string;
    role: string;
    emoji: string;
    color: string;
    years: string;
    bio: string;
    showLanguageSelector?: boolean;
    showIllustrationGenerator?: boolean;
  }
> = {
  corrector: {
    name: "Elena Voss",
    role: "Correctora Senior",
    emoji: "✍️",
    color: "#4A7C59",
    years: "20 años de experiencia",
    bio: "Formada en Leipzig y Madrid. Ha trabajado para Planeta, Anagrama y Suhrkamp. Especialista en ficción literaria y no ficción. No tiene paciencia para los textos descuidados.",
  },
  analyst: {
    name: "Marco Reyes",
    role: "Analista Literario y Crítico",
    emoji: "🔍",
    color: "#2E4A7C",
    years: "15 años de experiencia",
    bio: "Crítico literario en tres revistas especializadas. Doctor en Literatura Comparada por la Complutense. Lector voraz con criterio propio y sin miedo a decir lo que piensa.",
  },
  editor: {
    name: "Sophia Laurent",
    role: "Editora Jefe",
    emoji: "📝",
    color: "#7C2E4A",
    years: "18 años de experiencia",
    bio: "Editora en París, Londres y Barcelona. Ha trabajado con autores en tres idiomas. Especialista en transformar textos con potencial en libros que se venden.",
  },
  translator: {
    name: "Hiroshi Tanaka",
    role: "Traductor Literario",
    emoji: "🌐",
    color: "#4A4A7C",
    years: "22 años de experiencia",
    bio: "Domina el japonés, inglés, español, francés, alemán, portugués, italiano y chino mandarín. Especialista en la adaptación cultural, no solo en la traducción literal.",
    showLanguageSelector: true,
  },
  kdp: {
    name: "Rachel Stone",
    role: "Experta en Amazon KDP",
    emoji: "📚",
    color: "#7C5A2E",
    years: "12 años de experiencia",
    bio: "Ha publicado más de 500 libros en KDP en múltiples nichos. Conoce los algoritmos de Amazon mejor que muchos empleados de la empresa. Directa y sin rodeos sobre el potencial comercial.",
  },
  marketing: {
    name: "Diego Vargas",
    role: "Director de Marketing Editorial",
    emoji: "📊",
    color: "#2E7C5A",
    years: "16 años de experiencia",
    bio: "Ha lanzado libros en mercados hispanohablantes, europeos y latinoamericanos. Especialista en estrategias de bajo presupuesto con alto impacto. No vende humo.",
  },
  illustrator: {
    name: "Amara Osei",
    role: "Directora de Arte Editorial",
    emoji: "🎨",
    color: "#7C2E2E",
    years: "14 años de experiencia",
    bio: "Artista ghanesa-británica premiada en tres continentes. Ha diseñado portadas para editoriales independientes y grandes sellos. Su criterio visual es tan honesto como su trabajo.",
    showIllustrationGenerator: true,
  },
  economist: {
    name: "Carlos Mendez",
    role: "Economista Editorial",
    emoji: "💰",
    color: "#5A7C2E",
    years: "19 años de experiencia",
    bio: "Economista especializado en industria editorial. Ha analizado miles de proyectos. Proporciona estimaciones realistas de ventas, costos y beneficios. No promete milagros, solo números.",
  },
  rewriter: {
    name: "Departamento de Reescritura",
    role: "Reescritura Profesional",
    emoji: "🔄",
    color: "#2E5A7C",
    years: "Equipo especializado",
    bio: "Equipo de reescritores profesionales que transforman textos buenos en textos excepcionales, manteniendo la voz del autor pero mejorando prosa, pacing y engagement.",
  },
  antiAi: {
    name: "Vigilancia Anti-IA",
    role: "Verificación de Autenticidad",
    emoji: "🛡️",
    color: "#7C2E5A",
    years: "Especialistas en detección",
    bio: "Equipo especializado en detectar patrones de escritura artificial y verificar que el texto mantiene autenticidad y voz humana genuina.",
  },
};

const LANGUAGES = [
  { code: "English", label: "Inglés" },
  { code: "French", label: "Francés" },
  { code: "German", label: "Alemán" },
  { code: "Portuguese", label: "Portugués" },
  { code: "Italian", label: "Italiano" },
  { code: "Chinese", label: "Chino" },
  { code: "Japanese", label: "Japonés" },
  { code: "Arabic", label: "Árabe" },
  { code: "Russian", label: "Ruso" },
  { code: "Dutch", label: "Holandés" },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SpecialistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { currentText, specialists, setSpecialistResult, selectedLanguage, setSelectedLanguage } =
    useEditorial();

  const specialistId = id as SpecialistId;
  const config = SPECIALISTS_CONFIG[specialistId];
  const specialistState = specialists[specialistId];

  const [illustrationPrompt, setIllustrationPrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const analyzeMutation = trpc.editorial.analyze.useMutation();
  const generateIllustrationMutation = trpc.editorial.generateIllustration.useMutation();

  const handleAnalyze = useCallback(async () => {
    if (!currentText.trim()) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setSpecialistResult(specialistId, { status: "analyzing" });

    try {
      const result = await analyzeMutation.mutateAsync({
        text: currentText,
        specialistId,
        targetLanguage: specialistId === "translator" ? selectedLanguage : undefined,
      });
      const resultText = typeof result.result === 'string' ? result.result : JSON.stringify(result.result);
      setSpecialistResult(specialistId, {
        status: "ready",
        result: resultText,
        generatedAt: Date.now(),
      });
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err: any) {
      setSpecialistResult(specialistId, {
        status: "error",
        error: err?.message ?? "Error al conectar con el servidor.",
      });
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [currentText, specialistId, selectedLanguage, analyzeMutation, setSpecialistResult]);

  const handleGenerateIllustration = async () => {
    if (!illustrationPrompt.trim() && !specialistState.result) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const prompt =
      illustrationPrompt.trim() ||
      `Book cover illustration based on: ${currentText.slice(0, 300)}`;

    try {
      const result = await generateIllustrationMutation.mutateAsync({ prompt });
      setGeneratedImageUrl(result.imageUrl ?? null);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {}
  };

  const handleCopy = async () => {
    if (!specialistState.result) return;
    await Clipboard.setStringAsync(specialistState.result);
    setCopied(true);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  if (!config) {
    return (
      <ScreenContainer>
        <Text style={{ color: colors.error, padding: 24 }}>Especialista no encontrado.</Text>
      </ScreenContainer>
    );
  }

  const isAnalyzing = specialistState.status === "analyzing";
  const isReady = specialistState.status === "ready";
  const isError = specialistState.status === "error";
  const hasText = currentText.trim().length > 0;

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <IconSymbol name="chevron.left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{config.role}</Text>
        </View>
        {isReady && (
          <Pressable
            onPress={handleCopy}
            style={({ pressed }) => [styles.copyBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol
              name={copied ? "checkmark" : "doc.on.doc"}
              size={20}
              color={copied ? colors.success : colors.muted}
            />
          </Pressable>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Specialist Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.emojiBg, { backgroundColor: config.color + "20" }]}>
            <Text style={styles.profileEmoji}>{config.emoji}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.foreground }]}>{config.name}</Text>
            <Text style={[styles.profileRole, { color: config.color }]}>{config.role}</Text>
            <Text style={[styles.profileYears, { color: colors.muted }]}>{config.years}</Text>
          </View>
        </View>

        <View style={[styles.bioBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.bioText, { color: colors.muted }]}>{config.bio}</Text>
        </View>

        {/* Language Selector for Translator */}
        {config.showLanguageSelector && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>IDIOMA DESTINO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.languageRow}>
                {LANGUAGES.map((lang) => (
                  <Pressable
                    key={lang.code}
                    onPress={() => setSelectedLanguage(lang.code)}
                    style={({ pressed }) => [
                      styles.langChip,
                      {
                        backgroundColor:
                          selectedLanguage === lang.code ? colors.primary : colors.surface,
                        borderColor:
                          selectedLanguage === lang.code ? colors.primary : colors.border,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.langText,
                        {
                          color:
                            selectedLanguage === lang.code ? colors.accent : colors.foreground,
                        },
                      ]}
                    >
                      {lang.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Analyze Button */}
        {hasText && !isReady && (
          <View style={styles.section}>
            <Pressable
              onPress={handleAnalyze}
              disabled={isAnalyzing}
              style={({ pressed }) => [
                styles.analyzeBtn,
                {
                  backgroundColor: isAnalyzing ? colors.border : colors.primary,
                  transform: [{ scale: pressed && !isAnalyzing ? 0.97 : 1 }],
                },
              ]}
            >
              {isAnalyzing ? (
                <>
                  <ActivityIndicator size="small" color={colors.accent} />
                  <Text style={[styles.analyzeBtnText, { color: colors.accent }]}>
                    {config.name} está analizando...
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.btnEmoji}>{config.emoji}</Text>
                  <Text style={[styles.analyzeBtnText, { color: colors.accent }]}>
                    Solicitar análisis a {config.name}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {/* Re-analyze button when ready */}
        {isReady && (
          <View style={styles.section}>
            <Pressable
              onPress={handleAnalyze}
              style={({ pressed }) => [
                styles.reanalyzeBtn,
                { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <IconSymbol name="arrow.clockwise" size={16} color={colors.muted} />
              <Text style={[styles.reanalyzeBtnText, { color: colors.muted }]}>
                Volver a analizar
              </Text>
            </Pressable>
          </View>
        )}

        {/* No text warning */}
        {!hasText && (
          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
            <Text style={styles.emptyEmoji}>📄</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Sin texto para analizar
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.muted }]}>
              Ve a la pestaña Inicio y sube tu texto para que {config.name} pueda trabajar.
            </Text>
          </View>
        )}

        {/* Error state */}
        {isError && (
          <View style={[styles.errorCard, { backgroundColor: colors.error + "15", borderColor: colors.error }]}>
            <IconSymbol name="xmark.circle.fill" size={20} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error }]}>
              {specialistState.error ?? "Error desconocido. Intenta de nuevo."}
            </Text>
          </View>
        )}

        {/* Result */}
        {isReady && specialistState.result && (
          <View style={styles.resultSection}>
            <View style={[styles.resultHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.resultHeaderText, { color: colors.accent }]}>
                Análisis de {config.name}
              </Text>
              {specialistState.generatedAt && (
                <Text style={[styles.resultTime, { color: colors.muted }]}>
                  {new Date(specialistState.generatedAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              )}
            </View>
            <View style={styles.resultContent}>
              <MarkdownRenderer content={specialistState.result} />
            </View>
          </View>
        )}

        {/* Illustration Generator (only for illustrator specialist) */}
        {config.showIllustrationGenerator && isReady && (
          <View style={[styles.illustrationSection, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>GENERAR ILUSTRACIÓN DE MUESTRA</Text>
            <Text style={[styles.illustrationHint, { color: colors.muted }]}>
              Usa el prompt sugerido por Amara o escribe el tuyo propio.
            </Text>
            <View
              style={[
                styles.promptInput,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <TextInput
                value={illustrationPrompt}
                onChangeText={setIllustrationPrompt}
                multiline
                placeholder="Describe la ilustración que quieres generar..."
                placeholderTextColor={colors.muted}
                style={[styles.promptTextInput, { color: colors.foreground }]}
                textAlignVertical="top"
              />
            </View>
            <Pressable
              onPress={handleGenerateIllustration}
              disabled={generateIllustrationMutation.isPending}
              style={({ pressed }) => [
                styles.generateBtn,
                {
                  backgroundColor: generateIllustrationMutation.isPending
                    ? colors.border
                    : config.color,
                  transform: [{ scale: pressed && !generateIllustrationMutation.isPending ? 0.97 : 1 }],
                },
              ]}
            >
              {generateIllustrationMutation.isPending ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.generateBtnText}>Generando ilustración...</Text>
                </>
              ) : (
                <>
                  <IconSymbol name="paintbrush.fill" size={18} color="#fff" />
                  <Text style={styles.generateBtnText}>Generar ilustración</Text>
                </>
              )}
            </Pressable>

            {generatedImageUrl && (
              <View style={styles.generatedImageContainer}>
                <Image
                  source={{ uri: generatedImageUrl }}
                  style={styles.generatedImage}
                  resizeMode="cover"
                />
                <Text style={[styles.imageCaption, { color: colors.muted }]}>
                  Ilustración de muestra generada por IA
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  copyBtn: {
    padding: 8,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  emojiBg: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  profileEmoji: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  profileRole: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  profileYears: {
    fontSize: 12,
    fontWeight: "400",
  },
  bioBadge: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: "italic",
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  languageRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  langText: {
    fontSize: 13,
    fontWeight: "500",
  },
  analyzeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 15,
    borderRadius: 14,
  },
  btnEmoji: {
    fontSize: 18,
  },
  analyzeBtnText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  reanalyzeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  reanalyzeBtnText: {
    fontSize: 13,
    fontWeight: "500",
  },
  emptyState: {
    margin: 16,
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    margin: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  resultSection: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    marginBottom: 16,
  },
  resultHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  resultTime: {
    fontSize: 12,
  },
  resultContent: {
    paddingBottom: 8,
  },
  illustrationSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 0.5,
    paddingBottom: 16,
  },
  illustrationHint: {
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  promptInput: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    minHeight: 80,
  },
  promptTextInput: {
    fontSize: 14,
    lineHeight: 22,
    minHeight: 60,
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  generateBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  generatedImageContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  generatedImage: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 12,
  },
  imageCaption: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
});
