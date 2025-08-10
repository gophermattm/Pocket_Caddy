export const SCAN_DURATION = 2000;
export const WEATHER_REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const ACCELEROMETER_UPDATE_INTERVAL = 100;
export const MAX_SLOPE_PERCENTAGE = 10;
export const GYROSCOPE_UPDATE_INTERVAL = 100;

export const COLORS = {
  primary: '#4a7c59',
  primaryDark: '#1a472a',
  secondary: '#2d5016',
  accent: '#a8d5ba',
  success: '#4a7c59',
  warning: '#ff9800',
  error: '#d32f2f',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: {
    primary: '#1a472a',
    secondary: '#666666',
    light: '#999999',
    white: '#ffffff'
  },
  border: '#e0e0e0'
} as const;

export const GOLF_TIPS = [
  "Uphill putts break less than downhill putts",
  "Morning dew makes greens slower",
  "Wind affects ball roll on exposed greens",
  "Read the green from multiple angles",
  "Trust your first read",
  "Grain affects ball roll - follow the shine",
  "Slower greens require firmer strokes",
  "Play more break on fast greens"
] as const;

export const DEFAULT_GOLF_SETTINGS: GolfSettings = {
  competitionMode: false,
  greenSpeed: "Medium",
  units: "yards",
  voiceGuidance: false,
  hapticFeedback: true,
  putterLength: 35,
} as const;

export const STORAGE_KEYS = {
  GOLF_SETTINGS: 'golfSettings',
  LAST_READING: 'lastReading',
  USER_PREFERENCES: 'userPreferences'
} as const;