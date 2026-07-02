import {
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useEditorial } from "@/lib/editorial-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { pickAndReadFile, formatFileSize } from "@/lib/file-handler";

const MIN_WORDS = 20;

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { currentText, setCurrentText, addToHistory, resetSpecialists } = useEditorial();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = currentText.length;
  const canSubmit = wordCount >= MIN_WORDS;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    Keyboard.dismiss();
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    resetSpecialists();
    await addToHistory(currentText);
    router.push("/team" as any);
  };

  const handleClear = () => {
    setCurrentText("");
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePickFile = async () => {
    const result = await pickAndReadFile();
    if (result.success && result.content) {
      setCurrentText(result.content);
      Alert.alert(
        "Éxito",
        `Archivo "${result.fileName}" cargado (${formatFileSize(result.fileSize)})`
      );
    } else if (result.error) {
      Alert.alert("Error", result.error);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await (Clipboard as any).getStringAsync?.() || "";
      if (text && text.trim()) {
        setCurrentText(text);
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } else {
        Alert.alert("Portapapeles vacío", "No hay texto en el portapapeles.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo acceder al portapapeles.");
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={[styles.logoMark, { backgroundColor: colors.primary }]}>
                <IconSymbol name="pencil.and.outline" size={18} color={colors.accent} />
              </View>
              <View>
                <Text style={[styles.appTitle, { color: colors.foreground }]}>Editorial Team</Text>
                <Text style={[styles.appSubtitle, { color: colors.accent }]}>Tu equipo editorial de élite</Text>
              </View>
            </View>
          </View>

          {/* Main Input Area */}
          <View style={styles.inputSection}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>
              TEXTO A ANALIZAR
            </Text>

            <Pressable
              onPress={() => inputRef.current?.focus()}
              style={[
                styles.textAreaContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: isFocused ? colors.accent : colors.border,
                },
              ]}
            >
              <TextInput
                ref={inputRef}
                value={currentText}
                onChangeText={setCurrentText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                multiline
                placeholder="Pega o escribe tu texto aquí. Puede ser un capítulo, un artículo, un relato corto, una descripción de producto... Tu equipo lo analizará con total honestidad."
                placeholderTextColor={colors.muted}
                style={[styles.textInput, { color: colors.foreground }]}
                textAlignVertical="top"
                returnKeyType="default"
                scrollEnabled={false}
              />
            </Pressable>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: wordCount >= MIN_WORDS ? colors.success : colors.muted }]}>
                  {wordCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>palabras</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.muted }]}>{charCount}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>caracteres</Text>
              </View>
              <Pressable
                onPress={handlePickFile}
                style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}
              >
                <IconSymbol name="paperclip" size={18} color={colors.muted} />
              </Pressable>
              <Pressable
                onPress={handlePaste}
                style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}
              >
                <IconSymbol name="doc.on.clipboard" size={18} color={colors.muted} />
              </Pressable>
              {currentText.length > 0 && (
                <Pressable
                  onPress={handleClear}
                  style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.6 }]}
                >
                  <IconSymbol name="xmark.circle.fill" size={20} color={colors.muted} />
                </Pressable>
              )}
            </View>

            {wordCount > 0 && wordCount < MIN_WORDS && (
              <Text style={[styles.warningText, { color: colors.warning }]}>
                Necesitas al menos {MIN_WORDS} palabras para un análisis completo.
              </Text>
            )}
          </View>

          {/* Team Preview */}
          <View style={styles.teamPreview}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>EL EQUIPO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamScroll}>
              {TEAM_MEMBERS.map((member) => (
                <View
                  key={member.id}
                  style={[styles.memberChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <Text style={styles.memberEmoji}>{member.emoji}</Text>
                  <Text style={[styles.memberName, { color: colors.foreground }]}>{member.shortName}</Text>
                  <Text style={[styles.memberRole, { color: colors.muted }]}>{member.role}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => [
                styles.submitBtn,
                {
                  backgroundColor: canSubmit ? colors.primary : colors.border,
                  transform: [{ scale: pressed && canSubmit ? 0.97 : 1 }],
                },
              ]}
            >
              <IconSymbol name="paperplane.fill" size={20} color={canSubmit ? colors.accent : colors.muted} />
              <Text style={[styles.submitText, { color: canSubmit ? colors.accent : colors.muted }]}>
                Enviar al equipo editorial
              </Text>
            </Pressable>

            <Text style={[styles.disclaimerText, { color: colors.muted }]}>
              Tu equipo analizará el texto con sinceridad absoluta. Sin filtros, sin halagos vacíos.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const TEAM_MEMBERS = [
  { id: "corrector",   emoji: "✍️", shortName: "Elena",   role: "Correctora" },
  { id: "analyst",     emoji: "🔍", shortName: "Marco",   role: "Analista" },
  { id: "editor",      emoji: "📝", shortName: "Sophia",  role: "Editora" },
  { id: "translator",  emoji: "🌐", shortName: "Hiroshi", role: "Traductor" },
  { id: "kdp",         emoji: "📚", shortName: "Rachel",  role: "KDP" },
  { id: "marketing",   emoji: "📊", shortName: "Diego",   role: "Marketing" },
  { id: "illustrator", emoji: "🎨", shortName: "Amara",   role: "Arte" },
  { id: "economist",   emoji: "💰", shortName: "Carlos",  role: "Economista" },
  { id: "rewriter",    emoji: "🔄", shortName: "Reescr.", role: "Reescritura" },
  { id: "antiAi",      emoji: "🛡️", shortName: "Anti-IA", role: "Autenticidad" },
];

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  inputSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  textAreaContainer: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    minHeight: 200,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 26,
    minHeight: 180,
    fontWeight: "400",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "400",
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: "#E0DDD8",
  },
  actionBtn: {
    padding: 4,
  },
  clearBtn: {
    marginLeft: "auto",
  },
  warningText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: "500",
  },
  teamPreview: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  teamScroll: {
    marginHorizontal: -4,
  },
  memberChip: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 4,
    minWidth: 72,
    gap: 4,
  },
  memberEmoji: {
    fontSize: 22,
  },
  memberName: {
    fontSize: 12,
    fontWeight: "600",
  },
  memberRole: {
    fontSize: 10,
    fontWeight: "400",
  },
  submitSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  disclaimerText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
