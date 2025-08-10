import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { 
  Ruler, 
  Target,
  CheckCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGolf } from "@/providers/GolfProvider";
import { useHaptics } from "@/hooks/useHaptics";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { COLORS } from "@/constants";
import { Feather as ExpoFeather } from "@expo/vector-icons";
import type { GolfSettings } from '@/types';

export default function CalibrationScreen() {
  const router = useRouter();
  const { updateSettings } = useGolf();
  const { triggerNotification } = useHaptics();
  const [putterLength, setPutterLength] = useState("35");
  const [testDistance, setTestDistance] = useState("6");
  const [actualRoll, setActualRoll] = useState("");
  const [isCalibrating, setIsCalibrating] = useState(false);

  const validateInputs = (): boolean => {
    if (!actualRoll.trim()) {
      Alert.alert("Missing Data", "Please enter the actual roll distance");
      return false;
    }

    const putterNum = parseFloat(putterLength);
    const testNum = parseFloat(testDistance);
    const actualNum = parseFloat(actualRoll);

    if (isNaN(putterNum) || putterNum <= 0 || putterNum > 60) {
      Alert.alert("Invalid Input", "Please enter a valid putter length (1-60 inches)");
      return false;
    }

    if (isNaN(testNum) || testNum <= 0 || testNum > 50) {
      Alert.alert("Invalid Input", "Please enter a valid test distance (1-50 feet)");
      return false;
    }

    if (isNaN(actualNum) || actualNum <= 0 || actualNum > 100) {
      Alert.alert("Invalid Input", "Please enter a valid actual roll distance");
      return false;
    }

    return true;
  };

  const handleCalibrate = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsCalibrating(true);

    try {
      // Calculate green speed based on test putt
      const expected = parseFloat(testDistance);
      const actual = parseFloat(actualRoll);
      const ratio = actual / expected;
      
      let greenSpeed: GolfSettings['greenSpeed'] = "Medium";
      if (ratio < 0.9) {
        greenSpeed = "Slow";
      } else if (ratio > 1.1) {
        greenSpeed = "Fast";
      }
      
      await updateSettings({ 
        greenSpeed,
        putterLength: parseFloat(putterLength)
      });

      triggerNotification();

      Alert.alert(
        "Calibration Complete",
        `Green speed adjusted to ${greenSpeed}\nPutter length set to ${putterLength}″`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(
        "Calibration Failed",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsCalibrating(false);
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Quick Calibration</Text>
            <Text style={styles.subtitle}>
              Improve accuracy with a simple test putt
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ruler size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Step 1: Putter Length</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Enter your putter length for distance calibration
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={putterLength}
                onChangeText={setPutterLength}
                keyboardType="numeric"
                placeholder="35"
                placeholderTextColor={COLORS.text.light}
              />
              <Text style={styles.inputUnit}>inches</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Step 2: Test Putt</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Hit a straight putt on level ground
            </Text>
            
            <View style={styles.testSetup}>
              <Text style={styles.testLabel}>Test Distance</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={testDistance}
                  onChangeText={setTestDistance}
                  keyboardType="numeric"
                  placeholder="6"
                  placeholderTextColor={COLORS.text.light}
                />
                <Text style={styles.inputUnit}>feet</Text>
              </View>
            </View>

            <View style={styles.instruction}>
              <ExpoFeather name="info" size={20} color={COLORS.primary} />
              <Text style={styles.instructionText}>
                Place a ball {testDistance} feet from a target and putt with your normal stroke
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckCircle size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Step 3: Measure Result</Text>
            </View>
            <Text style={styles.sectionDescription}>
              How far did the ball actually roll?
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={actualRoll}
                onChangeText={setActualRoll}
                keyboardType="numeric"
                placeholder="Enter distance"
                placeholderTextColor={COLORS.text.light}
              />
              <Text style={styles.inputUnit}>feet</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.calibrateButton,
              isCalibrating && styles.calibrateButtonDisabled
            ]}
            onPress={handleCalibrate}
            disabled={isCalibrating}
          >
            <Text style={styles.calibrateButtonText}>
              {isCalibrating ? "Calibrating..." : "Complete Calibration"}
            </Text>
          </TouchableOpacity>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Pro Tip</Text>
            <Text style={styles.tipText}>
              Perform calibration at the start of each round for best results. 
              Green speeds can vary significantly between courses and weather conditions.
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
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginTop: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: COLORS.text.primary,
  },
  inputUnit: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginLeft: 8,
  },
  testSetup: {
    marginBottom: 16,
  },
  testLabel: {
    fontSize: 14,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  instruction: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.secondary,
    marginLeft: 8,
    lineHeight: 20,
  },
  calibrateButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  calibrateButtonDisabled: {
    backgroundColor: COLORS.text.light,
  },
  calibrateButtonText: {
    color: COLORS.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: '#e8f5e9',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 20,
  },
});