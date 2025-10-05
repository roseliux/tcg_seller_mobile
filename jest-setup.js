// Jest setup file
import '@testing-library/jest-native/extend-expect';

// Define global variables for React Native
global.__DEV__ = true;

// Mock AsyncStorage with default implementations
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn().mockResolvedValue([]),
  multiGet: jest.fn().mockResolvedValue([]),
  multiSet: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  Stack: {
    Screen: ({ children }) => children,
  },
}));

// Define Platform mock before any React Native imports
global.Platform = {
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default),
  Version: 15,
  isPad: false,
  isTV: false,
  isTesting: true,
};

// Mock useColorScheme hook
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'light'),
}));

// Mock Appearance
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn(() => 'light'),
  addChangeListener: jest.fn(),
  removeChangeListener: jest.fn(),
}));

// Mock axios with proper response structure and default implementations
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn().mockResolvedValue({ data: {}, status: 200, headers: {} }),
    post: jest.fn().mockResolvedValue({ data: {}, status: 200, headers: {} }),
    delete: jest.fn().mockResolvedValue({ data: {}, status: 200, headers: {} }),
    put: jest.fn().mockResolvedValue({ data: {}, status: 200, headers: {} }),
    patch: jest.fn().mockResolvedValue({ data: {}, status: 200, headers: {} }),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  return {
    create: jest.fn(() => mockAxiosInstance),
    get: jest.fn().mockResolvedValue({ data: {}, status: 200, headers: {} }),
    post: jest.fn().mockResolvedValue({ data: {}, status: 200, headers: {} }),
    delete: jest.fn().mockResolvedValue({ data: {}, status: 200, headers: {} }),
    put: jest.fn().mockResolvedValue({ data: {}, status: 200, headers: {} }),
    patch: jest.fn().mockResolvedValue({ data: {}, status: 200, headers: {} }),
    isCancel: jest.fn().mockReturnValue(false),
    CancelToken: {
      source: jest.fn().mockReturnValue({
        token: {},
        cancel: jest.fn(),
      }),
    },
    // Expose the mock instance for testing
    __mockInstance: mockAxiosInstance,
  };
});

// Global test timeout
jest.setTimeout(10000);