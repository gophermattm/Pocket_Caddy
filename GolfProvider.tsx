import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { DEFAULT_GOLF_SETTINGS, STORAGE_KEYS } from '@/constants';
import type { GolfSettings, ScanResult, GolfContextType } from '@/types';

export const [GolfProvider, useGolf] = createContextHook<GolfContextType>(() => {
  const [settings, setSettings] = useState<GolfSettings>(DEFAULT_GOLF_SETTINGS);
  const [lastReading, setLastReading] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.GOLF_SETTINGS);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        // Validate settings and merge with defaults
        const validatedSettings: GolfSettings = {
          ...DEFAULT_GOLF_SETTINGS,
          ...parsedSettings,
        };
        setSettings(validatedSettings);
      }
    } catch (loadError) {
      const errorMessage = loadError instanceof Error ? loadError.message : "Failed to load settings";
      console.error("Failed to load settings:", loadError);
      setError(errorMessage);
      // Use default settings on error
      setSettings(DEFAULT_GOLF_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = useCallback(async (updates: Partial<GolfSettings>) => {
    try {
      setError(null);
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      
      await AsyncStorage.setItem(STORAGE_KEYS.GOLF_SETTINGS, JSON.stringify(newSettings));
    } catch (saveError) {
      const errorMessage = saveError instanceof Error ? saveError.message : "Failed to save settings";
      console.error("Failed to save settings:", saveError);
      setError(errorMessage);
      // Revert settings on error
      throw new Error(errorMessage);
    }
  }, [settings]);

  const updateLastReading = useCallback((reading: ScanResult) => {
    const readingWithTimestamp = {
      ...reading,
      timestamp: Date.now(),
    };
    setLastReading(readingWithTimestamp);
    
    // Optionally persist last reading
    AsyncStorage.setItem(STORAGE_KEYS.LAST_READING, JSON.stringify(readingWithTimestamp))
      .catch(error => console.warn("Failed to save last reading:", error));
  }, []);

  const contextValue = useMemo(() => ({
    settings,
    updateSettings,
    lastReading,
    updateLastReading,
    isLoading,
    error,
  }), [settings, updateSettings, lastReading, updateLastReading, isLoading, error]);

  return contextValue;
});