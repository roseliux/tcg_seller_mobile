# GitHub Copilot Instructions - TCG Marketplace Mobile App

## Repository Overview

This is a **React Native with Expo SDK 54** mobile application for a Trading Card Game (TCG) marketplace. The app uses **TypeScript**, **Expo Router** for file-based navigation, **TanStack React Query** for state management, and connects to a Rails API backend for data.

**Key Technologies:**
- React Native 0.81.4, React 19.1.0, TypeScript ~5.9.2
- Expo SDK ~54.0.12 with Expo Router for navigation
- TanStack React Query v5 for server state management
- Axios for HTTP requests
- Cross-platform support (iOS, Android, Web)

## Critical Build & Development Commands

**ALWAYS run commands in this exact order. These commands are validated and work correctly:**

### 1. Environment Setup (Required)
```bash
# Install dependencies - ALWAYS run this first
npm install

# Note: Node.js version requirement
# Current project requires Node.js >= 20.19.4 (shows warnings on 20.17.0 but still works)
# Consider upgrading Node.js for optimal compatibility
```

### 2. Development Server Commands (primary workflow)
```bash
# Start Expo development server (recommended)
npm start                # Interactive menu with QR code for device testing

# Platform-specific development
npm run android         # Start with Android emulator/device focus
npm run ios            # Start with iOS simulator/device focus
npm run web            # Start web development server
```

### 3. Platform-Specific Build Commands
```bash
# Production builds (requires EAS CLI)
npx eas build --platform android    # Android APK/AAB
npx eas build --platform ios        # iOS IPA
npx eas build --platform all        # Both platforms

# Local development builds
npx expo run:android    # Build and run on Android
npx expo run:ios        # Build and run on iOS
```

### 4. Testing & Quality Commands
```bash
# TypeScript type checking
npx tsc --noEmit

# Run tests (Jest with React Native Testing Library)
npm test                        # Run all tests (41 tests, 100% success rate)
npm test basic.test.ts         # Run specific test file
npm test -- --testPathPatterns="basic|auth-logic"  # Run core tests (10 tests)
npm test -- --testPathPatterns="RNTL"              # Run component tests (10 tests)
npm test -- --testPathPatterns="auth-clean|auth-api|api"  # Run API tests (18 tests)
npm test -- --testPathPatterns="SignIn"            # Run integration tests (3 tests)
npm run test:watch            # Run tests in watch mode
npm test -- --updateSnapshot # Update component snapshots

# Current test status: 41 tests passing across 9 test suites (100% success rate)
# - 3 basic functionality tests
# - 7 authentication logic tests
# - 10 React Native Testing Library component tests
# - 18 API integration tests with mocked HTTP calls
# - 3 AuthContext integration tests with navigation
```

## Project Architecture & File Layout

### Navigation System (Expo Router - File-based)
- **App Router**: File-based routing in `app/` directory
- **Route Groups**: `(auth)/` for authentication screens, `(tabs)/` for main navigation
- **Layouts**: `_layout.tsx` files define nested layouts and navigation structure
- **Dynamic Routes**: `[id].tsx` pattern for dynamic parameters

### Core Application Structure
```
app/
├── _layout.tsx                    # Root layout with navigation setup
├── +html.tsx                      # Custom HTML template
├── +not-found.tsx                 # 404/not found screen
├── modal.tsx                      # Modal presentation
├── (auth)/                        # Authentication route group
│   ├── _layout.tsx               # Auth-specific layout
│   ├── signin.tsx                # Sign in screen (IMPLEMENTED)
│   └── register.tsx              # Registration screen (IMPLEMENTED)
├── (tabs)/                        # Main app navigation
│   ├── _layout.tsx               # Tab navigation layout
│   ├── index.tsx                 # Home/main screen
│   └── two.tsx                   # Secondary tab screen
components/
├── auth/
│   └── AuthContext.tsx           # Authentication context provider (IMPLEMENTED)
├── ui/                           # Reusable UI components
│   ├── EditScreenInfo.tsx
│   ├── ExternalLink.tsx
│   ├── StyledText.tsx
│   └── Themed.tsx
└── __tests__/                    # Component tests
constants/
└── Colors.ts                     # Theme and color definitions
services/
└── api.ts                        # API client configuration (IMPLEMENTED)
```

