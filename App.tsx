import './global.css';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuthStore } from './src/stores/authStore';
import { useThemeStore } from './src/stores/themeStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

export default function App() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateTheme = useThemeStore((s) => s.hydrate);
  const isDark = useThemeStore((s) => s.isDark);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    hydrateAuth();
    hydrateTheme();
  }, []);

  if (isLoading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
