import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GolfProvider } from "@/providers/GolfProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { COLORS } from "@/constants";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: COLORS.surface,
      },
      headerTintColor: COLORS.text.primary,
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="green-reader" 
        options={{ 
          presentation: "fullScreenModal",
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="calibration" 
        options={{ 
          presentation: "modal",
          title: "Calibration",
          headerStyle: {
            backgroundColor: COLORS.primaryDark,
          },
          headerTintColor: COLORS.text.white,
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GolfProvider>
            <RootLayoutNav />
          </GolfProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}