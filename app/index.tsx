import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function IndexScreen() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure component is mounted before navigation
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Small delay to ensure router is ready
      const timer = setTimeout(() => {
        router.replace('/(auth)/signin');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  return <View style={{ flex: 1 }} />;
}