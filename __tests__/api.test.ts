/**
 * API Authentication Test
 * Tests the API service functions for authentication
 */

// Mock axios at the module level BEFORE importing anything
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  const mockAxios = {
    create: jest.fn(() => mockAxiosInstance),
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };

  // Store the mock instance for tests to access
  (mockAxios as any).__mockInstance = mockAxiosInstance;

  return mockAxios;
});

// Import after mocking
import axios from 'axios';
import { authAPI, TokenManager } from '../services/api';

// Get the mock instance
const mockAxios = axios as jest.Mocked<typeof axios>;
const mockAxiosInstance = (mockAxios as any).__mockInstance;

describe('API Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authAPI.login', () => {
    it('should successfully login and return user data', async () => {
      // Mock API responses
      const mockLoginResponse = {
        data: { id: 'session123' },
        headers: { 'x-session-token': 'test-token-123' },
        status: 201,
      };

      const mockUserResponse = {
        data: {
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          user_name: 'testuser',
        },
        status: 200,
      };

      // Setup the mock responses
      mockAxiosInstance.post.mockResolvedValueOnce(mockLoginResponse);
      mockAxiosInstance.get.mockResolvedValueOnce(mockUserResponse);

      const result = await authAPI.login({
        email: 'test@example.com',
        password: 'password123456',
      });

      expect(result).toEqual({
        user: mockUserResponse.data,
        session: mockLoginResponse.data,
        token: 'test-token-123',
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/sign_in', {
        email: 'test@example.com',
        password: 'password123456',
      });
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/me', {
        headers: {
          'Authorization': 'Bearer test-token-123',
        },
      });
    });

    it('should handle login errors', async () => {
      // Mock API error
      const mockError = {
        response: {
          data: { error: 'Invalid credentials' },
          status: 401,
        },
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(
        authAPI.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toEqual({
        message: 'Invalid credentials',
        errors: { error: 'Invalid credentials' },
      });
    });

    it('should handle missing session token', async () => {
      // Mock login response without token
      const mockLoginResponse = {
        data: { id: 'session123' },
        headers: {}, // No x-session-token header
        status: 201,
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockLoginResponse);

      await expect(
        authAPI.login({
          email: 'test@example.com',
          password: 'password123456',
        })
      ).rejects.toEqual({
        message: 'No session token received',
        errors: {},
      });
    });
  });

  describe('TokenManager', () => {
    it('should store and retrieve tokens', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');

      AsyncStorage.setItem.mockResolvedValueOnce();
      AsyncStorage.getItem.mockResolvedValueOnce('stored-token');

      await TokenManager.setToken('test-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token');

      const token = await TokenManager.getToken();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('auth_token');
      expect(token).toBe('stored-token');
    });

    it('should store and retrieve user data', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        user_name: 'testuser',
        verified: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      };

      AsyncStorage.setItem.mockResolvedValueOnce();
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));

      await TokenManager.setUser(mockUser);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_data', JSON.stringify(mockUser));

      const user = await TokenManager.getUser();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_data');
      expect(user).toEqual(mockUser);
    });

    it('should clear all stored data', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');

      AsyncStorage.removeItem.mockResolvedValue();

      await TokenManager.clearAll();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_data');
    });
  });
});