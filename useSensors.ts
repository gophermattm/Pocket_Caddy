import { useState, useEffect } from "react";
import { Accelerometer } from "expo-sensors";
import { supportsSensors } from '@/utils/platform';
import { ACCELEROMETER_UPDATE_INTERVAL, MAX_SLOPE_PERCENTAGE } from '@/constants';
import type { SensorData } from '@/types';

export function useSensors() {
  const [sensorData, setSensorData] = useState<SensorData>({
    slope: 0,
    tilt: 0,
    timestamp: Date.now(),
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supportsSensors()) {
      // Mock data for web
      setSensorData({
        slope: 2.5,
        tilt: 1.2,
        timestamp: Date.now(),
      });
      return;
    }

    let accelSubscription: ReturnType<typeof Accelerometer.addListener> | null = null;

    const setupSensors = async () => {
      try {
        // Check if accelerometer is available
        const isAvailable = await Accelerometer.isAvailableAsync();
        if (!isAvailable) {
          throw new Error('Accelerometer not available on this device');
        }

        Accelerometer.setUpdateInterval(ACCELEROMETER_UPDATE_INTERVAL);
        
        accelSubscription = Accelerometer.addListener(({ x, y, z, timestamp }) => {
          try {
            // Calculate slope from accelerometer data
            const slope = Math.abs(Math.atan2(y, z) * (180 / Math.PI));
            const tilt = Math.abs(Math.atan2(x, z) * (180 / Math.PI));
            
            setSensorData({
              slope: Math.min(slope, MAX_SLOPE_PERCENTAGE),
              tilt: Math.min(tilt, MAX_SLOPE_PERCENTAGE),
              timestamp: timestamp || Date.now(),
            });

            // Clear any previous errors
            if (error) {
              setError(null);
            }
          } catch (processingError) {
            console.error("Error processing sensor data:", processingError);
            setError("Error processing sensor data");
          }
        });
      } catch (setupError) {
        console.error("Sensor setup error:", setupError);
        setError(setupError instanceof Error ? setupError.message : "Unknown sensor error");
        
        // Fallback to mock data
        setSensorData({
          slope: 2.5,
          tilt: 1.2,
          timestamp: Date.now(),
        });
      }
    };

    setupSensors();

    return () => {
      if (accelSubscription) {
        accelSubscription.remove();
      }
    };
  }, [error]);

  return { sensorData, error };
}