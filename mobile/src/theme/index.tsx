import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem } from '../services/storage';

export interface ThemeColors {
  id: string;
  label: string;
  gradientStart: string;
  gradientEnd: string;
  primary: string;
  primaryLight: string;
  bgLight: string;
  borderLight: string;
  surfaceLight: string;
  textPrimary: string;
  textMuted: string;
  white: string;
}

export const THEMES: Record<string, ThemeColors> = {
  pink: {
    id: 'pink', label: 'Rosa',
    gradientStart: '#EC4899', gradientEnd: '#F43F5E',
    primary: '#D4899C', primaryLight: '#FCE4EC',
    bgLight: '#F8F0F2', borderLight: '#FCE4EC', surfaceLight: '#FFF0F3',
    textPrimary: '#333', textMuted: '#999',
    white: '#fff',
  },
  blue: {
    id: 'blue', label: 'Azul',
    gradientStart: '#3B82F6', gradientEnd: '#06B6D4',
    primary: '#3B82F6', primaryLight: '#DBEAFE',
    bgLight: '#EFF6FF', borderLight: '#DBEAFE', surfaceLight: '#EFF6FF',
    textPrimary: '#333', textMuted: '#999',
    white: '#fff',
  },
  purple: {
    id: 'purple', label: 'Roxo',
    gradientStart: '#A855F7', gradientEnd: '#8B5CF6',
    primary: '#7C3AED', primaryLight: '#F3E8FF',
    bgLight: '#F5F3FF', borderLight: '#F3E8FF', surfaceLight: '#F5F3FF',
    textPrimary: '#333', textMuted: '#999',
    white: '#fff',
  },
  green: {
    id: 'green', label: 'Verde',
    gradientStart: '#22C55E', gradientEnd: '#10B981',
    primary: '#059669', primaryLight: '#D1FAE5',
    bgLight: '#ECFDF5', borderLight: '#D1FAE5', surfaceLight: '#ECFDF5',
    textPrimary: '#333', textMuted: '#999',
    white: '#fff',
  },
  yellow: {
    id: 'yellow', label: 'Amarelo',
    gradientStart: '#EAB308', gradientEnd: '#F97316',
    primary: '#D97706', primaryLight: '#FEF3C7',
    bgLight: '#FFFBEB', borderLight: '#FEF3C7', surfaceLight: '#FFFBEB',
    textPrimary: '#333', textMuted: '#999',
    white: '#fff',
  },
  red: {
    id: 'red', label: 'Vermelho',
    gradientStart: '#EF4444', gradientEnd: '#F43F5E',
    primary: '#DC2626', primaryLight: '#FEE2E2',
    bgLight: '#FEF2F2', borderLight: '#FEE2E2', surfaceLight: '#FEF2F2',
    textPrimary: '#333', textMuted: '#999',
    white: '#fff',
  },
  gray: {
    id: 'gray', label: 'Cinza',
    gradientStart: '#6B7280', gradientEnd: '#64748B',
    primary: '#4B5563', primaryLight: '#F3F4F6',
    bgLight: '#F9FAFB', borderLight: '#F3F4F6', surfaceLight: '#F9FAFB',
    textPrimary: '#333', textMuted: '#999',
    white: '#fff',
  },
  brown: {
    id: 'brown', label: 'Marrom',
    gradientStart: '#B45309', gradientEnd: '#C2410C',
    primary: '#92400E', primaryLight: '#FEF3C7',
    bgLight: '#FFFBEB', borderLight: '#FEF3C7', surfaceLight: '#FFFBEB',
    textPrimary: '#333', textMuted: '#999',
    white: '#fff',
  },
};

interface ThemeContextType {
  theme: ThemeColors;
  setThemeId: (id: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES.pink,
  setThemeId: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState('pink');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getItem('appTheme').then((saved) => {
      if (saved && THEMES[saved]) setThemeIdState(saved);
      setLoaded(true);
    });
  }, []);

  const setThemeId = async (id: string) => {
    setThemeIdState(id);
    await setItem('appTheme', id);
  };

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ theme: THEMES[themeId] || THEMES.pink, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
