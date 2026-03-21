import {
  FlatList,
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
import { useEditorial, type TextEntry } from "@/lib/editorial-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Hoy, ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
  } else if (diffDays === 1) {
    return `Ayer, ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
  } else {
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  }
}

export default function HistoryScreen() {
  const colors = useColors();
  const router = useRouter();
  const { history, loadFromHistory, removeFromHistory } = useEditorial();

  const handleLoad = (entry: TextEntry) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    loadFromHistory(entry);
    router.push("/team" as any);
  };

  const handleDelete = (entry: TextEntry) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      "Eliminar texto",
      "¿Quieres eliminar este texto del historial?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => removeFromHistory(entry.id),
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: TextEntry }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Pressable
        onPress={() => handleLoad(item)}
        style={({ pressed }) => [styles.cardContent, pressed && { opacity: 0.75 }]}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={[styles.wordBadge, { backgroundColor: colors.primary + "15" }]}>
            <Text style={[styles.wordCount, { color: colors.primary }]}>
              {item.wordCount} pal.
            </Text>
          </View>
        </View>
        <Text style={[styles.cardPreview, { color: colors.muted }]} numberOfLines={2}>
          {item.text.slice(0, 120)}...
        </Text>
        <View style={styles.cardFooter}>
          <IconSymbol name="clock.fill" size={12} color={colors.muted} />
          <Text style={[styles.cardDate, { color: colors.muted }]}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </Pressable>

      <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={() => handleLoad(item)}
          style={({ pressed }) => [
            styles.actionBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <IconSymbol name="person.3.fill" size={14} color={colors.accent} />
          <Text style={[styles.actionBtnText, { color: colors.accent }]}>
            Enviar al equipo
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleDelete(item)}
          style={({ pressed }) => [
            styles.deleteBtn,
            { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <IconSymbol name="trash" size={16} color={colors.error} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Historial</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {history.length > 0
            ? `${history.length} texto${history.length !== 1 ? "s" : ""} guardado${history.length !== 1 ? "s" : ""}`
            : "Sin textos aún"}
        </Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Sin historial
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.muted }]}>
            Los textos que envíes al equipo editorial aparecerán aquí para que puedas volver a analizarlos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  wordBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexShrink: 0,
  },
  wordCount: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardPreview: {
    fontSize: 13,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  cardDate: {
    fontSize: 12,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderTopWidth: 0.5,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  deleteBtn: {
    padding: 9,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
    paddingBottom: 80,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
});
