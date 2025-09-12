# React Native FS Integration Guide

## Overview

Successfully integrated `react-native-fs` for comprehensive file management in the Document Management System (DMS). This provides better file organization, storage management, and offline capabilities.

## Installation

react-native-fs is already installed in package.json:

```json
"react-native-fs": "^2.20.0"
```

## File Manager Service (`src/services/fileManager.ts`)

### Features

- **Cross-platform directory management** (iOS/Android)
- **Organized file storage** with categories (documents, images, temp, cache)
- **Temporary file handling** for processing and preview
- **File lifecycle management** with automatic cleanup
- **Storage analytics** and usage monitoring

### Directory Structure

```
iOS:
- Documents: ~/Documents/DMSDocuments/
- Temporary: ~/tmp/DMSTemp/
- Cache: ~/Library/Caches/DMSCache/

Android:
- Documents: /storage/emulated/0/Android/data/com.dmsapp/files/DMSDocuments/
- Temporary: /storage/emulated/0/Android/data/com.dmsapp/files/DMSTemp/
- Cache: /storage/emulated/0/Android/data/com.dmsapp/files/DMSCache/
```

### Key Methods

#### File Operations

```typescript
// Save file to permanent storage
const managedFile = await fileManager.saveFile(
  {
    uri: 'file://path/to/file',
    name: 'document.pdf',
    type: 'application/pdf',
    size: 1024,
  },
  'documents',
);

// Save to temporary storage (for processing)
const tempFile = await fileManager.saveTemporaryFile(fileInfo);

// Delete managed file
await fileManager.deleteFile(fileId, filePath);

// Check file existence
const exists = await fileManager.fileExists(filePath);
```

#### Storage Management

```typescript
// Get storage usage information
const storageInfo = await fileManager.getStorageInfo();

// Clean temporary files older than X hours
const deletedCount = await fileManager.cleanTemporaryFiles(24);

// List files in directory
const files = await fileManager.listFiles('documents');

// Move temp file to permanent storage
const newPath = await fileManager.promoteTemporaryFile(tempPath, 'documents');
```

## Integration Points

### 1. FileUploadComponent Integration

**Location**: `src/components/ui/FileUploadComponent.tsx`

**Changes Made**:

- All file selections (camera, gallery, documents) now use temporary storage
- Files are saved with file manager before being added to state
- Better error handling with fallback to original file handling

**Example**:

```typescript
// Camera capture with file manager
const tempFile = await fileManager.saveTemporaryFile({
  uri: asset.uri!,
  type: asset.type!,
  name: asset.fileName || `camera_${Date.now()}.jpg`,
  size: asset.fileSize,
});

// Use managed file path
const file: UploadedFile = {
  uri: tempFile.localPath,
  type: tempFile.type,
  name: tempFile.name,
  size: tempFile.size,
};
```

### 2. Mock API Service Integration

**Location**: `src/services/mockApiService.ts`

**Changes Made**:

- Document uploads now save files using file manager
- Files are categorized (documents vs images)
- Storage cleanup integration
- File deletion includes managed file cleanup

**Enhanced Upload Flow**:

```typescript
// Save file with file manager during upload
const managedFile = await fileManager.saveFile(fileInfo, category);

// Store file metadata with local path
const documentEntry = {
  id: documentId,
  file: {
    id: managedFile.id,
    localPath: managedFile.localPath,
    managedFile: true,
    // ... other properties
  },
};
```

### 3. Developer Utils Integration

**Location**: `src/screens/DevUtilsScreen.tsx`

**New Features**:

- Storage usage display with formatted sizes
- Temporary file cleanup utility
- Real-time storage information refresh
- File management controls

**Storage Display**:

```typescript
const storageInfo = await fileManager.getStorageInfo();
// Shows: Documents, Temporary, Cache, Total usage
```

## Type Definitions

**Location**: `src/types/global.d.ts`

Added comprehensive types:

```typescript
type ManagedFile = {
  id: string;
  originalUri: string;
  localPath: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  isTemporary: boolean;
};

type FileInfo = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

type StorageInfo = {
  documentsSize: number;
  tempSize: number;
  cacheSize: number;
  totalSize: number;
};
```

