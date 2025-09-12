# Development Guide

This guide provides essential information for developers working on the DMS React Native application.

## 🏗️ Architecture Overview

### State Management Strategy

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Redux Store   │    │   React Query    │    │   Local State   │
│                 │    │                  │    │                 │
│ • Auth State    │    │ • API Calls      │    │ • Form Data     │
│ • User Data     │    │ • Caching        │    │ • UI State      │
│ • Login Status  │    │ • Loading States │    │ • Temporary     │
│                 │    │ • Error Handling │    │   Variables     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
       │                         │                        │
       └─────────────────────────┼────────────────────────┘
                                 │
                    ┌─────────────▼──────────────┐
                    │      React Components      │
                    └────────────────────────────┘
```

### Data Flow

1. **Authentication**: Redux stores token/user state, persisted via Redux Persist
2. **API Calls**: React Query manages server communication and caching
3. **UI State**: Local component state for forms and temporary UI states

## 🛠️ Development Setup

### Prerequisites

- Node.js 16+
- React Native CLI
- Android Studio / Xcode
- VS Code (recommended) with extensions:
  - React Native Tools
  - TypeScript and JavaScript Language Features
  - Redux DevTools
  - ES7+ React/Redux/React-Native snippets

### Environment Setup

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd DMSApp
   yarn install
   ```

2. **iOS Setup** (macOS only)

   ```bash
   cd ios && bundle install && bundle exec pod install && cd ..
   ```

3. **Environment Configuration**
   Create `.env` files if needed for different environments.

### Development Workflow

1. **Start Development**

   ```bash
   # Terminal 1: Start Metro
   yarn start

   # Terminal 2: Run on device/simulator
   yarn android  # or yarn ios
   ```

2. **Code Quality Checks**

   ```bash
   # TypeScript check
   npx tsc --noEmit

   # Linting
   yarn lint

   # Tests
   yarn test
   ```

## 📁 Code Organization

### Directory Structure Guidelines

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, etc.)
│   └── specific/       # Feature-specific components
├── hooks/              # Custom React hooks
│   ├── redux.ts       # Typed Redux hooks
│   └── useApi.ts      # React Query API hooks
├── screens/           # Screen components
│   ├── auth/         # Authentication screens
│   └── documents/    # Document management screens
├── services/          # External services and APIs
├── store/            # Redux configuration
├── navigation/       # Navigation setup
├── types/           # TypeScript definitions
├── utils/           # Helper functions
└── constants/       # App constants
```

### File Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`)
- **Types**: PascalCase (`UserData`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 🎯 Component Development

### Component Template

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress?: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyComponent;
```

### Hook Development

```typescript
// Custom API hook template
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useMyApiCall = () => {
  return useMutation({
    mutationFn: (data: RequestType) => apiService.myEndpoint(data),
    onSuccess: response => {
      console.log('Success:', response.data);
    },
    onError: (error: any) => {
      console.error('Error:', error);
    },
  });
};
```

## 🔄 State Management Patterns

### Redux Actions (Auth Only)

```typescript
// Simple synchronous actions for auth state
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
    },
    logout: state => {
      state.token = null;
      state.userData = null;
      state.isAuthenticated = false;
    },
  },
});
```

### React Query Patterns

```typescript
// Mutations for API calls
const mutation = useMyApiCall();

const handleAction = () => {
  mutation.mutate(data, {
    onSuccess: response => {
      // Handle success
    },
    onError: error => {
      // Handle error
    },
  });
};

// Queries for data fetching
const { data, isLoading, error } = useQuery({
  queryKey: ['myData', params],
  queryFn: () => apiService.fetchData(params),
  enabled: !!params, // Conditional fetching
});
```

## 🎨 UI Development Guidelines

### Styling Best Practices

1. **Use StyleSheet.create()** for better performance
2. **Create reusable style constants**
3. **Follow responsive design principles**
4. **Use consistent spacing and colors**

### Theme Structure

```typescript
// colors.ts
export const Colors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  danger: '#e74c3c',
  warning: '#f39c12',
  text: '#2c3e50',
  background: '#ffffff',
  border: '#bdc3c7',
};

// spacing.ts
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

## 🧪 Testing Strategy

### Unit Testing

```typescript
// Component testing template
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<MyComponent title="Test Title" />);

    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should handle press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <MyComponent title="Test" onPress={onPress} />,
    );

    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### API Testing

```typescript
// Mock API responses for testing
jest.mock('../services/api', () => ({
  apiService: {
    generateOTP: jest.fn(),
    validateOTP: jest.fn(),
  },
}));
```

## 🐛 Debugging Tips

### React Native Debugger

1. Install React Native Debugger
2. Enable Redux DevTools extension
3. Monitor network requests and Redux actions

### Common Issues and Solutions

1. **Metro Cache Issues**

   ```bash
   npx react-native start --reset-cache
   rm -rf node_modules && yarn install
   ```

2. **Android Build Issues**

   ```bash
   cd android && ./gradlew clean && cd ..
   ```

3. **iOS Build Issues**

   ```bash
   cd ios && rm -rf Pods && pod install && cd ..
   ```

4. **TypeScript Errors**
   ```bash
   # Check types without building
   npx tsc --noEmit
   ```

### Performance Monitoring

- Use Flipper for performance monitoring
- Monitor bundle size with `yarn analyze`
- Use React DevTools Profiler for component performance

## 📝 Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Components are properly tested
- [ ] Code follows naming conventions
- [ ] No console.log statements in production code
- [ ] Accessibility props are added where needed
- [ ] Performance optimizations are considered

## 🚀 Deployment

### Build Commands

```bash
# Android Release Build
cd android && ./gradlew assembleRelease

# iOS Release Build (requires Xcode)
yarn ios --configuration Release
```

### Pre-deployment Checklist

- [ ] All tests pass
- [ ] TypeScript compilation succeeds
- [ ] Linting passes
- [ ] App tested on both platforms
- [ ] API endpoints configured for production
- [ ] Sensitive data removed from code
