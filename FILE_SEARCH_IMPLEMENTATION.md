# File Search with Preview and Download Implementation

## Overview

The File Search functionality provides a comprehensive search interface for finding documents in the DMS app with enhanced preview and download capabilities. Users can search using multiple criteria including categories, tags, date ranges, and text search, then preview and download individual files or bulk download all search results.

## Components

### FileSearchComponent

Located: `src/components/ui/FileSearchComponent.tsx`

A complete search interface component that includes:

- **Category Dropdowns**: Major head (Personal/Professional) and Minor head selections
- **Tag Input**: Add and select multiple tags for filtering
- **Date Range Pickers**: From and To date selection for filtering documents by date
- **Text Search**: Search in document names and remarks
- **Results Display**: Shows search results with document details
- **Preview Functionality**: Preview supported file types within the app
- **Download Options**: Individual file download and bulk download all results

### FileSearchScreen

Located: `src/screens/FileSearchScreen.tsx`

A dedicated screen that wraps the FileSearchComponent for navigation integration.

## Enhanced Features

### 1. Document Preview

- **Image Preview**: Direct in-app preview for image files (JPEG, PNG, GIF, BMP, WebP)
- **PDF Preview**: Preview indication with download option for PDF documents
- **Text Preview**: Preview indication for text documents
- **Unsupported Types**: Clear messaging for non-previewable file types
- **Modal Interface**: Full-screen modal for optimal preview experience

### 2. Download Functionality

- **Individual Downloads**: Download single files with progress indication
- **Bulk Download**: Download all search results at once
- **Progress Tracking**: Visual progress bars for ongoing downloads
- **File Management**: Automatic organization in Downloads folder
- **Error Handling**: Comprehensive error messaging and retry options

### 3. File Type Support

#### Previewable Types:

- Images: JPEG, JPG, PNG, GIF, BMP, WebP
- Documents: PDF, Plain text, HTML
- Preview indicators show file type and appropriate actions

#### Download Support:

- All file types supported for download
- Automatic file type detection and handling
- Platform-specific download directory management

## User Interface Enhancements

### Search Results Display

Each search result card now includes:

- **File Information**: Enhanced file details with type and size
- **Action Buttons**:
  - Preview button (enabled/disabled based on file type)
  - Download button with progress indication
- **Visual Indicators**: Clear icons and status messages
- **Progress Bars**: Real-time download progress display

### Bulk Operations

- **Download All Button**: Located in results header
- **Progress Indication**: Shows "Downloading All..." during bulk operations
- **Success Reporting**: Details on successful/failed downloads
- **Folder Access**: Quick link to open downloads folder

### Preview Modal

- **Full-Screen Experience**: Optimized for document viewing
- **File Type Handling**:
  - Image display with zoom/pan capabilities
  - PDF placeholder with download prompt
  - Text document preview with download option
  - Unsupported format messaging
- **Quick Actions**: Direct download from preview modal

## Technical Implementation

### Preview Logic

```typescript
const isPreviewable = (fileType: string): boolean => {
  const previewableTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/html',
  ];
  return previewableTypes.includes(fileType.toLowerCase());
};
```

### Download Implementation

- **Individual Downloads**: Uses `apiSwitcher.downloadDocument(id, fileName)`
- **Progress Tracking**: State management for download progress
- **File Storage**: Integration with device file system
- **Error Recovery**: Comprehensive try-catch with user feedback

### State Management

```typescript
// Preview and download state
const [showPreviewModal, setShowPreviewModal] = useState(false);
const [previewDocument, setPreviewDocument] = useState<SearchResult | null>(
  null,
);
const [isDownloading, setIsDownloading] = useState<{ [key: string]: boolean }>(
  {},
);
const [downloadProgress, setDownloadProgress] = useState<{
  [key: string]: number;
}>({});
const [isDownloadingAll, setIsDownloadingAll] = useState(false);
```

## API Integration

### Enhanced Search Results

Search results include detailed file information:

