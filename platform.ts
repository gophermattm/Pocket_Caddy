import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isNative = !isWeb;

export const getDeviceType = (): 'web' | 'ios' | 'android' => {
  return Platform.OS as 'web' | 'ios' | 'android';
};

export const supportsHaptics = (): boolean => {
  return isNative;
};

export const supportsCamera = (): boolean => {
  return isNative;
};

export const supportsSensors = (): boolean => {
  return isNative;
};

export const supportsLocation = (): boolean => {
  return true; // All platforms support location to some degree
}