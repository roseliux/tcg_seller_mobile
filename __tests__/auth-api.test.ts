/**
 * Authentication API Test
 * Tests the authentication service functions
 */

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
}));

// Import after mocking
import axios from 'axios';
import { authAPI, TokenManager } from '../services/api';

// Get the mocked axios
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
      const mockGetItem = jest.fn().mockResolvedValue(JSON.stringify({ id: 1, email: 'test@example.com' }));

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

      // Setup axios mock
      const mockApiInstance = {
        post: jest.fn().mockResolvedValueOnce(mockLoginResponse),
        get: jest.fn().mockResolvedValueOnce(mockUserResponse),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      mockedAxios.create.mockReturnValueOnce(mockApiInstance);

      const result = await authAPI.login({
        email: 'test@example.com',
        password: 'password123456',
      });

      expect(result).toEqual({
        user: mockUserResponse.data,
        session: mockLoginResponse.data,
        token: 'test-token-123',
      });

      expect(mockApiInstance.post).toHaveBeenCalledWith('/sign_in', {
        email: 'test@example.com',
        password: 'password123456',
      });
      expect(mockApiInstance.get).toHaveBeenCalledWith('/me');
    });

    it('should handle login errors', async () => {
      const mockError = {
        response: {
          data: { error: 'Invalid credentials' },
          status: 401,
        },
      };

      const mockApiInstance = {
        post: jest.fn().mockRejectedValueOnce(mockError),
        get: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      mockAxios.create.mockReturnValueOnce(mockApiInstance);

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

      const mockApiInstance = {
        post: jest.fn().mockResolvedValueOnce(mockLoginResponse),
        get: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      mockAxios.create.mockReturnValueOnce(mockApiInstance);

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