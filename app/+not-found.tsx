import React from "react";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Home } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHaptics } from "@/hooks/useHaptics";
import { COLORS } from "@/constants";

export default function NotFoundScreen() {
  const router = useRouter();
  const { triggerImpact } = useHaptics();

  const handleGoHome = () => {
    triggerImpact();
    router.replace("/");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <Text style={styles.title}>This screen doesn't exist.</Text>
          <Text style={styles.message}>
            The page you're looking for could not be found.
          </Text>
          
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleGoHome}
          >
            <Home size={20} color={COLORS.text.white} />
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginBottom: 32,
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  homeButtonText: {
    color: COLORS.text.white,
    fontSize: 16,
    fontWeight: "600",
  },
});