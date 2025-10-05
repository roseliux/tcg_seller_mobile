# TCG Marketplace - Mobile App

React Native mobile application for the TCG (Trading Card Game) marketplace built with Expo and integrated with a Rails API backend.

## 🎉 **Project Status: Authentication Complete!**

✅ **Complete end-to-end authentication system**
✅ **Rails API integration with session management**
✅ **Secure token storage and session restoration**
✅ **Protected navigation with automatic redirects**
✅ **Jest testing framework with 41 passing tests (Jest 29.7.0 - Expo SDK 54 compatible)**

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 20.17.0+ (optimal: >= 20.19.4 for best React Native compatibility)
- npm or yarn
- **Jest 29.7.0** (automatically installed - compatible with Expo SDK 54)

### **Installation**
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### **Backend Setup (Required for Authentication)**
```bash
# In the backend directory (parallel to mobile/)
cd ../backend
bundle install
bin/rails db:create db:migrate db:seed
bin/rails server
```

### **Test Credentials**
- **Email**: `john@example.com` **Password**: `password123456`
- **Email**: `jane@example.com` **Password**: `password123456`

## 📱 **Testing on Physical Device (Recommended)**

### **Using Expo Go App**
1. **Install Expo Go** from App Store (iOS) or Google Play (Android)
2. **Ensure your phone and computer are on the same WiFi network**
3. **Run `npm start`** in this directory
4. **Scan the QR code** displayed in terminal with:
   - **iPhone**: Camera app or Expo Go app
   - **Android**: Expo Go app
5. **Enjoy instant hot reload** - changes appear immediately on your device!

### **Why Physical Device Testing?**
- **Real touch interactions** and native keyboard experience
- **Accurate performance** testing
- **True-to-life** form factor and screen size
- **Instant feedback** with hot reload
- **No simulator setup** required

## 🖥️ **Simulator Testing**

```bash
# Start development server
npm start

# Then choose your platform:
# Press 'i' for iOS Simulator
# Press 'a' for Android Emulator
# Press 'w' for web browser
```

## 🛠️ **Tech Stack**

### **Frontend (Mobile)**
- **React Native 0.81.4** with **Expo SDK 54**
- **TypeScript ~5.9.2** for type safety
- **Expo Router** for file-based navigation
- **TanStack React Query v5** for API state management
- **Axios** for HTTP requests and API integration
- **AsyncStorage** for secure token persistence

### **Backend Integration**
- **Rails 8.0.3 API** with session-based authentication
- **PostgreSQL** database with test user seeds
- **CORS** configured for mobile app connectivity
- **Session tokens** via `X-Session-Token` header

### **Testing**
- **Jest 29.7.0** with TypeScript support (Expo SDK 54 compatible)
- **41 passing tests** covering authentication, API, and components
- **React Native Testing Library** setup
- **Comprehensive mocking** for API and storage

## 📂 **Project Structure**

```
app/
├── (auth)/              # Authentication screens
│   ├── signin.tsx       # Sign-in form ✅ IMPLEMENTED
│   ├── register.tsx     # Registration form ✅ IMPLEMENTED
│   └── _layout.tsx      # Auth navigation with guards
├── (tabs)/              # Main app tabs (protected routes)
│   ├── index.tsx        # Dashboard with user info ✅ IMPLEMENTED
│   ├── two.tsx          # Secondary tab
│   └── _layout.tsx      # Tab navigation
├── +not-found.tsx       # 404 error screen
├── modal.tsx            # Modal presentations
└── _layout.tsx          # Root navigation with AuthGuard

components/
├── auth/
│   └── AuthContext.tsx  # Complete auth state management ✅
├── ui/                  # Reusable UI components
│   ├── EditScreenInfo.tsx
│   ├── StyledText.tsx
│   └── Themed.tsx
└── __tests__/           # Test files

services/
└── api.ts               # API client with Rails integration ✅

constants/
└── Colors.ts            # Theme colors

__tests__/               # Testing framework
├── basic.test.ts        # Core functionality tests (3 tests)
├── auth-logic.test.ts   # Authentication tests (7 tests)
└── auth-clean.test.ts   # API integration tests
```

