import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { supportsHaptics } from '@/utils/platform';

export const useHaptics = () => {
  const triggerImpact = useCallback((style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    if (supportsHaptics()) {
      try {
        Haptics.impactAsync(style);
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  }, []);

  const triggerNotification = useCallback((type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) => {
    if (supportsHaptics()) {
      try {
        Haptics.notificationAsync(type);
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  }, []);

  const triggerSelection = useCallback(() => {
    if (supportsHaptics()) {
      try {
        Haptics.selectionAsync();
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  }, []);

  return {
    triggerImpact,
    triggerNotification,
    triggerSelection,
  };
};