import { Platform } from 'react-native';

let SecureStore: any = null;

if (Platform.OS !== 'web') {
  try {
    SecureStore = require('expo-secure-store');
  } catch {}
}

export async function getItem(key: string): Promise<string | null> {
  if (SecureStore) {
    return SecureStore.getItemAsync(key);
  }
  return localStorage.getItem(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  if (SecureStore) {
    return SecureStore.setItemAsync(key, value);
  }
  localStorage.setItem(key, value);
}

export async function removeItem(key: string): Promise<void> {
  if (SecureStore) {
    return SecureStore.deleteItemAsync(key);
  }
  localStorage.removeItem(key);
}
