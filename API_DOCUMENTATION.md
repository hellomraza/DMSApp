# API Documentation

This document describes the API integration and React Query hooks used in the DMS React Native application.

## 🌐 Base Configuration

```typescript
const API_BASE_URL = 'https://apis.allsoft.co/api/documentManagement';
```

### Authentication

All API requests (except authentication endpoints) include an authorization token in the header:

```typescript
headers: {
  token: '<JWT_TOKEN>';
}
```

## 🔐 Authentication Endpoints

### Generate OTP

**Endpoint**: `POST /generateOTP`

**Hook**: `useGenerateOTP()`

**Request**:

```typescript
{
  mobile_number: string; // 10-digit mobile number
}
```

**Response**:

```typescript
{
  success: boolean;
  message: string;
}
```

**Usage Example**:

```typescript
const generateOTPMutation = useGenerateOTP();

const handleSendOTP = () => {
  generateOTPMutation.mutate(
    { mobile_number: '9876543210' },
    {
      onSuccess: response => {
        console.log('OTP sent successfully');
      },
      onError: error => {
        console.error('Failed to send OTP:', error);
      },
    },
  );
};

// Loading state
const isLoading = generateOTPMutation.isPending;
```

### Validate OTP

**Endpoint**: `POST /validateOTP`

**Hook**: `useValidateOTP()`

**Request**:

```typescript
{
  mobile_number: string;
  otp: string; // 6-digit OTP
}
```

**Response**:

```typescript
{
  token: string;
  success: boolean;
  message: string;
}
```

**Usage Example**:

```typescript
const validateOTPMutation = useValidateOTP();

const handleVerifyOTP = () => {
  validateOTPMutation.mutate(
    {
      mobile_number: '9876543210',
      otp: '123456',
    },
    {
      onSuccess: response => {
        if (response.data.success) {
          // Store token and navigate to dashboard
          dispatch(
            loginSuccess({
              token: response.data.token,
              userData: { mobile_number, token: response.data.token },
            }),
          );
        }
      },
      onError: error => {
        console.error('Invalid OTP:', error);
      },
    },
  );
};
```

## 📄 Document Management Endpoints

### Upload Document

**Endpoint**: `POST /saveDocumentEntry`

**Hook**: `useUploadDocument()`

**Request**: FormData with:

- `file`: Document file
- `data`: JSON string containing:
  ```typescript
  {
    major_head: string;
    minor_head: string;
    document_date: string; // YYYY-MM-DD format
    document_remarks: string;
    tags: string[]; // Array of tag names
  }
  ```

**Response**:

```typescript
{
  success: boolean;
  message: string;
  data?: {
    document_id: string;
  }
}
```

**Usage Example**:

```typescript
const uploadMutation = useUploadDocument();

const handleUpload = (file: any, documentData: DocumentUploadData) => {
  uploadMutation.mutate(
    { file, data: documentData },
    {
      onSuccess: response => {
        console.log('Document uploaded:', response.data);
      },
      onError: error => {
        console.error('Upload failed:', error);
      },
    },
  );
};
```

### Search Documents

**Endpoint**: `POST /searchDocumentEntry`

**Hook**: `useSearchDocuments()`

**Request**:

```typescript
{
  search_query?: string;
  major_head?: string;
  minor_head?: string;
  tags?: string[];
  date_from?: string; // YYYY-MM-DD
  date_to?: string;   // YYYY-MM-DD
}
```

**Response**:

```typescript
{
  success: boolean;
  message: string;
  data?: Document[];
}
```

**Usage Example**:

```typescript
const searchMutation = useSearchDocuments();

const handleSearch = (searchParams: DocumentSearchRequest) => {
  searchMutation.mutate(searchParams, {
    onSuccess: response => {
      if (response.data.success) {
        setDocuments(response.data.data || []);
      }
    },
    onError: error => {
      console.error('Search failed:', error);
    },
  });
};
```

### Get Document Tags

**Endpoint**: `POST /documentTags`

**Hook**: `useDocumentTags()`

**Request**:

```typescript
{
  search_query?: string;
}
```

**Response**:

```typescript
{
  success: boolean;
  message: string;
  data?: Tag[];
}
```

**Usage Example**:

```typescript
const {
  data: tagsResponse,
  isLoading,
  error,
  refetch,
} = useDocumentTags(
  { search_query: '' },
  true, // enabled
);

// Access the tags
const tags = tagsResponse?.data?.data || [];
```

## 🔄 React Query Features

### Caching Strategy

- **Document Tags**: Cached for 5 minutes (staleTime: 5 _ 60 _ 1000)
- **Garbage Collection**: Data removed after 10 minutes of being unused
- **Background Refetch**: Automatic updates when data becomes stale

### Error Handling

All hooks include automatic error handling:

- Network errors are caught and exposed via the `error` property
- API errors (non-2xx responses) are handled by Axios interceptors
- User-friendly error messages are provided in `onError` callbacks

### Loading States

- `isPending`: Request is in progress
- `isLoading`: First-time loading (for queries)
- `isFetching`: Any fetch operation (including background refetch)

### Mutation States

```typescript
const mutation = useGenerateOTP();

// States available:
mutation.isPending; // Request in progress
mutation.isError; // Request failed
mutation.isSuccess; // Request succeeded
mutation.error; // Error object (if any)
mutation.data; // Response data (if successful)
```

## 🛠️ Configuration

### API Client Setup

```typescript
// Axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for token
apiClient.interceptors.request.use(config => {
  const token = getCurrentToken();
  if (token) {
    config.headers.token = token;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);
```

### Query Client Configuration

React Query is configured in `App.tsx` with default settings optimized for mobile apps:

- Automatic retries for failed requests
- Background refetching on focus
- Stale-while-revalidate strategy

## 🐛 Error Handling

### Common Error Scenarios

1. **Network Errors**: No internet connection
2. **Authentication Errors**: Invalid or expired token
3. **Validation Errors**: Invalid request parameters
4. **Server Errors**: API endpoint failures

### Error Response Format

```typescript
{
  response: {
    data: {
      success: false,
      message: "Error description"
    },
    status: 400 | 401 | 403 | 404 | 500
  }
}
```

### Best Practices

- Always handle both `onSuccess` and `onError` callbacks
- Use mutation states to show appropriate UI feedback
- Display user-friendly error messages
- Implement retry mechanisms for transient failures
