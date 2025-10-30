import { authAPI, TokenManager, type RegisterRequest } from '@/services/api';
import { logger } from '@/services/logger';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_name: string | null;
  verified: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      logger.log('🔄 AuthContext: Checking auth state...');
      const token = await TokenManager.getToken();
      const storedUser = await TokenManager.getUser();

      if (token && storedUser) {
        logger.log('🟢 AuthContext: Found stored auth data');
        // Convert API user format to local user format
        const userData = {
          id: storedUser.id,
          email: storedUser.email,
          first_name: storedUser.first_name,
          last_name: storedUser.last_name,
          user_name: storedUser.user_name,
          verified: storedUser.verified,
        };
        setUser(userData);
        logger.log('🟢 AuthContext: Restored user session:', userData);
      } else {
        logger.log('🔴 AuthContext: No stored auth data found');
      }
    } catch (error) {
      console.error('🔴 AuthContext: Error checking auth state:', error);
      // Clear invalid auth data
      await TokenManager.clearAll();
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      logger.log('🔵 AuthContext: Starting sign in process...');
      setIsLoading(true);
      const response = await authAPI.login({ email, password });

      logger.log('🟢 AuthContext: Login successful, storing data...');
      // Store token and user data
      await TokenManager.setToken(response.token);
      await TokenManager.setUser(response.user);

      // Update local state
      const userData = {
        id: response.user.id,
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        user_name: response.user.user_name,
        verified: response.user.verified,
      };

      setUser(userData);
      logger.log('🟢 AuthContext: User state updated:', userData);
      logger.log('🟢 AuthContext: User is now authenticated!');

      // Navigate to main app after successful sign in
      logger.log('🔄 AuthContext: Navigating to main app...');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('🔴 AuthContext: Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: RegisterData) => {
    try {
      logger.log('🔵 AuthContext: Starting sign up process...');
      setIsLoading(true);

      // Transform the data to match the API format
      const registerRequest: RegisterRequest = {
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
        first_name: userData.firstName,
        last_name: userData.lastName,
        user_name: userData.userName,
      };

      const response = await authAPI.register(registerRequest);

      logger.log('🟢 AuthContext: Registration successful, storing data...');
      // Store token and user data
      await TokenManager.setToken(response.token);
      await TokenManager.setUser(response.user);

      // Update local state
      const newUserData = {
        id: response.user.id,
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        user_name: response.user.user_name,
        verified: response.user.verified,
      };

      setUser(newUserData);
      logger.log('🟢 AuthContext: User state updated after registration:', newUserData);
      logger.log('🟢 AuthContext: User is now authenticated!');

      // Navigate to main app after successful registration
      logger.log('🔄 AuthContext: Navigating to main app...');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('🔴 AuthContext: Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      logger.log('🔵 AuthContext: Starting sign out process...');
      setIsLoading(true);

      // Call logout API (don't throw on failure)
      await authAPI.logout();

      // Clear local storage
      await TokenManager.clearAll();

      // Update local state
      setUser(null);
      logger.log('🟢 AuthContext: User signed out successfully');

      // Navigate back to sign in
      logger.log('🔄 AuthContext: Navigating to sign in...');
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('🔴 AuthContext: Sign out error:', error);
      // Still clear local data even if API call fails
      await TokenManager.clearAll();
      setUser(null);
      router.replace('/(auth)/signin');
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}