## ✨ **Current Features**

### 🔐 **Authentication System (Complete)**
- ✅ **Sign In/Sign Up** forms with validation
- ✅ **Session-based authentication** with Rails API
- ✅ **Automatic session restoration** on app restart
- ✅ **Secure token storage** with AsyncStorage
- ✅ **Protected routes** with navigation guards
- ✅ **User dashboard** with personalized welcome
- ✅ **Sign out functionality** with cleanup

### 📱 **App Infrastructure**
- ✅ **File-based routing** with Expo Router
- ✅ **Cross-platform** support (iOS, Android, Web)
- ✅ **TypeScript** integration with strict mode
- ✅ **Dark/Light theme** support
- ✅ **Responsive design** for different screen sizes
- ✅ **Error handling** with user-friendly messages

### 🧪 **Testing & Quality**
- ✅ **Jest testing framework** with React Native preset
- ✅ **41 passing tests** (100% success rate)
- ✅ **React Native Testing Library** for component testing
- ✅ **Complete API mocking** with axios interceptors
- ✅ **Authentication integration tests** with AuthContext
- ✅ **Component rendering and interaction tests**
- ✅ **Comprehensive test coverage** across all layers

## 🧪 **Development Commands**

### **Development Server**
```bash
# Start development server
npm start

# Start with specific platform
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # Web browser

# Clear cache and restart
npx expo start --clear
```

### **Testing**
```bash
# Run all tests (41 tests across 9 suites)
npm test

# Run specific test categories
npm test -- --testPathPatterns="basic|auth-logic"           # Core tests (10 tests)
npm test -- --testPathPatterns="RNTL"                       # Component tests (10 tests)
npm test -- --testPathPatterns="auth-clean|auth-api|api"    # API tests (18 tests)
npm test -- --testPathPatterns="SignIn"                     # Integration tests (3 tests)

# Run tests in watch mode
npm run test:watch

# Update snapshots
npm test -- --updateSnapshot

# TypeScript type checking
npx tsc --noEmit

# View test coverage
npm test -- --coverage
```

### **Backend (Rails API)**
```bash
# Start Rails server (in backend directory)
cd ../backend
bin/rails server    # Runs on http://192.168.68.115:3000

# Reset database with test users
bin/rails db:reset
```

## � **Authentication Usage**

### **Sign In Flow**
```typescript
import { useAuth } from '@/components/auth/AuthContext';

const { signIn, isAuthenticated, user } = useAuth();

// Sign in with test user
await signIn('john@example.com', 'password123456');

// Check authentication status
if (isAuthenticated && user) {
  console.log(`Welcome ${user.first_name}!`);
}
```

### **Session Management**
- **Automatic Restoration**: App remembers user on restart
- **Token Security**: Stored securely in AsyncStorage
- **Session Cleanup**: Proper logout with token removal
- **Navigation Guards**: Protected routes redirect to sign-in

## 🧪 **Testing Framework**

This project uses a comprehensive testing setup with **Jest** and **React Native Testing Library** for reliable component and integration testing.

### **Test Categories & Coverage**

#### **📱 Component Tests (10 tests)**
- **React Native Testing Library**: Component rendering and interactions
- **User Interaction Testing**: Button presses, form inputs, loading states
- **Snapshot Testing**: Visual regression testing for components
- **Theme Integration**: Dark/light mode component rendering

```bash
# Run component tests only
npm test -- --testPathPatterns="RNTL|StyledText"
```

#### **🔐 Authentication Tests (28 tests)**
- **API Integration**: Login, registration, error handling (18 tests)
- **Logic Validation**: Email/password validation, form validation (7 tests)
- **AuthContext Integration**: Full authentication flow with navigation (3 tests)
- **Token Management**: Secure storage, session restoration, cleanup

