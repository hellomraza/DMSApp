# Type Definitions Documentation

This document describes the comprehensive type system used in the DMS (Document Management System) React Native application.

## 📁 File Structure

```
src/types/
├── global.d.ts          # Main type definitions file with all types
├── types.ts            # Additional type utilities and exports
└── index.ts            # Barrel export file for clean imports
```

## 🔧 Type System Architecture

The application uses TypeScript with comprehensive type definitions to ensure type safety across all components, API calls, and state management.

### Key Benefits

- **Compile-time Safety**: Catch errors before runtime
- **IntelliSense Support**: Enhanced developer experience
- **Refactoring Safety**: Confident code changes
- **API Contract Enforcement**: Typed request/response interfaces

## 📋 Type Categories

### 1. Authentication Types

```typescript
// User data structure
type UserData = {
  mobile_number: string;
  token: string;
};

// Form data types
type LoginFormData = {
  mobile_number: string;
};

type OTPFormData = {
  otp: string;
};

// API request/response types
type OTPGenerateRequest = {
  mobile_number: string;
};

type OTPValidateRequest = {
  mobile_number: string;
  otp: string;
};

type OTPValidateResponse = {
  token: string;
  success: boolean;
  message: string;
};
```

### 2. Redux State Types

```typescript
// Authentication state
type AuthState = {
  token: string | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

// Root state type
type RootState = {
  auth: AuthState;
};
```

### 3. Navigation Types

```typescript
// Root stack parameter list
type RootStackParamList = {
  Login: undefined;
  OTPVerification: {
    mobile_number: string;
  };
  Dashboard: undefined;
  DocumentUpload: undefined;
  DocumentSearch: undefined;
  DocumentList: undefined;
};
```

### 4. Document Types

```typescript
// Document tag structure
type Tag = {
  tag_name: string;
};

// Document entity
type Document = {
  id: string;
  major_head: string;
  minor_head: string;
  document_date: string;
  document_remarks: string;
  tags: Tag[];
  uploaded_by: string;
  document_url: string;
  created_at: string;
  updated_at: string;
};

// API request types
type DocumentUploadData = {
  major_head: string;
  minor_head: string;
  document_date: string;
  document_remarks: string;
  tags: string[];
};

type DocumentSearchRequest = {
  search_query?: string;
  major_head?: string;
  minor_head?: string;
  tags?: string[];
  date_from?: string;
  date_to?: string;
};

type DocumentTagsRequest = {
  search_query?: string;
};
```

### 5. API Response Types

```typescript
// Generic API response wrapper
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// Specific response types
type DocumentListResponse = ApiResponse<Document[]>;
type DocumentUploadResponse = ApiResponse<{ document_id: string }>;
type TagsResponse = ApiResponse<Tag[]>;
```

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
