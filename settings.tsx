import React from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useGolf } from '@/providers/GolfProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { COLORS } from '@/constants';

export default function SettingsScreen() {
  const { settings, updateSettings, isLoading, error } = useGolf();

  const toggle = (key: keyof typeof settings) => async (value: boolean) => {
    try { await updateSettings({ [key]: value } as any); }
    catch { Alert.alert('Error', 'Failed to update setting.'); }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.header}>Settings</Text>
          {error ? (
            <View style={styles.errorBanner}>
              <Feather name="alert-triangle" size={16} color={COLORS.text.white} />
              <Text style={styles.errorText}>{String(error)}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="sliders" size={18} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>General</Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Feather name="bell" size={18} color={COLORS.primary} />
                <Text style={styles.settingLabel}>Haptics</Text>
              </View>
              <Switch value={settings?.hapticsEnabled ?? true} onValueChange={toggle('hapticsEnabled')} />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Feather name="shield" size={18} color={COLORS.primary} />
                <Text style={styles.settingLabel}>Competition Mode</Text>
              </View>
              <Switch value={settings?.competitionMode ?? false} onValueChange={toggle('competitionMode')} />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="map-pin" size={18} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>

            <TouchableOpacity style={styles.navRow} onPress={() => Alert.alert('Location', 'Uses device GPS for weather & altitude.')}>
              <View style={styles.settingLeft}>
                <Feather name="sun" size={18} color={COLORS.primary} />
                <Text style={styles.settingLabel}>Weather Access</Text>
              </View>
              <Feather name="chevron-right" size={18} color={COLORS.text.light} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>Pocket Caddy (POC)</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  header: { fontSize: 24, fontWeight: '700', color: COLORS.text.primary, marginBottom: 12 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.error, padding: 12, borderRadius: 8, marginBottom: 12 },
  errorText: { color: COLORS.text.white },
  section: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text.secondary },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingLabel: { fontSize: 16, color: COLORS.text.primary },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  footer: { alignItems: 'center', paddingVertical: 24 },
  version: { color: COLORS.text.light }
});
