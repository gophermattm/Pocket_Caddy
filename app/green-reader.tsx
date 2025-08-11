import { Feather } from "@expo/vector-icons";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGolf } from "@/providers/GolfProvider";
import { useSensors } from "@/hooks/useSensors";
import { useHaptics } from "@/hooks/useHaptics";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { supportsCamera } from '@/utils/platform';
import { SCAN_DURATION, COLORS } from "@/constants";
import type { ScanResult } from '@/types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GreenReaderScreen() {
  const router = useRouter();
  const { updateLastReading } = useGolf();
  const { sensorData, error: sensorError } = useSensors();
  const { triggerImpact, triggerNotification } = useHaptics();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isScanning, pulseAnim]);

  const mockScanResult = useMemo((): ScanResult => ({
    aimOffset: Math.floor(Math.random() * 12) + 2,
    aimDirection: (Math.random() > 0.5 ? "L" : "R") as "L" | "R",
    pace: ["Soft", "Medium", "Firm"][Math.floor(Math.random() * 3)],
    slope: sensorData.slope.toFixed(1),
    confidence: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
    distance: Math.floor(Math.random() * 10) + 6,
    timestamp: Date.now(),
  }), [sensorData.slope]);

  if (!supportsCamera()) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackText}>
            Camera preview not available on web
          </Text>
          <TouchableOpacity style={styles.mockScanButton} onPress={handleMockScan}>
            <Text style={styles.mockScanButtonText}>Simulate Green Scan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission) {
    return <LoadingSpinner message="Checking camera permissions..." />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Camera access is required for green reading
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  function handleMockScan() {
    handleScan();
  }

  const handleScan = () => {
    triggerImpact();
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setScanResult(mockScanResult);
      setIsScanning(false);
      
      updateLastReading(mockScanResult);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      triggerNotification();
    }, SCAN_DURATION);
  };

  const handleRescan = () => {
    triggerImpact();
    setScanResult(null);
    fadeAnim.setValue(0);
  };

  const handleClose = () => {
    triggerImpact();
    router.back();
  };

  const handleAccept = () => {
    triggerImpact();
    router.back();
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <CameraView style={styles.camera} facing="back">
          <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <X size={28} color={COLORS.text.white} />
              </TouchableOpacity>
              
              <View style={styles.slopeIndicator}>
                <Text style={styles.slopeLabel}>Slope</Text>
                <Text style={styles.slopeValue}>
                  {sensorData.slope.toFixed(1)}%
                </Text>
                {sensorError && (
                  <Text style={styles.sensorError}>Sensor Error</Text>
                )}
              </View>
            </View>

            {!scanResult && (
              <View style={styles.frameContainer}>
                <View style={styles.frame}>
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />
                  
                  <View style={styles.centerGuide}>
                    <Circle size={24} color={COLORS.text.white} strokeWidth={2} />
                    <Text style={styles.guideText}>Ball</Text>
                  </View>
                  
                  <View style={styles.targetGuide}>
                    <Feather name="target" size={24} color={COLORS.text.white} strokeWidth={2} />
                    <Text style={styles.guideText}>Hole</Text>
                  </View>
                </View>
                
                <Text style={styles.instructionText}>
                  Frame the ball and hole within the guides
                </Text>
              </View>
            )}

            {scanResult && (
              <Animated.View 
                style={[
                  styles.resultContainer,
                  { opacity: fadeAnim }
                ]}
              >
                <View style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>Green Read Complete</Text>
                    <View style={[
                      styles.confidenceBadge,
                      scanResult.confidence === "High" && styles.confidenceHigh,
                      scanResult.confidence === "Medium" && styles.confidenceMedium,
                      scanResult.confidence === "Low" && styles.confidenceLow,
                    ]}>
                      <Text style={styles.confidenceText}>
                        {scanResult.confidence} Confidence
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.resultMain}>
                    <View style={styles.aimContainer}>
                      <Text style={styles.aimLabel}>AIM</Text>
                      <Text style={styles.aimValue}>
                        {scanResult.aimOffset}″ {scanResult.aimDirection}
                      </Text>
                    </View>
                    
                    <View style={styles.paceContainer}>
                      <Text style={styles.paceLabel}>PACE</Text>
                      <Text style={styles.paceValue}>{scanResult.pace}</Text>
                      <Text style={styles.paceDetail}>
                        +{Math.floor(Math.random() * 8) + 6}″ past hole
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.resultFooter}>
                    <View style={styles.resultStat}>
                      <Text style={styles.statLabel}>Distance</Text>
                      <Text style={styles.statValue}>{scanResult.distance} ft</Text>
                    </View>
                    <View style={styles.resultStat}>
                      <Text style={styles.statLabel}>Slope</Text>
                      <Text style={styles.statValue}>{scanResult.slope}%</Text>
                    </View>
                    <View style={styles.resultStat}>
                      <Text style={styles.statLabel}>Break</Text>
                      <Text style={styles.statValue}>
                        {scanResult.aimDirection === "L" ? "←" : "→"}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.resultActions}>
                  <TouchableOpacity
                    style={styles.rescanButton}
                    onPress={handleRescan}
                  >
                    <RotateCw size={20} color={COLORS.text.white} />
                    <Text style={styles.rescanText}>Rescan</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={handleAccept}
                  >
                    <Check size={20} color={COLORS.text.white} />
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}

            {!scanResult && (
              <View style={styles.controls}>
                <TouchableOpacity
                  style={[
                    styles.scanButton,
                    isScanning && styles.scanButtonActive
                  ]}
                  onPress={handleScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <Animated.View
                      style={{ transform: [{ scale: pulseAnim }] }}
                    >
                      <View style={styles.scanningIndicator} />
                    </Animated.View>
                  ) : (
                    <View style={styles.scanButtonInner} />
                  )}
                </TouchableOpacity>
                
                <Text style={styles.scanText}>
                  {isScanning ? "Scanning..." : "Tap to Read Green"}
                </Text>
              </View>
            )}
          </SafeAreaView>
        </CameraView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark,
    padding: 20,
  },
  webFallbackText: {
    color: COLORS.text.white,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  mockScanButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  mockScanButtonText: {
    color: COLORS.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slopeIndicator: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  slopeLabel: {
    fontSize: 12,
    color: COLORS.text.white,
    opacity: 0.8,
  },
  slopeValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.white,
  },
  sensorError: {
    fontSize: 10,
    color: COLORS.error,
  },
  frameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  frame: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.3,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.text.white,
    borderWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  centerGuide: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    alignItems: 'center',
  },
  targetGuide: {
    position: 'absolute',
    top: 20,
    right: 40,
    alignItems: 'center',
  },
  guideText: {
    color: COLORS.text.white,
    fontSize: 12,
    marginTop: 4,
  },
  instructionText: {
    color: COLORS.text.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controls: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 4,
    borderColor: COLORS.text.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonActive: {
    backgroundColor: 'rgba(74,124,89,0.5)',
  },
  scanButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.text.white,
  },
  scanningIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
  },
  scanText: {
    color: COLORS.text.white,
    fontSize: 16,
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionText: {
    fontSize: 18,
    color: COLORS.text.white,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: COLORS.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 350,
  },
  resultHeader: {
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceHigh: {
    backgroundColor: COLORS.success,
  },
  confidenceMedium: {
    backgroundColor: COLORS.warning,
  },
  confidenceLow: {
    backgroundColor: COLORS.error,
  },
  confidenceText: {
    color: COLORS.text.white,
    fontSize: 12,
    fontWeight: '600',
  },
  resultMain: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  aimContainer: {
    alignItems: 'center',
  },
  aimLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  aimValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  paceContainer: {
    alignItems: 'center',
  },
  paceLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  paceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  paceDetail: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  resultStat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  rescanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.text.white,
    gap: 8,
  },
  rescanText: {
    color: COLORS.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  acceptText: {
    color: COLORS.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});