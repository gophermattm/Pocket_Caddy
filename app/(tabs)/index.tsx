import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { 
  Camera, 
  Wind, 
  Droplets, 
  Thermometer,
  Activity,
  ChevronRight,
  Info
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGolf } from "@/providers/GolfProvider";
import { useWeather } from "@/hooks/useWeather";
import { useHaptics } from "@/hooks/useHaptics";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { COLORS, GOLF_TIPS } from "@/constants";

export default function GreenReaderHome() {
  const router = useRouter();
  const { settings, lastReading, isLoading: settingsLoading, error: settingsError } = useGolf();
  const { weather, isLoading: weatherLoading, error: weatherError } = useWeather();
  const { triggerImpact } = useHaptics();
  const [quickTip, setQuickTip] = useState<string>("");

  useEffect(() => {
    setQuickTip(GOLF_TIPS[Math.floor(Math.random() * GOLF_TIPS.length)]);
  }, []);

  const handleStartReading = () => {
    triggerImpact();
    router.push("/green-reader");
  };

  const handleQuickCalibration = () => {
    triggerImpact();
    router.push("/calibration");
  };

  if (settingsLoading) {
    return <LoadingSpinner message="Loading settings..." />;
  }

  if (settingsError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading settings: {settingsError}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={[COLORS.primaryDark, COLORS.secondary]}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>Ready to Read</Text>
              <Text style={styles.subGreeting}>
                {settings.competitionMode ? "Competition Mode" : "Practice Mode"}
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.mainContent}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStartReading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.buttonGradient}
              >
                <Camera size={32} color={COLORS.text.white} />
                <Text style={styles.buttonText}>Start Green Reading</Text>
                <ChevronRight size={24} color={COLORS.text.white} />
              </LinearGradient>
            </TouchableOpacity>

            {lastReading && (
              <View style={styles.lastReadingCard}>
                <Text style={styles.cardTitle}>Last Reading</Text>
                <View style={styles.readingStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Aim</Text>
                    <Text style={styles.statValue}>
                      {lastReading.aimOffset}″ {lastReading.aimDirection}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Pace</Text>
                    <Text style={styles.statValue}>{lastReading.pace}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Slope</Text>
                    <Text style={styles.statValue}>{lastReading.slope}%</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.weatherCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Current Conditions</Text>
                {weatherLoading && <Text style={styles.loadingText}>Updating...</Text>}
                {weatherError && <Text style={styles.errorText}>Failed to load</Text>}
              </View>
              <View style={styles.weatherGrid}>
                <View style={styles.weatherItem}>
                  <Thermometer size={20} color={COLORS.primary} />
                  <Text style={styles.weatherValue}>{weather?.temp || "--"}°</Text>
                  <Text style={styles.weatherLabel}>Temp</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Wind size={20} color={COLORS.primary} />
                  <Text style={styles.weatherValue}>{weather?.windSpeed || "--"}</Text>
                  <Text style={styles.weatherLabel}>mph</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Droplets size={20} color={COLORS.primary} />
                  <Text style={styles.weatherValue}>{weather?.humidity || "--"}%</Text>
                  <Text style={styles.weatherLabel}>Humidity</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Activity size={20} color={COLORS.primary} />
                  <Text style={styles.weatherValue}>{settings.greenSpeed}</Text>
                  <Text style={styles.weatherLabel}>Stimp</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.calibrationButton}
              onPress={handleQuickCalibration}
            >
              <View style={styles.calibrationContent}>
                <View>
                  <Text style={styles.calibrationTitle}>Quick Calibration</Text>
                  <Text style={styles.calibrationSubtitle}>
                    Improve accuracy with a test putt
                  </Text>
                </View>
                <ChevronRight size={20} color={COLORS.primary} />
              </View>
            </TouchableOpacity>

            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Info size={16} color={COLORS.primary} />
                <Text style={styles.tipTitle}>Pro Tip</Text>
              </View>
              <Text style={styles.tipText}>{quickTip}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.white,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: COLORS.accent,
  },
  mainContent: {
    padding: 20,
    marginTop: -20,
  },
  primaryButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.white,
    flex: 1,
    marginLeft: 16,
  },
  lastReadingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  readingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  weatherCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.text.light,
  },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weatherItem: {
    alignItems: 'center',
  },
  weatherValue: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: 8,
  },
  weatherLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  calibrationButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  calibrationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calibrationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  calibrationSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  tipCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    textAlign: 'center',
  },
});