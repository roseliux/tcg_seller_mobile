import { useAuth } from '@/components/auth/AuthContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function IndexScreen() {
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading) {
      console.log('🔄 Index: Redirecting based on auth state - isAuthenticated:', isAuthenticated);

      const timer = setTimeout(() => {
        if (isAuthenticated) {
          console.log('🟢 Index: Redirecting to tabs');
          router.replace('/(tabs)');
        } else {
          console.log('🔴 Index: Redirecting to sign in');
          router.replace('/(auth)/signin');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isMounted, isAuthenticated, isLoading]);

  // Show loading spinner while determining where to navigate
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}