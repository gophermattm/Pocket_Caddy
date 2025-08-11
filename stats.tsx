import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { COLORS } from "@/constants";

interface PuttRecord {
  distance: number;
  made: boolean;
  break: string;
  date: string;
  id: string;
}

interface StatsData {
  totalReads: number;
  avgAccuracy: number;
  improvementRate: number;
  successRate: number;
}

export default function StatsScreen() {
  const stats: StatsData = {
    totalReads: 47,
    avgAccuracy: 82,
    improvementRate: 12,
    successRate: 76,
  };

  const weeklyPerformance = [65, 72, 68, 78, 82, 85, 82];
  const weekLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const recentPutts: PuttRecord[] = [
    { id: '1', distance: 8, made: true, break: "4″ L", date: "Today" },
    { id: '2', distance: 12, made: false, break: "8″ R", date: "Today" },
    { id: '3', distance: 6, made: true, break: "2″ L", date: "Yesterday" },
    { id: '4', distance: 15, made: true, break: "12″ R", date: "Yesterday" },
    { id: '5', distance: 10, made: false, break: "6″ L", date: "2 days ago" },
  ];

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Feather name="target" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>{stats.totalReads}</Text>
              <Text style={styles.statLabel}>Total Reads</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="percent" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>{stats.avgAccuracy}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="trending-up" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>+{stats.improvementRate}%</Text>
              <Text style={styles.statLabel}>Improvement</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="award" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>{stats.successRate}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Putting Performance</Text>
            <View style={styles.chart}>
              <View style={styles.chartBars}>
                {weeklyPerformance.map((height, i) => (
                  <View key={`bar-${i}`} style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { height: `${height}%` }
                      ]} 
                    />
                    <Text style={styles.barLabel}>
                      {weekLabels[i]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.recentCard}>
            <Text style={styles.sectionTitle}>Recent Putts</Text>
            {recentPutts.map((putt: PuttRecord) => (
              <View key={putt.id} style={styles.puttItem}>
                <View style={styles.puttInfo}>
                  <View style={[
                    styles.puttIndicator,
                    { backgroundColor: putt.made ? COLORS.success : COLORS.error }
                  ]} />
                  <View>
                    <Text style={styles.puttDistance}>{putt.distance} ft</Text>
                    <Text style={styles.puttBreak}>Break: {putt.break}</Text>
                  </View>
                </View>
                <View style={styles.puttMeta}>
                  <Text style={[
                    styles.puttResult,
                    { color: putt.made ? COLORS.success : COLORS.error }
                  ]}>
                    {putt.made ? 'Made' : 'Missed'}
                  </Text>
                  <Text style={styles.puttDate}>{putt.date}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Key Insight</Text>
            <Text style={styles.insightText}>
              You're 15% more accurate on putts under 10 feet when reading 
              left-to-right breaks. Focus on right-to-left reads for improvement.
            </Text>
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
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  chartCard: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  chart: {
    height: 150,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  recentCard: {
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
  puttItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  puttInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puttIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  puttDistance: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  puttBreak: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  puttMeta: {
    alignItems: 'flex-end',
  },
  puttResult: {
    fontSize: 14,
    fontWeight: '600',
  },
  puttDate: {
    fontSize: 12,
    color: COLORS.text.light,
    marginTop: 2,
  },
  insightCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 20,
  },
});