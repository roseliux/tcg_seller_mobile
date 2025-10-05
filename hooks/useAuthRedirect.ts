/**
 * Custom hook for handling authentication redirects
 * Used by auth screens to redirect authenticated users to the main app
 */

import { useAuth } from '@/components/auth/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';

export const useAuthRedirect = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return { isAuthenticated };
};