# TCG Marketplace - Mobile App

React Native mobile application for the TCG (Trading Card Game) marketplace built with Expo and integrated with a Rails API backend.

## 🎉 **Project Status: Authentication Complete!**

✅ **Complete end-to-end authentication system**
✅ **Rails API integration with session management**
✅ **Secure token storage and session restoration**
✅ **Protected navigation with automatic redirects**
✅ **Jest testing framework with 10 passing tests**

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 20.17.0+
- npm or yarn

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
- **Jest** with TypeScript support
- **10 passing tests** covering authentication logic
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
- ✅ **Jest testing framework** with TypeScript
- ✅ **10 passing tests** (100% success rate)
- ✅ **Authentication logic validation**
- ✅ **API mocking and error scenarios**
- ✅ **Comprehensive test coverage**

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
# Run all tests
npm test

# Run specific test patterns
npm test -- --testPathPatterns="basic|auth-logic"

# Run tests in watch mode
npm run test:watch

# TypeScript type checking
npx tsc --noEmit
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
- Check Jest configuration in `package.json`
- Ensure all dependencies are installed

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