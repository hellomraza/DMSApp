# File Upload API Implementation

## Overview

Successfully implemented a comprehensive file upload API system that works with both Mock and Real API endpoints. The implementation includes enhanced file handling, validation, progress tracking, and error management.

## Implementation Components

### 1. Enhanced API Service (`src/services/api.ts`)

#### Key Features

- **Multi-platform file handling** (iOS/Android compatible)
- **File validation** before upload (type, size, existence checks)
- **Progress tracking** with upload progress callbacks
- **Enhanced error handling** with specific error messages
- **Download functionality** for retrieving uploaded documents
- **File existence verification** using react-native-fs

#### New Methods

```typescript
// Enhanced upload with validation and progress
uploadDocument(file: any, data: DocumentUploadData): Promise<AxiosResponse>

// Download documents to local storage
downloadDocument(documentId: string, fileName: string): Promise<string>

// Delete documents from server
deleteDocument(documentId: string): Promise<AxiosResponse>

// Validate files before upload
validateFile(file: any): { isValid: boolean; error?: string }

// Get upload status for large files
getUploadStatus(uploadId: string): Promise<AxiosResponse>
```

#### File Upload Process

1. **Initialize file manager** for proper file handling
2. **Validate file existence** and get accurate file stats
3. **Platform-specific handling** for iOS/Android differences
4. **Create FormData** with file and metadata
5. **Upload with progress tracking** and timeout handling
6. **Enhanced error management** with specific error types

### 2. API Switcher Enhancement (`src/services/apiSwitcher.ts`)

#### New Capabilities

- **Unified file validation** for both Mock and Real APIs
- **Download management** (Mock mode shows appropriate messages)
- **Delete operations** for both API modes
- **Upload progress tracking** integration

#### Usage

```typescript
// Seamlessly switch between APIs
const validation = apiSwitcher.validateFile(file);
if (validation.isValid) {
  const response = await apiSwitcher.uploadDocument(file, data);
}

// Delete documents regardless of API mode
await apiSwitcher.deleteDocument(documentId);
```

### 3. Enhanced FileUploadComponent (`src/components/ui/FileUploadComponent.tsx`)

#### Improvements

- **Individual file upload** with proper error handling per file
- **File validation** before submission
- **Progress feedback** during upload process
- **Form reset** after successful upload
- **Enhanced user feedback** with specific error messages

#### Upload Flow

1. **File Selection** → Temporary storage with file manager
2. **Form Validation** → Check required fields and file validity
3. **File Upload** → Individual upload with progress tracking
4. **Success Handling** → User feedback and form reset
5. **Error Handling** → Specific error messages and retry options

### 4. API Test Lab (`src/screens/APITestScreen.tsx`)

#### Features

- **API Mode Display** showing current Mock/Real API status
- **Connectivity Testing** for Real API endpoints
- **Live Upload Testing** with both API modes
- **Test Results History** with success/failure tracking
- **Visual Status Indicators** for easy mode identification

#### Testing Capabilities

```typescript
// Test API connectivity
await testConnectivity();

// Monitor upload results
const result = {
  timestamp: new Date().toLocaleTimeString(),
  mode: apiSwitcher.isMockMode() ? 'Mock API' : 'Real API',
  status: 'Success' | 'Error',
  message: 'Detailed result message',
};
```

## File Validation Rules

### Supported File Types

- **Documents**: PDF, DOC, DOCX
- **Images**: JPEG, JPG, PNG, GIF
- **Size Limit**: 50MB maximum per file

### Validation Process

```typescript
const validation = apiService.validateFile(file);
// Returns: { isValid: boolean; error?: string }

// Validation checks:
// ✓ File existence
// ✓ File type allowlist
// ✓ File size limits
// ✓ Required metadata
```

## Error Handling

### Specific Error Types

- **File Not Found** (`ENOENT`): File path invalid or file deleted
- **Network Error** (`NETWORK_ERROR`): Internet connectivity issues
- **File Too Large** (HTTP 413): Exceeds 50MB limit
- **Unsupported Type** (HTTP 415): File type not allowed
- **Server Errors** (HTTP 5xx): Backend processing issues

### Error Messages

```typescript
// User-friendly error messages
'File not found. Please select a valid file.';
'File is too large. Maximum size is 50MB.';
'File type not supported. Please select PDF, Image, or Document files.';
'Network error. Please check your internet connection.';
```

## API Endpoints

### Upload Endpoint

