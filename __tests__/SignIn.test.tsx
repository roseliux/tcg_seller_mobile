/**
 * Sign In Authentication Test
 * Tests the sign in functionality including API calls and state management
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AuthProvider, useAuth } from '../components/auth/AuthContext';
import { authAPI, TokenManager } from '../services/api';

// Mock the API services
jest.mock('../services/api', () => ({
  authAPI: {
    login: jest.fn(),
  },
  TokenManager: {
    setToken: jest.fn(),
    setUser: jest.fn(),
    getToken: jest.fn(),
    getUser: jest.fn(),
    clearAll: jest.fn(),
  },
}));

// Type the mocked functions
const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;
const mockedTokenManager = TokenManager as jest.Mocked<typeof TokenManager>;

// Import the router to access the mocked version
import { router } from 'expo-router';

// Get the mocked router functions (already mocked in jest-setup.js)
const mockRouterReplace = router.replace as jest.MockedFunction<typeof router.replace>;

// Test component that uses the auth context
const TestSignInComponent = () => {
  const { signIn, user, isLoading, isAuthenticated } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn('test@example.com', 'password123456');
    } catch (error) {
      // Handle error in test
    }
  };

  return (
    <View>
      <TouchableOpacity testID="sign-in-button" onPress={handleSignIn}>
        <Text>Sign In</Text>
      </TouchableOpacity>
      {isLoading && <Text testID="loading">Loading...</Text>}
      {user && <Text testID="user-email">{user.email}</Text>}
      {isAuthenticated && <Text testID="authenticated">Authenticated</Text>}
    </View>
  );
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('Sign In Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset router mock
    mockRouterReplace.mockClear();
  });

  it('should successfully sign in a user', async () => {
    // Mock successful API response
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

    const mockResponse = {
      user: mockUser,
      session: { id: 'session123', expires_at: '2024-12-31T23:59:59Z' },
      token: 'mock-token-123',
    };

    mockedAuthAPI.login.mockResolvedValueOnce(mockResponse);
    mockedTokenManager.setToken.mockResolvedValueOnce();
    mockedTokenManager.setUser.mockResolvedValueOnce();

    const { getByTestId, queryByTestId } = render(
      <TestWrapper>
        <TestSignInComponent />
      </TestWrapper>
    );

    // Initially should not be authenticated
    expect(queryByTestId('authenticated')).toBeNull();
    expect(queryByTestId('user-email')).toBeNull();

    // Trigger sign in
    const signInButton = getByTestId('sign-in-button');
    fireEvent.press(signInButton);

    // Should show loading state
    await waitFor(() => {
      expect(getByTestId('loading')).toBeTruthy();
    });

    // Wait for sign in to complete
    await waitFor(() => {
      expect(getByTestId('user-email')).toBeTruthy();
      expect(getByTestId('authenticated')).toBeTruthy();
    });

    // Verify API was called with correct parameters
    expect(mockedAuthAPI.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123456',
    });

    // Verify token and user were stored
    expect(mockedTokenManager.setToken).toHaveBeenCalledWith('mock-token-123');
    expect(mockedTokenManager.setUser).toHaveBeenCalledWith(mockUser);

    // Verify navigation occurred
    expect(mockRouterReplace).toHaveBeenCalledWith('/(tabs)');

    // Verify user data is displayed
    expect(getByTestId('user-email')).toHaveTextContent('test@example.com');
  });

  it('should handle sign in errors', async () => {
    // Mock API error
    const mockError = {
      message: 'Invalid credentials',
      errors: {},
    };

    mockedAuthAPI.login.mockRejectedValueOnce(mockError);

    const { getByTestId, queryByTestId } = render(
      <TestWrapper>
        <TestSignInComponent />
      </TestWrapper>
    );

    // Trigger sign in
    const signInButton = getByTestId('sign-in-button');
    fireEvent.press(signInButton);

    // Wait for error handling
    await waitFor(() => {
      expect(queryByTestId('loading')).toBeNull();
    });

    // Should not be authenticated
    expect(queryByTestId('authenticated')).toBeNull();
    expect(queryByTestId('user-email')).toBeNull();

    // Should not navigate
    expect(mockRouterReplace).not.toHaveBeenCalled();

    // Should not store token/user
    expect(mockedTokenManager.setToken).not.toHaveBeenCalled();
    expect(mockedTokenManager.setUser).not.toHaveBeenCalled();
  });

  it('should restore user session on app load', async () => {
    // Mock stored session
    const mockUser = {
      id: 1,
      email: 'stored@example.com',
      first_name: 'Stored',
      last_name: 'User',
      user_name: 'storeduser',
      verified: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    mockedTokenManager.getToken.mockResolvedValueOnce('stored-token');
    mockedTokenManager.getUser.mockResolvedValueOnce(mockUser);

    const { getByTestId } = render(
      <TestWrapper>
        <TestSignInComponent />
      </TestWrapper>
    );

    // Wait for session restoration
    await waitFor(() => {
      expect(getByTestId('authenticated')).toBeTruthy();
      expect(getByTestId('user-email')).toBeTruthy();
    });

    // Verify user data is displayed
    expect(getByTestId('user-email')).toHaveTextContent('stored@example.com');
  });
});