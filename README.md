# Document Management System (DMS) - React Native App

A comprehensive mobile application built with React Native that allows users to manage documents effectively with features like upload, tagging, searching, preview, and download capabilities.

## 🚀 Features

### Authentication

- **OTP-Based Login**: Secure login using mobile number and OTP verification
- **Token-based Authentication**: JWT token storage for authenticated requests
- **Session Management**: Persistent login state with Redux Persist
- **Auto Rehydration**: Automatic state restoration on app restart

### Document Management

- **Upload Documents**: Upload files with metadata and tags
- **Search & Filter**: Advanced search functionality with multiple criteria
- **Preview Documents**: In-app document preview capabilities
- **Download Documents**: Download files to device storage
- **Tag Management**: Organize documents with custom tags

## 🛠️ Technology Stack

- **React Native**: 0.81.1 - Mobile app framework
- **TypeScript**: Type-safe development
- **React Navigation**: 7.1.17 - Screen navigation
- **React Query**: 5.87.4 - Server state management and caching
- **Redux Toolkit**: 2.4.0 - Client state management
- **Redux Persist**: 6.0.0 - State persistence
- **Axios**: 1.11.0 - HTTP client for API calls

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
│   ├── redux.ts       # Typed Redux hooks
│   └── useApi.ts      # React Query API hooks
├── screens/           # Application screens
│   ├── LoginScreen.tsx
│   ├── OTPVerificationScreen.tsx
│   └── DashboardScreen.tsx
├── services/          # API and business logic
│   ├── api.ts         # API service with endpoints
│   └── auth.ts        # Authentication service
├── store/             # Redux store configuration
│   ├── index.ts       # Store setup with persist
│   └── slices/        # Redux slices
│       └── authSlice.ts
├── navigation/        # Navigation configuration
│   └── Navigation.tsx
├── types/            # TypeScript type definitions
│   ├── global.d.ts   # Global type definitions
│   ├── types.ts      # Additional types
│   └── index.ts      # Type exports
└── utils/            # Helper functions and utilities
    └── auth.ts       # Authentication utilities
```

## 🔧 Setup & Installation

### Prerequisites

- Node.js (>= 16)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd DMSApp
   ```

2. **Install dependencies**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **iOS Setup** (macOS only)

   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

4. **Start Metro Server**

   ```bash
   yarn start
   # or
   npm start
   ```

5. **Run the app**

   For Android:

   ```bash
   yarn android
   # or
   npm run android
   ```

   For iOS:

   ```bash
   yarn ios
   # or
   npm run ios
   ```

## 📱 App Architecture

### State Management

- **Redux Toolkit**: Handles authentication state (token, user data, login status)
- **Redux Persist**: Persists authentication state across app restarts
- **React Query**: Manages all API calls, caching, and server state

### API Integration

- **Base URL**: `https://apis.allsoft.co/api/documentManagement`
- **Authentication**: Token-based with automatic header injection
- **Error Handling**: Centralized error handling with user-friendly messages
- **Caching**: Intelligent caching with React Query

### Navigation Flow

1. **Splash/Loading**: App initialization with state rehydration
2. **Login Screen**: Mobile number input and OTP generation
3. **OTP Verification**: OTP input and validation
4. **Dashboard**: Main app interface with document management features

## 🔐 Authentication Flow

1. User enters mobile number
2. OTP is generated and sent via SMS
3. User enters received OTP
4. OTP is validated, and JWT token is received
5. Token is stored in Redux store and persisted
6. User is navigated to the main dashboard

## 📡 API Endpoints

### Authentication

- `POST /generateOTP` - Generate OTP for mobile number
- `POST /validateOTP` - Validate OTP and get access token

### Document Management

- `POST /saveDocumentEntry` - Upload new document
- `POST /searchDocumentEntry` - Search documents
- `POST /documentTags` - Get available tags

## 🧪 Testing

Run tests with:

```bash
yarn test
# or
npm test
```

## 📚 Type Safety

The project uses TypeScript with comprehensive type definitions:

- **Global Types**: Defined in `src/types/global.d.ts`
- **API Types**: Request/Response interfaces
- **Component Props**: Strongly typed component interfaces
- **Redux Types**: Typed actions and state

## 🔍 Development Tools

### Available Scripts

- `yarn start` - Start Metro server
- `yarn android` - Run Android app
- `yarn ios` - Run iOS app
- `yarn lint` - Run ESLint
- `yarn test` - Run tests
- `npx tsc --noEmit` - Type checking

### Debugging

- **React Native Debugger**: For Redux DevTools and React DevTools
- **Flipper**: For network requests and performance monitoring
- **React Query DevTools**: For inspecting cache and queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

## 🚀 Getting Started

> **Note**: Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

### Quick Start Commands

Start Metro:

```bash
yarn start
```

Run on Android:

```bash
yarn android
```

Run on iOS:

```bash
yarn ios
```

## 📱 App Features in Detail

### Current Implementation

- ✅ OTP-based authentication system
- ✅ Redux Toolkit + Redux Persist for state management
- ✅ React Query for API calls and caching
- ✅ TypeScript for type safety
- ✅ Responsive UI with React Native components

### Upcoming Features

- 🔄 Document upload functionality
- 🔄 Document search and filtering
- 🔄 Document preview and download
- 🔄 Tag management system
- 🔄 Offline support

## 🔧 Troubleshooting

### Common Issues

1. **Metro Server Issues**

   ```bash
   npx react-native start --reset-cache
   ```

2. **Android Build Issues**

   ```bash
   cd android
   ./gradlew clean
   cd ..
   yarn android
   ```

3. **iOS Build Issues**

   ```bash
   cd ios
   rm -rf Pods
   bundle exec pod install
   cd ..
   yarn ios
   ```

4. **TypeScript Errors**
   ```bash
   npx tsc --noEmit
   ```

For more troubleshooting tips, visit the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting).

## 📚 Learn More

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