```
POST /saveDocumentEntry
Content-Type: multipart/form-data

FormData:
- file: Binary file data
- major_head: Category (Personal/Professional)
- minor_head: Subcategory
- document_date: Upload date
- document_remarks: Optional remarks
- tags: JSON array of tags
```

### Download Endpoint

```
GET /downloadDocument/{documentId}
Headers:
- token: Authentication token

Response: Binary file stream
```

### Delete Endpoint

```
DELETE /deleteDocument/{documentId}
Headers:
- token: Authentication token

Response: Success/error status
```

## React Native FS Integration

### File Management Benefits

- **Temporary Storage**: Files saved temporarily during processing
- **File Validation**: Existence and metadata verification
- **Cross-platform**: Consistent behavior on iOS/Android
- **Storage Analytics**: Track file usage and cleanup

### File Paths

```typescript
// iOS Paths
Documents: ~/Documents/DMSDocuments/
Downloads: ~/Documents/Downloads/

// Android Paths
Documents: /Android/data/com.dmsapp/files/DMSDocuments/
Downloads: /Android/data/com.dmsapp/files/Downloads/
```

## Usage Examples

### Basic File Upload

```typescript
// Select and upload file
const uploadFile = async (fileUri: string) => {
  const fileData = {
    uri: fileUri,
    name: 'document.pdf',
    type: 'application/pdf',
  };

  const documentData: DocumentUploadData = {
    major_head: 'Personal',
    minor_head: 'Legal',
    document_date: '2025-09-12',
    document_remarks: 'Important contract',
    tags: [{ tag_name: 'legal' }],
    user_id: 'user123',
  };

  try {
    const response = await apiSwitcher.uploadDocument(fileData, documentData);
    console.log('Upload successful:', response.data);
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
};
```

### File Validation

```typescript
// Validate before upload
const handleFileSelection = async (file: any) => {
  const validation = apiSwitcher.validateFile(file);

  if (!validation.isValid) {
    Alert.alert('Invalid File', validation.error);
    return;
  }

  // Proceed with upload
  await uploadFile(file);
};
```

### Download File

```typescript
// Download document (Real API only)
const downloadDoc = async (docId: string, fileName: string) => {
  try {
    const localPath = await apiSwitcher.downloadDocument(docId, fileName);
    Alert.alert('Downloaded', `File saved to: ${localPath}`);
  } catch (error) {
    Alert.alert('Download Failed', error.message);
  }
};
```

## Testing & Development

### API Test Lab Features

1. **Mode Switching**: Toggle between Mock/Real APIs
2. **Connectivity Tests**: Verify Real API availability
3. **Upload Testing**: Test file uploads in both modes
4. **Result Tracking**: Monitor success/failure rates
5. **Debug Information**: Detailed logs and error messages

### Development Workflow

1. **Start with Mock API** for offline development
2. **Test file validation** with various file types
3. **Switch to Real API** when backend is available
4. **Use API Test Lab** to compare behaviors
5. **Monitor upload progress** and error handling

## Configuration

### API Configuration

```typescript
// In .env or Config
API_BASE_URL=https://your-api-server.com/api
```

### File Size Limits

```typescript
// Modify in api.ts
const maxSize = 50 * 1024 * 1024; // 50MB
```

### Supported Types

```typescript
// Extend in validateFile method
const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  // Add new types here
];
```

## Security Considerations

1. **File Type Validation**: Server-side validation required
2. **Size Limits**: Prevent large file attacks
3. **Authentication**: Token-based API access
4. **Virus Scanning**: Implement server-side scanning
5. **Storage Limits**: Per-user storage quotas

## Performance Optimization

1. **Progress Tracking**: User feedback during uploads
2. **File Compression**: Reduce file sizes before upload
3. **Chunked Upload**: For very large files (future enhancement)
4. **Caching**: Local file caching with react-native-fs
5. **Cleanup**: Regular temporary file cleanup

## Future Enhancements

1. **Batch Upload**: Multiple files in single request
2. **Resume Upload**: Resume interrupted uploads
3. **File Compression**: Automatic image compression
4. **Cloud Storage**: Direct cloud provider integration
5. **Metadata Extraction**: Automatic document metadata parsing

## Status

✅ Complete file upload API implementation
✅ Cross-platform file handling
✅ Both Mock and Real API support
✅ Comprehensive error handling
✅ File validation and progress tracking
✅ API Test Lab for development
✅ Ready for production deployment
