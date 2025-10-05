/**
 * Authentication API Test
 * Tests the authentication service functions
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

describe('Authentication API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TokenManager', () => {
    it('should store and retrieve tokens', async () => {
      const mockSetItem = jest.fn().mockResolvedValue(undefined);
      const mockGetItem = jest.fn().mockResolvedValue('test-token');

      // Mock AsyncStorage for this test
      require('@react-native-async-storage/async-storage').setItem = mockSetItem;
      require('@react-native-async-storage/async-storage').getItem = mockGetItem;

      await TokenManager.setToken('test-token');
      expect(mockSetItem).toHaveBeenCalledWith('auth_token', 'test-token');

      const token = await TokenManager.getToken();
      expect(mockGetItem).toHaveBeenCalledWith('auth_token');
      expect(token).toBe('test-token');
    });

    it('should store and retrieve user data', async () => {
      const mockSetItem = jest.fn().mockResolvedValue(undefined);
      const mockGetItem = jest.fn().mockResolvedValue(JSON.stringify({
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        user_name: 'testuser',
        verified: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }));

      require('@react-native-async-storage/async-storage').setItem = mockSetItem;
      require('@react-native-async-storage/async-storage').getItem = mockGetItem;

      const userData = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        user_name: 'testuser',
        verified: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      };
      await TokenManager.setUser(userData);
      expect(mockSetItem).toHaveBeenCalledWith('user_data', JSON.stringify(userData));

      const retrievedUser = await TokenManager.getUser();
      expect(mockGetItem).toHaveBeenCalledWith('user_data');
      expect(retrievedUser).toEqual(userData);
    });

    it('should clear all stored data', async () => {
      const mockRemoveItem = jest.fn().mockResolvedValue(undefined);

      require('@react-native-async-storage/async-storage').removeItem = mockRemoveItem;

      await TokenManager.clearAll();

      expect(mockRemoveItem).toHaveBeenCalledWith('auth_token');
      expect(mockRemoveItem).toHaveBeenCalledWith('user_data');
    });
  });

  describe('authAPI.login', () => {
    it('should successfully login and return user data', async () => {
      // Mock the API responses
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
          verified: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
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
});