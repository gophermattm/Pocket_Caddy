import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { 
  User, 
  Sliders, 
  Shield, 
  Bell, 
  ChevronRight,
  Smartphone,
  LogOut
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGolf } from "@/providers/GolfProvider";
import { useHaptics } from "@/hooks/useHaptics";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { COLORS } from "@/constants";
import { Feather as ExpoFeather } from "@expo/vector-icons";
import type { GolfSettings } from '@/types';

export default function SettingsScreen() {
  const { settings, updateSettings, error } = useGolf();
  const { triggerImpact } = useHaptics();

  const handleToggle = async (key: keyof GolfSettings, value: boolean) => {
    triggerImpact();
    try {
      await updateSettings({ [key]: value });
    } catch (updateError) {
      Alert.alert(
        "Settings Error",
        updateError instanceof Error ? updateError.message : "Failed to update settings"
      );
    }
  };

  const handleGreenSpeedChange = () => {
    Alert.alert(
      "Green Speed",
      "Select the typical speed of greens you play",
      [
        { text: "Slow (8-9)", onPress: () => updateSettings({ greenSpeed: "Slow" }) },
        { text: "Medium (9-11)", onPress: () => updateSettings({ greenSpeed: "Medium" }) },
        { text: "Fast (11+)", onPress: () => updateSettings({ greenSpeed: "Fast" }) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleUnitsChange = () => {
    Alert.alert(
      "Distance Units",
      "Select your preferred units",
      [
        { text: "Yards", onPress: () => updateSettings({ units: "yards" }) },
        { text: "Meters", onPress: () => updateSettings({ units: "meters" }) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => {
          // In a real app, this would handle sign out logic
          console.log("User signed out");
        }}
      ]
    );
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>Settings Error: {error}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <User size={20} color={COLORS.primary} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Account</Text>
                  <Text style={styles.settingValue}>john.doe@example.com</Text>
                </View>
              </View>
              <ChevronRight size={20} color={COLORS.text.light} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Green Reading</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Shield size={20} color={COLORS.primary} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Competition Mode</Text>
                  <Text style={styles.settingDescription}>
                    Disables visual aids for tournament play
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.competitionMode}
                onValueChange={(value) => handleToggle('competitionMode', value)}
                trackColor={{ false: '#ddd', true: COLORS.primary }}
                thumbColor={COLORS.surface}
              />
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={handleGreenSpeedChange}>
              <View style={styles.settingLeft}>
                <Sliders size={20} color={COLORS.primary} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Default Green Speed</Text>
                  <Text style={styles.settingValue}>{settings.greenSpeed}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={COLORS.text.light} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleUnitsChange}>
              <View style={styles.settingLeft}>
                <ExpoFeather name="info" size={20} color={COLORS.primary} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Distance Units</Text>
                  <Text style={styles.settingValue}>{settings.units}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={COLORS.text.light} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={COLORS.primary} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Voice Guidance</Text>
                  <Text style={styles.settingDescription}>
                    Audio cues for aim and pace
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.voiceGuidance}
                onValueChange={(value) => handleToggle('voiceGuidance', value)}
                trackColor={{ false: '#ddd', true: COLORS.primary }}
                thumbColor={COLORS.surface}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Smartphone size={20} color={COLORS.primary} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Haptic Feedback</Text>
                  <Text style={styles.settingDescription}>
                    Vibration for pace guidance
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(value) => handleToggle('hapticFeedback', value)}
                trackColor={{ false: '#ddd', true: COLORS.primary }}
                thumbColor={COLORS.surface}
              />
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut}>
              <LogOut size={20} color={COLORS.error} />
              <Text style={styles.dangerButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>Pocket Caddy v1.0.0</Text>
            <Text style={styles.copyright}>© 2025 Rork</Text>
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
  errorBanner: {
    backgroundColor: COLORS.error,
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: COLORS.text.white,
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.surface,
    marginTop: 16,
    paddingVertical: 8,
  },
  const styles = StyleSheet.create({
    row: {
      paddingVertical: 8,
    }, // ← ensure this comma exists
    sectionTitle: {
      fontSize: 12,
      fontWeight: "600",
      color: "#999",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 8,
    },
  });