```typescript
interface SearchResult {
  id: string;
  major_head: string;
  minor_head: string;
  document_date: string;
  document_remarks: string;
  tags: Tag[];
  file?: {
    name: string;
    type: string;
    size: number;
    localPath?: string;
  };
  uploadedAt: string;
  uploadedBy: string;
}
```

### Download Operations

- **Single File**: `apiSwitcher.downloadDocument(documentId, fileName)`
- **Progress Tracking**: Real-time download progress updates
- **Error Handling**: Network failures, permission issues, storage problems

## User Experience Features

### Visual Feedback

- **Loading States**: "Downloading..." text and progress bars
- **Disabled States**: Preview button disabled for unsupported types
- **Progress Indicators**: Percentage-based progress display
- **Success/Error Messages**: Clear feedback for all operations

### Accessibility

- **Touch Targets**: Optimal button sizes for touch interaction
- **Visual Hierarchy**: Clear information organization
- **Color Coding**: Consistent color scheme for different actions
- **Text Contrast**: Readable text on all backgrounds

### Performance Optimizations

- **Lazy Loading**: Efficient rendering of large result sets
- **Memory Management**: Proper cleanup of modals and downloads
- **Error Recovery**: Graceful handling of failed operations
- **Batch Operations**: Efficient bulk download processing

## File Management

### Download Organization

- **Downloads Folder**: `${DocumentDirectoryPath}/Downloads/`
- **File Naming**: Preserves original filenames
- **Conflict Resolution**: Automatic handling of duplicate names
- **Folder Access**: Direct links to download locations

### Preview Caching

- **Local Storage**: Temporary preview caching for images
- **Memory Management**: Automatic cleanup of preview resources
- **Network Optimization**: Minimal data usage for previews

## Error Handling

### Download Errors

- Network connectivity issues
- Insufficient storage space
- File permission problems
- API endpoint failures

### Preview Errors

- Unsupported file formats
- Corrupted file data
- Network timeout issues
- Memory limitations

### User Feedback

- Alert dialogs for critical errors
- Inline status messages
- Progress indicators with error states
- Retry mechanisms where applicable

## Usage Examples

### Preview Workflow

1. Perform document search with desired filters
2. In results, tap "👁️ Preview" button for supported files
3. View document in full-screen modal
4. Optionally download directly from preview
5. Close preview to return to results

### Download Workflow

1. **Single File**: Tap "⬇️ Download" button on any result
2. **Multiple Files**: Use "📦 Download All" button in results header
3. Monitor progress with visual indicators
4. Access downloaded files via system file manager

### Bulk Operations

1. Execute search to get multiple results
2. Review results and tap "Download All"
3. Confirm bulk download action
4. Monitor overall progress
5. Access downloaded files in Downloads folder

## Configuration and Customization

### Supported File Types

Easily configurable in the `isPreviewable()` function:

```typescript
const previewableTypes = [
  // Add or remove file types as needed
  'image/jpeg',
  'application/pdf', // etc.
];
```

### Download Settings

- Default download location: `Downloads` folder
- Progress update intervals: Real-time
- Retry attempts: Configurable per operation
- Timeout settings: Platform-optimized

### UI Customization

- Button styles and colors easily modifiable
- Modal layouts responsive to content
- Progress bar animations customizable
- Error message templates configurable

## Future Enhancements

### Advanced Preview Features

- PDF page navigation within modal
- Image zoom and pan controls
- Text document syntax highlighting
- Video/audio preview support

### Enhanced Download Options

- ZIP archive creation for bulk downloads
- Cloud storage integration
- Download scheduling and queuing
- Resume interrupted downloads

### Performance Improvements

- Preview thumbnail generation
- Progressive image loading
- Download queue management
- Cache optimization strategies

## Security Considerations

### File Access

- Secure download URLs with authentication
- Local file permission validation
- Preview content sanitization
- Download location restrictions

### Data Protection

- Encrypted file storage options
- Secure preview rendering
- Download audit logging
- Access control integration
