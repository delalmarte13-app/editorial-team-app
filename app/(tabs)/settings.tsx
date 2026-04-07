import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
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

  const handleResetCredits = async () => {
    Alert.alert(
      "Confirmar",
      "¿Deseas resetear los créditos a los valores por defecto?",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Resetear",
          onPress: async () => {
            const updated = await resetCredits();
            setCredits(updated);
            setOfflineModeState(false);
            Alert.alert("Éxito", "Créditos reseteados");
          },
        },
      ]
    );
  };

  if (loading || !credits) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">Cargando configuración...</Text>
      </ScreenContainer>
    );
  }

  const geminiPercentage =
    (credits.gemini.available / credits.gemini.limit) * 100;
  const mondoPercentage =
    (credits.mondongo.available / credits.mondongo.limit) * 100;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Configuración
            </Text>
            <Text className="text-base text-muted">
              Gestiona créditos y preferencias
            </Text>
          </View>

          {/* Créditos Gemini */}
          <View className="bg-surface rounded-2xl p-6 gap-4">
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">🔮</Text>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                  Gemini API
                </Text>
                <Text className="text-sm text-muted">
                  {credits.gemini.status === "exhausted"
                    ? "Sin créditos"
                    : credits.gemini.status === "limited"
                      ? "Créditos bajos"
                      : "Activo"}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  credits.gemini.status === "exhausted"
                    ? "bg-error/20"
                    : credits.gemini.status === "limited"
                      ? "bg-warning/20"
                      : "bg-success/20"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    credits.gemini.status === "exhausted"
                      ? "text-error"
                      : credits.gemini.status === "limited"
                        ? "text-warning"
                        : "text-success"
                  }`}
                >
                  {credits.gemini.available}/{credits.gemini.limit}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="gap-2">
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full bg-tint"
                  style={{ width: `${geminiPercentage}%` }}
                />
              </View>
              <Text className="text-xs text-muted">
                {geminiPercentage.toFixed(0)}% disponible
              </Text>
            </View>
          </View>

          {/* Créditos Mondongo */}
          <View className="bg-surface rounded-2xl p-6 gap-4">
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">🗄️</Text>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                  Mondongo DB
                </Text>
                <Text className="text-sm text-muted">
                  {credits.mondongo.status === "exhausted"
                    ? "Sin créditos"
                    : credits.mondongo.status === "limited"
                      ? "Créditos bajos"
                      : "Activo"}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  credits.mondongo.status === "exhausted"
                    ? "bg-error/20"
                    : credits.mondongo.status === "limited"
                      ? "bg-warning/20"
                      : "bg-success/20"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    credits.mondongo.status === "exhausted"
                      ? "text-error"
                      : credits.mondongo.status === "limited"
                        ? "text-warning"
                        : "text-success"
                  }`}
                >
                  {credits.mondongo.available}/{credits.mondongo.limit}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="gap-2">
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full bg-tint"
                  style={{ width: `${mondoPercentage}%` }}
                />
              </View>
              <Text className="text-xs text-muted">
                {mondoPercentage.toFixed(0)}% disponible
              </Text>
            </View>
          </View>

          {/* Modo Offline */}
          <View className="bg-surface rounded-2xl p-6 gap-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-2xl">🛡️</Text>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">
                    Modo Offline
                  </Text>
                  <Text className="text-sm text-muted">
                    {offlineMode
                      ? "Activo - Sin conexión requerida"
                      : "Inactivo - Requiere conexión"}
                  </Text>
                </View>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={handleOfflineModeToggle}
                trackColor={{ false: colors.border, true: colors.tint }}
                thumbColor={offlineMode ? colors.background : colors.muted}
              />
            </View>

            <Text className="text-xs text-muted leading-relaxed">
              Cuando está activado, la app usa análisis locales sin necesidad de
              conectar a APIs. Perfecto cuando se agotan los créditos.
            </Text>
          </View>

          {/* Información */}
          <View className="bg-surface rounded-2xl p-6 gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Información
            </Text>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Versión de la app:</Text>
                <Text className="text-sm font-medium text-foreground">
                  1.0.0
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Especialistas:</Text>
                <Text className="text-sm font-medium text-foreground">10</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Último actualizado:</Text>
                <Text className="text-sm font-medium text-foreground">
                  {new Date(credits.gemini.lastUpdated).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Botón de Reset */}
          <Pressable
            onPress={handleResetCredits}
            style={({ pressed }) => [
              {
                backgroundColor: colors.error,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-xl p-4 items-center"
          >
            <Text className="text-white font-semibold">Resetear Créditos</Text>
          </Pressable>

          <View className="h-6" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
