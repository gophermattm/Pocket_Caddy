import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MapPin, Flag, Navigation, Layers } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHaptics } from "@/hooks/useHaptics";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { COLORS } from "@/constants";
import type { CourseHole, Hazard } from '@/types';

export default function CourseScreen() {
  const { triggerImpact } = useHaptics();

  const currentHole: CourseHole = {
    number: 7,
    par: 3,
    yardage: 106,
    frontDistance: 98,
    centerDistance: 106,
    backDistance: 115,
    hazards: [
      { name: "Front Bunker", distance: 92, type: "bunker" },
      { name: "Water (Left)", distance: 85, type: "water" },
      { name: "Back Bunker", distance: 118, type: "bunker" },
    ],
    notes: "Iconic par 3 with ocean views. Wind is the main defense. Club up in afternoon breeze. Bail out right if needed."
  };

  const handleHoleSelect = (hole: number) => {
    triggerImpact();
    console.log(`Selected hole ${hole}`);
    // In a real app, this would navigate to hole details or update current hole
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.courseHeader}>
            <MapPin size={20} color={COLORS.primary} />
            <Text style={styles.courseName}>Pebble Beach Golf Links</Text>
          </View>

          <View style={styles.currentHoleCard}>
            <View style={styles.holeInfo}>
              <Text style={styles.holeNumber}>Hole {currentHole.number}</Text>
              <Text style={styles.holePar}>Par {currentHole.par} • {currentHole.yardage} yards</Text>
            </View>
            <View style={styles.distanceGrid}>
              <View style={styles.distanceItem}>
                <Flag size={16} color={COLORS.text.secondary} />
                <Text style={styles.distanceLabel}>Front</Text>
                <Text style={styles.distanceValue}>{currentHole.frontDistance}</Text>
              </View>
              <View style={styles.distanceItem}>
                <Navigation size={16} color={COLORS.primary} />
                <Text style={styles.distanceLabel}>Center</Text>
                <Text style={styles.distanceValue}>{currentHole.centerDistance}</Text>
              </View>
              <View style={styles.distanceItem}>
                <Flag size={16} color={COLORS.text.secondary} />
                <Text style={styles.distanceLabel}>Back</Text>
                <Text style={styles.distanceValue}>{currentHole.backDistance}</Text>
              </View>
            </View>
          </View>

          <View style={styles.holeSelector}>
            <Text style={styles.sectionTitle}>Select Hole</Text>
            <View style={styles.holeGrid}>
              {Array.from({ length: 18 }, (_, i) => (
                <TouchableOpacity
                  key={i + 1}
                  style={[
                    styles.holeButton,
                    i + 1 === currentHole.number && styles.holeButtonActive
                  ]}
                  onPress={() => handleHoleSelect(i + 1)}
                >
                  <Text style={[
                    styles.holeButtonText,
                    i + 1 === currentHole.number && styles.holeButtonTextActive
                  ]}>
                    {i + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.hazardsCard}>
            <View style={styles.cardHeader}>
              <Layers size={20} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Hazards</Text>
            </View>
            <View style={styles.hazardsList}>
              {currentHole.hazards.map((hazard: Hazard, index: number) => (
                <View key={`${hazard.name}-${index}`} style={styles.hazardItem}>
                  <Text style={styles.hazardName}>{hazard.name}</Text>
                  <Text style={styles.hazardDistance}>{hazard.distance} yds</Text>
                </View>
              ))}
            </View>
          </View>

          {currentHole.notes && (
            <View style={styles.notesCard}>
              <Text style={styles.cardTitle}>Hole Notes</Text>
              <Text style={styles.notesText}>{currentHole.notes}</Text>
            </View>
          )}
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
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  currentHoleCard: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  holeInfo: {
    marginBottom: 20,
  },
  holeNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  holePar: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  distanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  distanceItem: {
    alignItems: 'center',
  },
  distanceLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  distanceValue: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: 4,
  },
  holeSelector: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.light,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingInfo: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
  },
  dangerButtonText: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  version: {
    fontSize: 14,
    color: COLORS.text.light,
  },
  copyright: {
    fontSize: 12,
    color: COLORS.text.light,
    marginTop: 4,
  },
});