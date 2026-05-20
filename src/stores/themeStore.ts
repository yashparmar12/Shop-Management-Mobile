import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const THEME_KEY = 'shop_inventory_theme';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  hydrate: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: false,

  toggleTheme: () => {
    const isDark = !get().isDark;
    SecureStore.setItemAsync(THEME_KEY, isDark ? 'dark' : 'light');
    set({ isDark });
  },

  hydrate: async () => {
    const saved = await SecureStore.getItemAsync(THEME_KEY);
    if (saved) set({ isDark: saved === 'dark' });
  },
}));