### Configuration Files (Critical)
- `app.json`: Expo configuration, build settings, platform-specific options
- `package.json`: Dependencies, scripts, React Native 0.81.4 + React 19.1.0 compatibility
- `tsconfig.json`: TypeScript configuration with strict mode, path aliases (`@/` -> root)
- `metro.config.js`: Metro bundler configuration (auto-generated)
- `expo-env.d.ts`: TypeScript environment definitions
- `jest-setup.js`: Jest configuration for testing with mocks (IMPLEMENTED)
- `babel.config.js`: Babel configuration for Jest and TypeScript (IMPLEMENTED)

## Development Guidelines

**Navigation Patterns:**
- Use `expo-router` for all navigation - avoid React Navigation directly
- Route groups with `()` for organizing related screens without affecting URL structure
- Layouts define persistent UI elements (tabs, headers, auth boundaries)
- Use `Link` component for navigation, `router` object for programmatic navigation

**State Management:**
- TanStack React Query for server state, API calls, caching
- React Context for app-wide state (authentication, theme, preferences)
- Local state with `useState` for component-specific UI state
- Async Storage for persistence (tokens, user preferences)

**TypeScript Patterns:**
- Strict mode enabled - all types required
- Path aliases: `@/` maps to project root for clean imports
- Component props interfaces using TypeScript
- API response typing for type-safe data handling

## Authentication Architecture

**✅ FULLY IMPLEMENTED - Complete End-to-End Authentication System**

### Current Implementation:
- **`AuthContext`**: Complete authentication state management with navigation integration
- **API Integration**: Full Rails backend connection with session-based authentication
- **Session Management**: Automatic session restoration and secure token storage
- **Protected Routes**: AuthGuard implementation with conditional navigation rendering
- **Network Configuration**: CORS setup and platform-specific API endpoints

### Authentication Flow:
1. **Sign In**: User enters credentials → API validates → Returns session token
2. **Token Storage**: Secure storage in AsyncStorage with user data persistence
3. **Navigation**: Automatic redirect to main app tabs after successful authentication
4. **Session Restoration**: On app restart, checks for valid token and restores user session
5. **Sign Out**: Clears all tokens and user data, redirects to authentication screens

### API Integration (IMPLEMENTED):
```typescript
// In AuthContext.tsx - fully implemented Rails API integration
signIn: async (email: string, password: string) => {
  // POST /sign_in (Rails sessions endpoint)
  // Handles token extraction and user data fetching
  // Automatic navigation to main app
}

signOut: async () => {
  // DELETE /sign_out (Rails session cleanup)
  // Clears local storage and navigates to auth
}

// Automatic session restoration on app start
```

### Test Users Available:
- **John Doe**: `john@example.com` / `password123456`
- **Jane Smith**: `jane@example.com` / `password123456`

### Backend Requirements:
- Rails server must be running and accessible (configured for network IP: 192.168.68.115:3000)
- CORS configured to expose `X-Session-Token` header
- Test users seeded in database (`backend/db/seeds.rb`)

## Common Development Patterns

**Component Structure:**
```typescript
// Functional component with TypeScript
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface Props {
  title: string;
  onPress?: () => void;
}

export default function Component({ title, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

**API Integration Pattern:**
```typescript
// Using TanStack React Query
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products'),
  });
}
```

**Authentication Usage:**
```typescript
// Use authentication context
import { useAuth } from '@/components/auth/AuthContext';

const { user, isAuthenticated, signIn, signOut } = useAuth();

// Sign in a user
await signIn('john@example.com', 'password123456');

