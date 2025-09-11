# Type Definitions Documentation

This document describes the type system used in the DMS (Document Management System) React Native application.

## 📁 File Structure

```
src/types/
├── global.d.ts          # Main type definitions file
├── react-native.d.ts    # React Native specific declarations
├── index.ts            # Re-exports for backward compatibility
└── types.ts            # Barrel export file
```

## 🔧 Migration from Interfaces to Types

All interfaces have been converted to types and moved to `global.d.ts` for better type management and consistency.

### Before (Interfaces)

```typescript
export interface UserData {
  mobile_number: string;
  token: string;
}
```

### After (Types)

```typescript
export type UserData = {
  mobile_number: string;
  token: string;
};
```

## 📋 Type Categories

### 1. Authentication Types

- `UserData` - User information
- `LoginFormData` - Login form data
- `OTPFormData` - OTP form data
- `OTPGenerateRequest` - OTP generation API request
- `OTPValidateRequest` - OTP validation API request
- `OTPValidateResponse` - OTP validation API response

### 2. Document Types

- `Tag` - Document tag structure
- `Document` - Complete document information
- `DocumentUploadData` - Document upload payload
- `DocumentSearchRequest` - Document search parameters
- `DocumentTagsRequest` - Tag search parameters
- `SearchFilters` - Search filter options

### 3. API Types

- `ApiResponse<T>` - Generic API response wrapper
- `PaginationParams` - Pagination parameters

### 4. Navigation Types

- `AuthStackParamList` - Authentication flow navigation
- `AppStackParamList` - Main app navigation
- `RootStackParamList` - Combined navigation types
- `LoginScreenProps` - Login screen props
- `OTPVerificationScreenProps` - OTP screen props
- `DashboardScreenProps` - Dashboard screen props

### 5. Utility Types

- `FileUpload` - File upload structure
- `ValidationResult` - Form validation result
- `LoadingState` - Loading state management
- `ErrorState` - Error state management

## 🔄 Usage Examples

### Importing Types

```typescript
// Recommended: Import from global types
import type { UserData, ApiResponse } from '../types/global';

// Alternative: Import from index (backward compatibility)
import type { UserData, ApiResponse } from '../types';
```

### Type Usage in Components

```typescript
const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    mobile_number: '',
  });
  // ...
};
```

### Type Usage in API Services

```typescript
class ApiService {
  async generateOTP(data: OTPGenerateRequest): Promise<AxiosResponse> {
    return apiClient.post('/generateOTP', data);
  }
}
```

## ✅ Benefits of Type Migration

1. **Better IntelliSense**: Enhanced autocomplete and error detection
2. **Centralized Management**: All types in one location
3. **Type Safety**: Compile-time error checking
4. **Consistency**: Uniform type declaration style
5. **Maintainability**: Easier to update and extend types

## 🛠️ Best Practices

### 1. Import Types with `type` keyword

```typescript
// Good
import type { UserData } from '../types/global';

// Avoid (imports as value)
import { UserData } from '../types/global';
```

### 2. Use Generic Types for Reusability

```typescript
export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};
```

### 3. Optional vs Required Properties

```typescript
export type DocumentSearchRequest = {
  major_head?: string; // Optional
  minor_head?: string; // Optional
  start: number; // Required
  length: number; // Required
};
```

### 4. Union Types for State Management

```typescript
export type LoadingState = {
  isLoading: boolean;
  message?: string;
};
```

## 📝 Type Definition Guidelines

1. **Use descriptive names** - `DocumentUploadData` vs `UploadData`
2. **Group related types** - Authentication, Document, API, etc.
3. **Use optional properties** judiciously - Mark properties as optional only when they truly are
4. **Extend base types** when possible for consistency
5. **Document complex types** with comments when necessary

## 🔍 Type Checking

The TypeScript compiler will now enforce type safety across the application:

- ✅ Function parameters must match expected types
- ✅ API responses conform to defined interfaces
- ✅ Component props are properly typed
- ✅ State variables have correct types

## 📋 Future Considerations

As the application grows, consider:

- Adding more specific union types for states
- Creating mapped types for form validation
- Using conditional types for complex API responses
- Adding utility types for common patterns
