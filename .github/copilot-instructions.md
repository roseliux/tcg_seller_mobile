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

# No testing framework currently configured
# Recommend adding Jest + React Native Testing Library for future testing
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
│   ├── login.tsx                 # Login screen
│   └── register.tsx              # Registration screen
├── (tabs)/                        # Main app navigation
│   ├── _layout.tsx               # Tab navigation layout
│   ├── index.tsx                 # Home/main screen
│   └── two.tsx                   # Secondary tab screen
components/
├── auth/
│   └── AuthContext.tsx           # Authentication context provider
├── ui/                           # Reusable UI components
│   ├── EditScreenInfo.tsx
│   ├── ExternalLink.tsx
│   ├── StyledText.tsx
│   └── Themed.tsx
└── __tests__/                    # Component tests
constants/
└── Colors.ts                     # Theme and color definitions
```

### Configuration Files (Critical)
- `app.json`: Expo configuration, build settings, platform-specific options
- `package.json`: Dependencies, scripts, React Native 0.81.4 + React 19.1.0 compatibility
- `tsconfig.json`: TypeScript configuration with strict mode, path aliases (`@/` -> root)
- `metro.config.js`: Metro bundler configuration (auto-generated)
- `expo-env.d.ts`: TypeScript environment definitions

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

**Current Implementation:**
- `AuthContext` provides authentication state management
- Placeholder API integration ready for Rails backend connection
- File-based routing with `(auth)` group for unauthenticated screens
- Protected route patterns using layout-based guards

**API Integration Points (TODO):**
```typescript
// In AuthContext.tsx - ready for Rails API integration
login: async (email: string, password: string) => {
  // TODO: Implement actual API call to your Rails backend
  // POST /api/auth/sessions (Rails sessions endpoint)
}

logout: async () => {
  // TODO: Implement actual API call to your Rails backend
  // DELETE /api/auth/sessions (Rails session cleanup)
}
```

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

## Common Pitfalls & Solutions

1. **Node.js Version**: Current setup shows warnings with Node.js 20.17.0, optimal version is >= 20.19.4
2. **Metro Bundler**: Clear cache with `npx expo start --clear` if experiencing module resolution issues
3. **TypeScript Paths**: Use `@/` prefix for imports from project root
4. **Platform Differences**: Test on actual devices, not just simulators, especially for native features
5. **Build Dependencies**: Ensure Expo CLI and EAS CLI are installed globally for builds

## Quick Reference

**Development Workflow**: `npm start` → scan QR code on device → live development with Fast Refresh

**Project Type**: Expo managed workflow with custom native code capability

**Target Platforms**: iOS, Android, Web (universal app)

**State Management**: TanStack React Query + React Context pattern

**Routing**: File-based with Expo Router (similar to Next.js app directory)

---

**IMPORTANT**: This mobile app is designed to work with the Rails API backend. Ensure backend is running on appropriate endpoints for full functionality. API integration points are marked with TODO comments for easy identification.