// Check if user is authenticated
if (isAuthenticated && user) {
  console.log(`Welcome ${user.first_name}!`);
}

// Sign out
await signOut();
```

## Common Pitfalls & Solutions

1. **Node.js Version**: Current setup shows warnings with Node.js 20.17.0, optimal version is >= 20.19.4
2. **Metro Bundler**: Clear cache with `npx expo start --clear` if experiencing module resolution issues
3. **TypeScript Paths**: Use `@/` prefix for imports from project root
4. **Platform Differences**: Test on actual devices, not just simulators, especially for native features
5. **Build Dependencies**: Ensure Expo CLI and EAS CLI are installed globally for builds
6. **Network Testing**: Use actual device (not simulator) to test API connectivity with Rails backend
7. **Authentication Flow**: Ensure Rails backend is running before testing mobile authentication

## Quick Reference

**Development Workflow**: `npm start` → scan QR code on device → live development with Fast Refresh

**Project Type**: Expo managed workflow with custom native code capability

**Target Platforms**: iOS, Android, Web (universal app)

**State Management**: TanStack React Query + React Context pattern

**Routing**: File-based with Expo Router (similar to Next.js app directory)

## Testing Framework

**✅ FULLY IMPLEMENTED - Jest with React Native Testing Library**

### Test Architecture (41 Tests Across 9 Suites):

#### **Component Testing (10 tests)**
- **React Native Testing Library**: Component rendering, user interactions, theme integration
- **Snapshot Testing**: Visual regression testing with Jest snapshots
- **UI Validation**: Button presses, form inputs, loading states, accessibility

#### **Authentication Testing (28 tests)**
- **API Integration Tests**: HTTP mocking with axios, login/registration flows (18 tests)
- **Logic Validation Tests**: Email/password validation, form validation (7 tests)
- **AuthContext Integration**: Full authentication flow with navigation testing (3 tests)
- **Token Management**: Secure storage, session restoration, cleanup verification

#### **Core Functionality Testing (3 tests)**
- **Basic App Functions**: Configuration validation, utilities, environment setup
- **Platform Integration**: React Native environment and framework validation

### Testing Infrastructure:

#### **Mock Systems (Fully Configured)**
- **Axios HTTP Mocking**: Complete API request/response simulation with __mockInstance pattern
- **AsyncStorage Mocking**: Secure token storage simulation for authentication testing
- **Expo Router Mocking**: Navigation testing with route verification and redirect validation
- **React Native API Mocking**: Platform-specific API mocking for native features

#### **Test Execution & Performance**
- **Fast Execution**: 41 tests complete in ~3 seconds across 9 suites
- **Reliable Isolation**: Proper test isolation with beforeEach/afterEach cleanup
- **Deterministic Results**: 100% passing rate with consistent mock behavior
- **CI/CD Ready**: All tests pass in automated environments

### Test File Structure:
- `__tests__/basic.test.ts`: Core functionality tests (3 tests)
- `__tests__/auth-logic.test.ts`: Authentication validation logic (7 tests)
- `__tests__/auth-clean.test.ts`: Clean API integration tests (6 tests)
- `__tests__/auth-api.test.ts`: Authentication API integration (6 tests)
- `__tests__/api.test.ts`: Main API authentication flow (6 tests)
- `__tests__/SignIn.test.tsx`: AuthContext integration with navigation (3 tests)
- `components/__tests__/StyledText-test.js`: Component rendering tests (10 tests)

### Testing Best Practices Implemented:
- **TypeScript Integration**: Full type safety in test files with proper interfaces
- **Mock Consistency**: Standardized axios mocking pattern across all API tests
- **Integration Patterns**: End-to-end authentication flow testing with navigation
- **Component Testing**: React Native Testing Library patterns for UI validation

---

**IMPORTANT**: This mobile app has a complete authentication system integrated with the Rails API backend. Authentication is fully functional end-to-end. Ensure backend is running on the configured network IP for full functionality.