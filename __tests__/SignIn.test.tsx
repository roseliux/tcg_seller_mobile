/**
 * Sign In Authentication Test
 * Tests the sign in functionality including API calls and state management
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
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

// Mock expo-router
const mockRouter = {
  replace: jest.fn(),
};
jest.mock('expo-router', () => ({
  router: mockRouter,
}));

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
    <>
      <button testID="sign-in-button" onPress={handleSignIn}>
        Sign In
      </button>
      {isLoading && <text testID="loading">Loading...</text>}
      {user && <text testID="user-email">{user.email}</text>}
      {isAuthenticated && <text testID="authenticated">Authenticated</text>}
    </>
  );
};

const TestWrapper = ({ children }) => {
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
    mockRouter.replace.mockClear();
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
    };

    const mockResponse = {
      user: mockUser,
      session: { id: 'session123' },
      token: 'mock-token-123',
    };

    authAPI.login.mockResolvedValueOnce(mockResponse);
    TokenManager.setToken.mockResolvedValueOnce();
    TokenManager.setUser.mockResolvedValueOnce();

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
    expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123456');

    // Verify token and user were stored
    expect(TokenManager.setToken).toHaveBeenCalledWith('mock-token-123');
    expect(TokenManager.setUser).toHaveBeenCalledWith(mockUser);

    // Verify navigation occurred
    expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');

    // Verify user data is displayed
    expect(getByTestId('user-email')).toHaveTextContent('test@example.com');
  });

  it('should handle sign in errors', async () => {
    // Mock API error
    const mockError = {
      message: 'Invalid credentials',
      errors: {},
    };

    authAPI.login.mockRejectedValueOnce(mockError);

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
    expect(mockRouter.replace).not.toHaveBeenCalled();

    // Should not store token/user
    expect(TokenManager.setToken).not.toHaveBeenCalled();
    expect(TokenManager.setUser).not.toHaveBeenCalled();
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
    };

    TokenManager.getToken.mockResolvedValueOnce('stored-token');
    TokenManager.getUser.mockResolvedValueOnce(mockUser);

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