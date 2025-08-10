export interface GolfSettings {
  competitionMode: boolean;
  greenSpeed: "Slow" | "Medium" | "Fast";
  units: "yards" | "meters";
  voiceGuidance: boolean;
  hapticFeedback: boolean;
  putterLength: number;
}

export interface ScanResult {
  aimOffset: number;
  aimDirection: "L" | "R";
  pace: string;
  slope: string;
  confidence: "Low" | "Medium" | "High";
  distance: number;
  timestamp: number;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  conditions: string;
}

export interface SensorData {
  slope: number;
  tilt: number;
  timestamp: number;
}

export interface CourseHole {
  number: number;
  par: number;
  yardage: number;
  frontDistance: number;
  centerDistance: number;
  backDistance: number;
  hazards: Hazard[];
  notes?: string;
}

export interface Hazard {
  name: string;
  distance: number;
  type: 'bunker' | 'water' | 'trees' | 'rough';
}

export interface GolfContextType {
  settings: GolfSettings;
  updateSettings: (updates: Partial<GolfSettings>) => Promise<void>;
  lastReading: ScanResult | null;
  updateLastReading: (reading: ScanResult) => void;
  isLoading: boolean;
  error: string | null;
}