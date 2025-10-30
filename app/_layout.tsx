import { logger } from '@/services/logger';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/components/auth/AuthContext';
import { useColorScheme } from '@/components/useColorScheme';

// Hide specific React Native warnings
// LogBox.ignoreLogs([
//   'boxShadow',
//   'pointerEvents',
//   'props-found',
//   'index',
//   'tabs',
// ]);

// Create a client
const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGuard>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="notifications" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </AuthGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    logger.log('🔄 AuthGuard: Auth state changed - isLoading:', isLoading, ', isAuthenticated:', isAuthenticated, ', user:', user?.email);
  }, [isAuthenticated, isLoading, user]);

  logger.log('🔄 AuthGuard: Rendering - isLoading:', isLoading, ', isAuthenticated:', isAuthenticated, ', user:', user?.email);

  // Show loading while checking auth state
  if (isLoading) {
    logger.log('⏳ AuthGuard: Still loading auth state...');
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Conditionally render based on auth state
  if (isAuthenticated) {
    logger.log('🟢 AuthGuard: User authenticated (' + user?.email + '), showing tabs only');
    return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
      </Stack>
    );
  } else {
    logger.log('🔴 AuthGuard: User not authenticated, showing auth screens only');
    return (
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    );
  }
}
