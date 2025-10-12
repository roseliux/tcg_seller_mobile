import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';
import { baseURL, getDevServerIP } from './ip-config';

// API Configuration
const API_BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'  // Android emulator
    : baseURL                  // Dynamic IP for iOS/physical devices
  : 'https://your-production-api.com'; // Production - update with your actual URL

console.log('🌐 API Configuration:');
console.log('  Platform.OS:', Platform.OS);
console.log('  __DEV__:', __DEV__);
console.log('  Dynamic IP:', getDevServerIP());
console.log('  API_BASE_URL:', API_BASE_URL);

// Test network connectivity
if (__DEV__) {
  fetch(`${API_BASE_URL}/health`)
    .then(response => {
      console.log('✅ Network connectivity test successful:', response.status);
    })
    .catch(error => {
      console.log('❌ Network connectivity test failed:', error.message);
      console.log('💡 Make sure Rails server is running with: bin/rails server -b 0.0.0.0');
    });
}

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Types for authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  user_name?: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_name: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  session: {
    id: string;
    expires_at: string;
  };
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ListingRequest {
  item_title: string;
  description: string;
  price: string;
  listing_type: 'selling' | 'looking';
  condition: 'any' | 'mint' | 'near_mint' | 'excellent' | 'good' | 'light_played' | 'played' | 'poor';
  category_id: string;
  card_set_id: string;
}

export interface ListingResponse {
  id: number;
  item_title: string;
  description: string;
  price: string;
  listing_type: 'selling' | 'looking';
  condition: 'any' | 'mint' | 'near_mint' | 'excellent' | 'good' | 'light_played' | 'played' | 'poor';
  user_id: number;
  category_id: string;
  card_set_id: string;
  created_at: string;
  updated_at: string;
}

// Token management
export const TokenManager = {
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user_data');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  },

  async clearAll(): Promise<void> {
    await this.removeToken();
    await this.removeUser();
  },
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth data
      await TokenManager.clearAll();
      // You might want to redirect to login here or emit an event
    }
    return Promise.reject(error);
  }
);

// API Methods
export const authAPI = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Step 1: Register the user
      await api.post('/sign_up', data);

      // Step 2: Sign in to get session token
      const loginResponse = await api.post('/sign_in', {
        email: data.email,
        password: data.password,
      });

      const token = loginResponse.headers['x-session-token'];
      if (!token) {
        throw new Error('No session token received');
      }

      // Step 3: Get user data from the /me endpoint
      const currentUserResponse = await api.get('/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const user = currentUserResponse.data;

      return {
        user,
        session: loginResponse.data,
        token,
      };
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || error.response?.data?.error || 'Registration failed',
        errors: error.response?.data || {},
      };
      throw apiError;
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔵 Login attempt:', { email: data.email, baseURL: API_BASE_URL });

      const response = await api.post('/sign_in', data);
      console.log('🟢 Login response status:', response.status);
      console.log('🟢 Login response headers:', response.headers);

      const token = response.headers['x-session-token'];

      if (!token) {
        console.log('🔴 No session token in headers:', Object.keys(response.headers));
        throw new Error('No session token received');
      }

      console.log('🟢 Session token received:', token.substring(0, 20) + '...');

      // Get user data from the /me endpoint
      const currentUserResponse = await api.get('/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('🟢 Current user response:', currentUserResponse.data);
      const user = currentUserResponse.data;

      return {
        user,
        session: response.data,
        token,
      };
    } catch (error: any) {
      console.log('🔴 Login error:', error);
      console.log('🔴 Error response:', error.response?.data);
      console.log('🔴 Error status:', error.response?.status);
      console.log('🔴 Error message:', error.message);

      const apiError: ApiError = {
        message: error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed',
        errors: error.response?.data || {},
      };
      throw apiError;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.delete('/sign_out');
    } catch (error) {
      // Log error but don't throw - logout should always succeed locally
      console.error('Logout API error:', error);
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/sessions');
    return response.data.user;
  },

  async getCategories(): Promise<Category[]> {
    try {
      console.log('🔵 Fetching categories from:', api.defaults.baseURL + '/categories');
      const response = await api.get('/categories');
      console.log('✅ Categories fetched successfully:', response.data.length, 'categories');
      return response.data;
    } catch (error: any) {
      console.log('❌ Categories fetch failed:', error.message);
      if (error.code === 'NETWORK_ERROR' || error.message.includes('ERR_ADDRESS_UNREACHABLE')) {
        console.log('💡 Network issue - check if Rails server is running with: bin/rails server -b 0.0.0.0');
      }
      const apiError: ApiError = {
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to fetch categories',
        errors: error.response?.data || {},
      };
      throw apiError;
    }
  },

  async createListing(data: ListingRequest): Promise<ListingResponse> {
    try {
      console.log('🔵 Creating listing:', data);
      const response = await api.post('/listings', data);
      console.log('✅ Listing created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.log('❌ Listing creation failed:', error.message);
      if (error.code === 'NETWORK_ERROR' || error.message.includes('ERR_ADDRESS_UNREACHABLE')) {
        console.log('💡 Network issue - check if Rails server is running with: bin/rails server -b 0.0.0.0');
      }
      const apiError: ApiError = {
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to create listing',
        errors: error.response?.data || {},
      };
      throw apiError;
    }
  },
};

export default api;