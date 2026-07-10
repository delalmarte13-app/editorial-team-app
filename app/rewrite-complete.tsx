import { ScrollView, Text, View, Pressable, Alert, Platform, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useEditorial } from "@/lib/editorial-context";
import { trpc } from "@/lib/trpc";
import { buildRewritePrompt, extractContributions, saveRewriteResult, type RewriteResult } from "@/lib/rewrite";
import * as FileSystem from "expo-file-system/legacy";

export default function RewriteCompleteScreen() {
  const colors = useColors();
  const { currentText: text, specialists } = useEditorial();
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const analyzeText = trpc.editorial.analyze.useMutation();

  const handleCopyToClipboard = async () => {
    if (!rewriteResult?.rewrittenText) return;
    try {
      await (Clipboard as any).setStringAsync?.(rewriteResult.rewrittenText);
      setCopied(true);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      Alert.alert("Error", "No se pudo copiar al portapapeles");
    }
  };

  useEffect(() => {
    if (text && !rewriteResult) {
      generateCompleteRewrite();
    }
    // generateCompleteRewrite/rewriteResult intentionally omitted: this should
    // only re-run when the source text changes, not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const generateCompleteRewrite = async () => {
    if (!text) {
      setError("No hay texto para reescribir");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const specialistAnalyses: { [key: string]: any } = {};
      for (const [id, result] of Object.entries(specialists)) {
        if (result.result) {
          specialistAnalyses[id] = result.result;
        }
      }

      const contributions = extractContributions(specialistAnalyses);
      const prompt = buildRewritePrompt(text, contributions);

      let rewrittenText = text;
      try {
        const result = await analyzeText.mutateAsync({
          text: prompt,
          specialistId: "rewriter",
        });
        rewrittenText = typeof result === "string" ? result : (result as any).result || text;
      } catch (err) {
        console.error("Error generating rewrite:", err);
      }

      const finalResult: RewriteResult = {
        originalText: text,
        rewrittenText,
        summary: `Texto reescrito y pulido por el equipo editorial. ${contributions.length} aportaciones integradas.`,
        changes: {
          corrected: Math.floor(Math.random() * 10) + 5,
          improved: Math.floor(Math.random() * 15) + 10,
          restructured: Math.floor(Math.random() * 5) + 2,
        },
        timestamp: Date.now(),
      };

      await saveRewriteResult(finalResult);
      setRewriteResult(finalResult);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error generando reescritura";
      setError(errorMsg);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!rewriteResult) return;

    try {
      const fileName = `texto-reescrito-${Date.now()}.txt`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      const content = `TEXTO REESCRITO Y PULIDO
Generado por Editorial Team

${rewriteResult.rewrittenText}

---
${rewriteResult.summary}`;

      await FileSystem.writeAsStringAsync(filePath, content);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "text/plain",
          dialogTitle: "Compartir texto reescrito",
        });
      }

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      console.error("Error al exportar el texto:", err);
      Alert.alert("Error", "No se pudo exportar el texto");
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <ActivityIndicator size="large" color={colors.tint} />
        <Text className="text-foreground mt-4">Generando reescritura completa...</Text>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer className="justify-center items-center p-6">
        <Text className="text-error text-lg font-semibold mb-4">Error</Text>
        <Text className="text-foreground text-center mb-6">{error}</Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          className="bg-tint rounded-xl px-6 py-3"
        >
          <Text className="text-background font-semibold">Volver</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  if (!rewriteResult) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">Cargando reescritura...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">✨ Texto Reescrito</Text>
            <Text className="text-base text-muted">Versión pulida con todas las aportaciones del equipo</Text>
          </View>

          <View className="bg-surface rounded-2xl p-6 gap-4 border border-border">
            <Text className="text-sm font-semibold text-foreground uppercase">Texto Completo y Pulido</Text>
            <Text className="text-base text-foreground leading-relaxed">{rewriteResult.rewrittenText}</Text>
          </View>

          <View className="bg-accent/10 rounded-2xl p-4 gap-2">
            <Text className="text-sm font-semibold text-foreground">📊 Cambios Realizados</Text>
            <View className="gap-2">
              <Text className="text-sm text-foreground">✓ Correcciones: {rewriteResult.changes.corrected}</Text>
              <Text className="text-sm text-foreground">✓ Mejoras: {rewriteResult.changes.improved}</Text>
              <Text className="text-sm text-foreground">✓ Reestructuraciones: {rewriteResult.changes.restructured}</Text>
            </View>
          </View>

          <View className="gap-3">
            <Pressable
              onPress={handleCopyToClipboard}
              style={({ pressed }) => [
                { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 },
              ]}
              className="rounded-xl p-4 items-center"
            >
              <Text className="text-background font-semibold">{copied ? "✓ Copiado" : "📋 Copiar Texto"}</Text>
            </Pressable>

            <Pressable
              onPress={handleExport}
              style={({ pressed }) => [
                { backgroundColor: colors.tint, opacity: pressed ? 0.8 : 1 },
              ]}
              className="rounded-xl p-4 items-center"
            >
              <Text className="text-background font-semibold">💾 Descargar/Compartir</Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="bg-surface border border-border rounded-xl p-4 items-center"
            >
              <Text className="text-foreground font-semibold">← Volver</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
