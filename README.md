# TCG Marketplace - Mobile App

React Native mobile application for the TCG (Trading Card Game) marketplace built with Expo.

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

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **TanStack React Query** for API state management
- **Axios** for HTTP requests

## 📂 **Project Structure**

```
app/
├── (auth)/              # Authentication screens
│   ├── signin.tsx       # Sign-in form
│   ├── register.tsx     # Registration form
│   └── _layout.tsx      # Auth navigation
├── (tabs)/              # Main app tabs
│   ├── index.tsx        # Home screen
│   └── _layout.tsx      # Tab navigation
├── index.tsx            # App entry point
└── _layout.tsx          # Root navigation

components/
├── auth/                # Authentication components
│   └── AuthContext.tsx  # Auth state management
└── ...                  # Other reusable components

constants/
└── Colors.ts            # Theme colors
```

## ✨ **Current Features**

- ✅ **User Authentication** (Sign-in/Registration forms)
- ✅ **Form Validation** with error handling
- ✅ **Cross-platform** support (iOS, Android, Web)
- ✅ **Dark/Light theme** support
- ✅ **Responsive design** for different screen sizes

## 🧪 **Development Commands**

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

## 📋 **Coming Soon**

- 🚧 Card marketplace browsing
- 🚧 User profiles and collections
- 🚧 Payment integration
- 🚧 Real-time messaging
- 🚧 Push notifications

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

### **Clear Cache**
```bash
# Clear Expo cache
npx expo start --clear

# Clear npm cache
npm start -- --reset-cache
```

---

**Happy developing!** 📱✨