## File Lifecycle

### 1. File Selection (Temporary)

```
User selects file → fileManager.saveTemporaryFile() → Temporary storage
```

### 2. Document Upload (Permanent)

```
Form submit → fileManager.saveFile() → Permanent storage → Database entry
```

### 3. File Cleanup

```
Background process → fileManager.cleanTemporaryFiles() → Remove old temp files
```

## Benefits

### 1. **Organized Storage**

- Files are properly categorized and organized
- Clear separation between temporary and permanent files
- Platform-specific optimal storage locations

### 2. **Better Performance**

- Temporary files for processing reduce memory usage
- Efficient file operations with native filesystem APIs
- Automatic cleanup prevents storage bloat

### 3. **Offline Capabilities**

- Files remain accessible when offline
- Local file paths ensure consistent access
- Mock API works completely offline

### 4. **Storage Management**

- Real-time storage usage monitoring
- Automated cleanup of temporary files
- Manual storage management tools

### 5. **Error Handling**

- Graceful fallback to original file handling
- Comprehensive error logging
- Storage operation validation

## Usage Examples

### Basic File Save

```typescript
import { fileManager } from '../services/fileManager';

const saveDocument = async (fileUri: string) => {
  try {
    const managedFile = await fileManager.saveFile(
      {
        uri: fileUri,
        name: 'contract.pdf',
        type: 'application/pdf',
      },
      'documents',
    );

    console.log('File saved:', managedFile.localPath);
  } catch (error) {
    console.error('Failed to save file:', error);
  }
};
```

### Storage Monitoring

```typescript
const checkStorage = async () => {
  const info = await fileManager.getStorageInfo();
  console.log(`Total storage used: ${formatBytes(info.totalSize)}`);

  if (info.tempSize > 50 * 1024 * 1024) {
    // 50MB
    await fileManager.cleanTemporaryFiles(6); // Clean files older than 6 hours
  }
};
```

### File Promotion

```typescript
// Move from temporary to permanent storage
const processedPath = await fileManager.promoteTemporaryFile(
  tempFilePath,
  'documents',
);
```

## Configuration Options

### Directory Customization

Modify the constructor in `fileManager.ts` to change directory names:

```typescript
this.documentsDir = RNFS.DocumentDirectoryPath + '/CustomDocuments';
```

### Cleanup Intervals

Adjust automatic cleanup timing:

```typescript
await fileManager.cleanTemporaryFiles(12); // 12 hours instead of 24
```

### Storage Limits

Add storage limit checking:

```typescript
const info = await fileManager.getStorageInfo();
if (info.totalSize > 100 * 1024 * 1024) {
  // 100MB limit
  // Handle storage limit exceeded
}
```

## Security Considerations

1. **File Access**: Files are stored in app-specific directories
2. **Permissions**: Uses app sandbox, no external storage permissions needed
3. **Data Persistence**: Files survive app updates but not app uninstalls
4. **Privacy**: No access to user's general file system

## Performance Tips

1. **Use Temporary Storage**: For processing and previews
2. **Regular Cleanup**: Schedule automatic temporary file cleanup
3. **Monitor Usage**: Track storage usage to prevent bloat
4. **Batch Operations**: Group file operations when possible

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure directories are created before file operations
2. **Storage Full**: Monitor and cleanup temporary files regularly
3. **File Not Found**: Check file existence before operations
4. **Path Issues**: Use absolute paths consistently

### Debug Tools

- Use DevUtilsScreen to monitor storage
- Check console logs for file operations
- Verify file paths in app directories

## Future Enhancements

1. **File Compression**: Add compression for large files
2. **Encryption**: Encrypt sensitive documents
3. **Sync**: Cloud storage synchronization
4. **Versioning**: File version management
5. **Metadata**: Extended file metadata storage

## Status

✅ Complete and functional
✅ TypeScript compliant  
✅ Cross-platform compatible
✅ Integrated with mock API system
✅ Ready for production use
