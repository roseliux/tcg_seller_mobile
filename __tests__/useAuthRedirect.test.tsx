/**
 * Authentication Redirect Hook Test
 * Tests the useAuthRedirect hook logic that handles redirecting authenticated users
 * This tests the ACTUAL implementation logic used by signin.tsx and register.tsx
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { AuthProvider } from '../components/auth/AuthContext';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { TokenManager } from '../services/api';

// Mock the API services
jest.mock('../services/api', () => ({
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
  },
  TokenManager: {
    setToken: jest.fn(),
    setUser: jest.fn(),
    getToken: jest.fn(),
    getUser: jest.fn(),
    clearAll: jest.fn(),
  },
}));

// Import the mocked authAPI
import { authAPI } from '../services/api';

// Type the mocked modules
const mockedTokenManager = TokenManager as jest.Mocked<typeof TokenManager>;
const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;

// Import the router to access the mocked version
import { router } from 'expo-router';

// Get the mocked router functions (already mocked in jest-setup.js)
const mockRouterReplace = router.replace as jest.MockedFunction<typeof router.replace>;

// Test component that uses the actual useAuthRedirect hook
const TestComponentWithAuthRedirect = () => {
  const { isAuthenticated } = useAuthRedirect();

  return (
    <View>
      <Text>Auth Screen - Authenticated: {isAuthenticated.toString()}</Text>
    </View>
  );
};

// Create a test wrapper with all necessary providers
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('useAuthRedirect Hook Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear any existing auth state
    mockedTokenManager.getToken.mockResolvedValue(null);
    mockedTokenManager.getUser.mockResolvedValue(null);

    // Mock successful login by default
    mockedAuthAPI.login.mockResolvedValue({
      user: {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        user_name: 'testuser',
        verified: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      session: {
        id: 'test-session-id',
        expires_at: '2024-12-31T23:59:59Z',
      },
      token: 'test-token-123',
    });
  });

  describe('Authenticated User Redirects', () => {
    it('should redirect authenticated user to home tabs', async () => {
      // Mock authenticated user state
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        user_name: 'testuser',
        verified: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      mockedTokenManager.getToken.mockResolvedValue('mock-token-123');
      mockedTokenManager.getUser.mockResolvedValue(mockUser);

      const TestWrapper = createTestWrapper();

      render(
        <TestWrapper>
          <TestComponentWithAuthRedirect />
        </TestWrapper>
      );

      // Wait for the redirect to happen
      await waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith('/(tabs)');
      }, { timeout: 3000 });
    });

    it('should not redirect unauthenticated user', async () => {
      // Mock unauthenticated state
      mockedTokenManager.getToken.mockResolvedValue(null);
      mockedTokenManager.getUser.mockResolvedValue(null);

      const TestWrapper = createTestWrapper();

      render(
        <TestWrapper>
          <TestComponentWithAuthRedirect />
        </TestWrapper>
      );

      // Wait a bit to ensure no redirect happens
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Should not have called router.replace
      expect(mockRouterReplace).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle token without user data gracefully', async () => {
      // Clear previous state first to avoid pollution
      jest.clearAllMocks();
      mockedTokenManager.getToken.mockResolvedValue(null);
      mockedTokenManager.getUser.mockResolvedValue(null);

      // Mock token exists but no user data (incomplete auth state)
      mockedTokenManager.getToken.mockResolvedValue('orphaned-token');
      mockedTokenManager.getUser.mockResolvedValue(null);

      const TestWrapper = createTestWrapper();

      render(
        <TestWrapper>
          <TestComponentWithAuthRedirect />
        </TestWrapper>
      );

      // Wait and ensure no redirect happens (incomplete auth state)
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(mockRouterReplace).not.toHaveBeenCalled();
    });

    it('should return correct authentication state', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        user_name: 'testuser',
        verified: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      mockedTokenManager.getToken.mockResolvedValue('mock-token-123');
      mockedTokenManager.getUser.mockResolvedValue(mockUser);

      const TestWrapper = createTestWrapper();

      const { getByText } = render(
        <TestWrapper>
          <TestComponentWithAuthRedirect />
        </TestWrapper>
      );

      // Should eventually show authenticated state
      await waitFor(() => {
        expect(getByText(/Authenticated: true/)).toBeTruthy();
      }, { timeout: 3000 });
    });
  });
});