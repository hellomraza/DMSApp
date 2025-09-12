# File Upload Component

A comprehensive React Native component for file upload with the following features:

## Features

### 📅 Date Picker

- Interactive date selection for document date
- Clean modal interface
- Required field validation

### 📂 Category Selection (Major Head)

- Dropdown selection between 'Personal' and 'Professional'
- Dynamic updates to dependent fields
- Required field validation

### 👥 Dynamic Secondary Dropdown (Minor Head)

- **Personal Category**: Shows names like John, Tom, Emily, Sarah, Michael, Jessica
- **Professional Category**: Shows departments like Accounts, HR, IT, Finance, Marketing, Operations
- Updates automatically based on major head selection
- Required field validation

### 🏷️ Tag Management

- **Fetch Pre-existing Tags**: Retrieves tags from API endpoint
- **Tag Input Field**: Add tags as visual chips/tokens
- **Create New Tags**: Add custom tags that are saved automatically
- **Remove Tags**: Easy tag removal with × button
- **Search Tags**: Modal interface for selecting existing tags

### 📝 Remarks Field

- Multi-line text input for document remarks
- Optional field with placeholder text

### 📱 File Upload Options

- **Camera**: Take photos directly from camera
- **Gallery**: Select images from device gallery
- **Document Picker**: Select PDF files from device storage
- **File Restrictions**: Only allows Images (JPG, PNG) and PDF formats
- **Multiple Files**: Support for uploading multiple files at once
- **File Preview**: Shows thumbnails for images and file info for PDFs
- **File Removal**: Easy file removal with × button

## Installation

The component requires the following dependencies:

```bash
npm install react-native-image-picker @react-native-documents/picker react-native-date-picker @react-native-picker/picker @react-native-community/datetimepicker
```

For iOS, run:

```bash
cd ios && pod install
```

## Usage

```tsx
import React from 'react';
import { FileUploadComponent } from '../components/ui';

const MyScreen = () => {
  const handleFileUpload = (formData: FormData) => {
    // Handle the form submission
    console.log('Form Data:', formData);
    // Send to your API endpoint
  };

  return <FileUploadComponent onFileUpload={handleFileUpload} />;
};
```

## API Integration

The component integrates with the following API endpoints:

### Document Tags Endpoint

```
POST /api/documentManagement/documentTags
Headers: {
  "token": "your_generated_token"
}
Body: {
  "term": ""
}
```

## Form Data Structure

When submitted, the component creates a FormData object with:

```javascript
{
  major_head: "Personal" | "Professional",
  minor_head: string, // Name or Department based on major_head
  document_date: string, // ISO date format
  document_remarks: string,
  tags: string, // JSON stringified array of tag objects
  files: File[] // Array of uploaded files
}
```

## Component Props

| Prop           | Type                           | Required | Description                                     |
| -------------- | ------------------------------ | -------- | ----------------------------------------------- |
| `onFileUpload` | `(formData: FormData) => void` | No       | Callback function called when form is submitted |

## Permissions

### Android

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS

Add to `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to select images</string>
```

## Styling

The component uses a comprehensive StyleSheet with:

- Modern card-based layout
- Responsive design
- Accessible touch targets
- Clean visual hierarchy
- Tag chips with easy removal
- File preview thumbnails
- Modal overlays for selections

## Validation

The component includes client-side validation for:

- Required fields (Date, Major Head, Minor Head, Files)
- File format restrictions (Images and PDFs only)
- Minimum file requirement (at least one file)

## Error Handling

- Network errors for tag fetching
- File selection cancellations
- Invalid file format warnings
- Form validation alerts

## Accessibility

- Proper labels for all inputs
- Accessible touch targets
- Screen reader support
- Keyboard navigation support

## Future Enhancements

- File size limits
- Upload progress indicators
- Drag and drop support
- Custom validation rules
- Offline tag caching
- Image compression options
