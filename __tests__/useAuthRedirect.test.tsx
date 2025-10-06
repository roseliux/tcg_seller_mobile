/**
 * Authentication Redirect Hook Test
 * Tests the useAuthRedirect hook logic that handles redirecting authenticated users
 * This tests the ACTUAL implementation logic used by signin.tsx and register.tsx
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

// Mock the API services first
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

// Mock expo-router specifically for this test
const mockRouterReplace = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    replace: mockRouterReplace,
    push: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    replace: mockRouterReplace,
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Import after mocking
import { AuthProvider } from '../components/auth/AuthContext';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { TokenManager, authAPI, type User } from '../services/api';

// Type the mocked modules
const mockedTokenManager = TokenManager as jest.Mocked<typeof TokenManager>;
const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;

// Test component that uses the actual useAuthRedirect hook
const TestComponentWithAuthRedirect = () => {
  const { isAuthenticated } = useAuthRedirect();

  return React.createElement('div', {},
    React.createElement('span', {}, `Auth Screen - Authenticated: ${isAuthenticated.toString()}`)
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
    mockRouterReplace.mockClear();
    // Clear any existing auth state
    mockedTokenManager.getToken.mockResolvedValue(null);
    mockedTokenManager.getUser.mockResolvedValue(null);

    // Mock successful login by default
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      user_name: 'testuser',
      verified: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    mockedAuthAPI.login.mockResolvedValue({
      user: mockUser,
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
      const mockUser: User = {
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
      const mockUser: User = {
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

      // Wait for auth state to be processed and redirect to happen
      await waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith('/(tabs)');
      }, { timeout: 3000 });

      // Verify authentication state is true (confirmed by redirect)
      expect(mockRouterReplace).toHaveBeenCalledTimes(1);
    });
  });
});