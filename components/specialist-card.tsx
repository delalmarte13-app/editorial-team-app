import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { SpecialistId, SpecialistStatus } from "@/lib/editorial-context";

interface SpecialistCardProps {
  id: SpecialistId;
  name: string;
  role: string;
  emoji: string;
  description: string;
  accentColor: string;
  status: SpecialistStatus;
  disabled?: boolean;
  onPress: () => void;
}

export function SpecialistCard({
  name,
  role,
  emoji,
  description,
  accentColor,
  status,
  disabled,
  onPress,
}: SpecialistCardProps) {
  const colors = useColors();

  const statusColor =
    status === "ready"
      ? colors.success
      : status === "analyzing"
      ? colors.accent
      : status === "error"
      ? colors.error
      : colors.border;

  const statusLabel =
    status === "ready"
      ? "Listo"
      : status === "analyzing"
      ? "Analizando..."
      : status === "error"
      ? "Error"
      : "En espera";

  const handlePress = () => {
    if (disabled) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: status === "ready" ? colors.success : status === "analyzing" ? colors.accent : colors.border,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !disabled ? 0.97 : 1 }],
        },
      ]}
    >
      {/* Status indicator dot */}
      <View style={[styles.statusDot, { backgroundColor: statusColor }]} />

      {/* Emoji avatar */}
      <View style={[styles.emojiWrap, { backgroundColor: accentColor + "18" }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      {/* Text info */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]}>{name}</Text>
        <Text style={[styles.role, { color: accentColor }]}>{role}</Text>
        <Text style={[styles.desc, { color: colors.muted }]} numberOfLines={2}>
          {description}
        </Text>
      </View>

      {/* Right side */}
      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: statusColor + "18" }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
        {!disabled && (
          <IconSymbol name="chevron.right" size={14} color={colors.muted} style={{ marginTop: 6 }} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 12,
    position: "relative",
  },
  statusDot: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  emojiWrap: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  emoji: {
    fontSize: 26,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  role: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  desc: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
    gap: 4,
    flexShrink: 0,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
