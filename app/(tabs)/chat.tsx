import {
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useEditorial } from "@/lib/editorial-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { trpc } from "@/lib/trpc";

interface ChatMessage {
  id: string;
  role: "user" | "specialist";
  specialist?: string;
  content: string;
  timestamp: number;
}

const CHAT_SPECIALISTS = [
  { id: "corrector", name: "Elena Voss", emoji: "✍️", color: "#4A7C59" },
  { id: "analyst", name: "Marco Reyes", emoji: "🔍", color: "#2E4A7C" },
  { id: "editor", name: "Sophia Laurent", emoji: "📝", color: "#7C2E4A" },
  { id: "translator", name: "Hiroshi Tanaka", emoji: "🌐", color: "#4A4A7C" },
  { id: "kdp", name: "Rachel Stone", emoji: "📚", color: "#7C5A2E" },
  { id: "marketing", name: "Diego Vargas", emoji: "📊", color: "#2E7C5A" },
  { id: "illustrator", name: "Amara Osei", emoji: "🎨", color: "#7C2E2E" },
  { id: "economist", name: "Carlos Mendez", emoji: "💰", color: "#5A7C2E" },
];

export default function ChatScreen() {
  const colors = useColors();
  const { currentText } = useEditorial();
  const [selectedSpecialist, setSelectedSpecialist] = useState("corrector");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const chatMutation = trpc.editorial.analyze.useMutation();

  const hasText = currentText.trim().length > 0;
  const specialist = CHAT_SPECIALISTS.find((s) => s.id === selectedSpecialist);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !hasText) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsLoading(true);

    try {
      const userContext = `Pregunta del usuario: ${userMessage.content}\n\nContexto del texto: ${currentText.slice(0, 500)}...`;
      const response = await chatMutation.mutateAsync({
        text: userContext,
        specialistId: selectedSpecialist as any,
      });

      const specialistMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "specialist",
        specialist: selectedSpecialist,
        content: response.result,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, specialistMessage]);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "specialist",
        specialist: selectedSpecialist,
        content: `Error: ${error?.message ?? "No se pudo conectar con el servidor"}`,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (!hasText) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={styles.emptyContainer}>
            <IconSymbol name="paperplane.fill" size={48} color={colors.muted} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Sin texto para analizar
          </Text>
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            Sube un texto en la pestaña Inicio para comenzar a chatear con el equipo.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        {/* Specialist Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.specialistScroll}
          contentContainerStyle={styles.specialistContainer}
        >
          {CHAT_SPECIALISTS.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => {
                setSelectedSpecialist(s.id);
                setMessages([]);
              }}
              style={({ pressed }) => [
                styles.specialistBtn,
                {
                  backgroundColor: selectedSpecialist === s.id ? s.color : colors.surface,
                  borderColor: selectedSpecialist === s.id ? s.color : colors.border,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
            >
              <Text style={styles.specialistEmoji}>{s.emoji}</Text>
              <Text
                style={[
                  styles.specialistName,
                  {
                    color:
                      selectedSpecialist === s.id ? colors.background : colors.foreground,
                  },
                ]}
              >
                {s.name.split(" ")[0]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <Text style={[styles.welcomeEmoji]}>{specialist?.emoji}</Text>
              <Text style={[styles.welcomeTitle, { color: colors.foreground }]}>
                {specialist?.name}
              </Text>
              <Text style={[styles.welcomeText, { color: colors.muted }]}>
                Haz una pregunta o pide aclaraciones sobre tu texto. {specialist?.name} te
                responderá con sinceridad.
              </Text>
            </View>
          )}

          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageWrapper,
                msg.role === "user" && styles.userMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.role === "user"
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.surface, borderColor: colors.border },
                  msg.role === "user" && { borderWidth: 0 },
                ]}
              >
                {msg.role === "specialist" && (
                  <Text style={[styles.specialistLabel, { color: specialist?.color }]}>
                    {specialist?.name}
                  </Text>
                )}
                {msg.role === "user" ? (
                  <Text style={[styles.messageText, { color: colors.accent }]}>
                    {msg.content}
                  </Text>
                ) : (
                  <MarkdownRenderer content={msg.content} />
                )}
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.accent} size="large" />
              <Text style={[styles.loadingText, { color: colors.muted }]}>
                {specialist?.name} está escribiendo...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
          <TextInput
            ref={inputRef}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Haz una pregunta..."
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <Pressable
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            style={({ pressed }) => [
              styles.sendBtn,
              {
                backgroundColor: inputText.trim() && !isLoading ? colors.primary : colors.border,
                transform: [{ scale: pressed && inputText.trim() ? 0.95 : 1 }],
              },
            ]}
          >
            <IconSymbol
              name="paperplane.fill"
              size={18}
              color={inputText.trim() && !isLoading ? colors.accent : colors.muted}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  specialistScroll: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0DDD8",
  },
  specialistContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  specialistBtn: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: 80,
    gap: 4,
  },
  specialistEmoji: {
    fontSize: 20,
  },
  specialistName: {
    fontSize: 11,
    fontWeight: "600",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
  },
  welcomeEmoji: {
    fontSize: 48,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  welcomeText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 280,
  },
  messageWrapper: {
    alignItems: "flex-start",
  },
  userMessageWrapper: {
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: "85%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  specialistLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