```bash
# Run all authentication tests
npm test -- --testPathPatterns="auth|SignIn"
```

#### **⚙️ Core Functionality Tests (3 tests)**
- **Basic App Functions**: Configuration, utilities, core features
- **Platform Integration**: React Native environment setup
- **Development Environment**: Testing framework validation

```bash
# Run basic functionality tests
npm test -- --testPathPatterns="basic"
```

### **Testing Infrastructure**

#### **Mock Systems**
- **Axios HTTP Mocking**: Complete API request/response simulation
- **AsyncStorage Mocking**: Secure storage simulation for token management
- **Expo Router Mocking**: Navigation testing with route verification
- **React Native API Mocking**: Platform-specific API mocking

#### **Test Utilities**
- **Custom Test Helpers**: Authentication helpers, API response builders
- **Mock Data Factories**: Realistic user and API response generation
- **Integration Patterns**: End-to-end authentication flow testing

#### **Performance & Quality**
- **Fast Test Execution**: 41 tests complete in ~3 seconds
- **Reliable Mocking**: Deterministic test results with proper isolation
- **TypeScript Integration**: Full type safety in tests
- **CI/CD Ready**: All tests pass consistently in automated environments

### **Testing Best Practices**

```typescript
// Example: Component Testing with RNTL
import { render, fireEvent, waitFor } from '@testing-library/react-native';

test('should handle user sign in', async () => {
  const { getByTestId } = render(<SignInForm />);

  fireEvent.press(getByTestId('sign-in-button'));

  await waitFor(() => {
    expect(getByTestId('success-message')).toBeTruthy();
  });
});

// Example: API Testing with Mocked Responses
test('should handle login API call', async () => {
  mockAxiosInstance.post.mockResolvedValueOnce({
    data: { id: 'session123' },
    headers: { 'x-session-token': 'test-token-123' }
  });

  const result = await authAPI.login({
    email: 'test@example.com',
    password: 'password123456'
  });

  expect(result.token).toBe('test-token-123');
});
```

## 📋 **Roadmap**

### **Completed** ✅
- Complete authentication system
- Rails API integration
- Session management
- Protected navigation
- Testing framework

### **Coming Soon** 🚧
- Card marketplace browsing
- User profiles and collections
- Payment integration
- Real-time messaging
- Push notifications

## 🔧 **Troubleshooting**

### **Common Issues**

**QR Code not working?**
- Ensure both devices are on the same WiFi network
- Try restarting the development server
- Check if firewall is blocking connections

**iOS Simulator not opening?**
- Make sure Xcode is installed and license accepted
- Run: `sudo xcodebuild -license accept`
- Install iOS platform: `sudo xcodebuild -downloadPlatform iOS`

**Android Emulator issues?**
- Ensure Android Studio is installed
- Set ANDROID_HOME environment variable
- Start emulator from Android Studio first

**Authentication not working?**
- Ensure Rails backend is running on `http://192.168.68.115:3000`
- Check that test users are seeded in database
- Verify CORS configuration allows mobile app origin
- Use physical device for network testing (not simulator)

**Tests failing?**
- Run `npm test` to see current test status
- **Jest Version**: Must use Jest 29.7.0 (not 30.x) for Expo SDK 54 compatibility
- Check Jest configuration in `package.json`
- Ensure all dependencies are installed
- If you see Platform API errors, verify jest-setup.js has proper mocks

### **Clear Cache**
```bash
# Clear Expo cache
npx expo start --clear

# Clear npm cache
npm start -- --reset-cache

# Reset test database (backend)
cd ../backend && bin/rails db:reset
```

## 📚 **Documentation**

- **Authentication Guide**: See `AUTHENTICATION_SUMMARY.md`
- **Copilot Instructions**: See `.github/copilot-instructions.md`
- **API Documentation**: Rails backend `/docs` endpoint

---

**Status**: ✅ **Authentication Complete** - Ready for next features!
**Happy developing!** 📱✨