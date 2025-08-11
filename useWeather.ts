import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { supportsLocation } from '@/utils/platform';
import { WEATHER_REFETCH_INTERVAL } from '@/constants';
import type { WeatherData } from '@/types';

const mockWeather: WeatherData = {
  temp: 72,
  humidity: 65,
  windSpeed: 8,
  windDirection: "SW",
  conditions: "Partly Cloudy",
};

async function fetchWeather(): Promise<WeatherData> {
  // For demo purposes, return mock data
  // In production, you would fetch from a weather API
  
  let location: Location.LocationObject | null = null;
  
  if (supportsLocation()) {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        console.log("Location:", location.coords);
        // Here you would call a weather API with the coordinates
        // const weather = await fetchFromWeatherAPI(location.coords);
        // return weather;
      }
    } catch (error) {
      console.warn("Location error:", error);
      // Continue with mock data rather than throwing
    }
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Add some variance to mock data based on location or time
  const variance = location ? 0.1 : 0.05;
  const tempVariance = (Math.random() - 0.5) * 20 * variance;
  const windVariance = (Math.random() - 0.5) * 10 * variance;
  
  return {
    ...mockWeather,
    temp: Math.round(mockWeather.temp + tempVariance),
    windSpeed: Math.max(0, Math.round(mockWeather.windSpeed + windVariance)),
  };
}

export function useWeather() {
  const query = useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    refetchInterval: WEATHER_REFETCH_INTERVAL,
    staleTime: WEATHER_REFETCH_INTERVAL,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    weather: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}