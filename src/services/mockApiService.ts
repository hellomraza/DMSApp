import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { fileManager, ManagedFile } from './fileManager';
import {
  createMockError,
  createMockResponse,
  MOCK_CONFIG,
  mockDelay,
  mockStorage,
} from './mockConfig';

class MockApiService {
  // Generate OTP - Always returns success with static OTP
  async generateOTP(data: OTPGenerateRequest): Promise<AxiosResponse> {
    await mockDelay();

    console.log('Mock API: Generate OTP for', data.mobile_number);

    if (!data.mobile_number || data.mobile_number.length < 10) {
      throw createMockError('Invalid mobile number');
    }

    return createMockResponse({
      message: `OTP sent to ${data.mobile_number}`,
      otp: MOCK_CONFIG.STATIC_OTP, // For testing only - remove in production
    });
  }

  // Validate OTP - Accepts static OTP
  async validateOTP(
    data: OTPValidateRequest,
  ): Promise<AxiosResponse<OTPValidateResponse>> {
    await mockDelay();

    console.log('Mock API: Validate OTP', data.otp, 'for', data.mobile_number);

    if (data.otp !== MOCK_CONFIG.STATIC_OTP) {
      throw createMockError('Invalid OTP');
    }

    const responseData: OTPValidateResponse = {
      token: MOCK_CONFIG.MOCK_TOKEN,
      success: true,
      message: 'OTP validated successfully',
    };

    return {
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {},
        method: 'post',
        url: '/validateOTP',
      },
    } as AxiosResponse<OTPValidateResponse>;
  }

  // Upload Document - Stores in AsyncStorage with file management
  async uploadDocument(
    file: any,
    data: DocumentUploadData,
  ): Promise<AxiosResponse> {
    await mockDelay();

    console.log('Mock API: Upload Document', data);

    try {
      // Initialize file manager
      await fileManager.initialize();

      const documentId = `doc_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      let managedFile: ManagedFile | null = null;

      // If file is provided, save it using file manager
      if (file && file.uri) {
        try {
          const fileInfo = {
            uri: file.uri,
            name: file.name || 'document.pdf',
            type: file.type || 'application/pdf',
            size: file.size || 0,
          };

          // Determine category based on file type
          const isImage = fileInfo.type.startsWith('image/');
          const category = isImage ? 'images' : 'documents';

          managedFile = await fileManager.saveFile(fileInfo, category);
          console.log('File saved to managed storage:', managedFile.localPath);
        } catch (fileError) {
          console.error('Failed to save file with file manager:', fileError);
          // Fall back to using original file info if file manager fails
        }
      }

      const documentEntry = {
        id: documentId,
        ...data,
        file: managedFile
          ? {
              id: managedFile.id,
              name: managedFile.name,
              type: managedFile.type,
              size: managedFile.size,
              uri: managedFile.originalUri,
              localPath: managedFile.localPath,
              managedFile: true,
            }
          : {
              name: file?.name || 'document.pdf',
              type: file?.type || 'application/pdf',
              size: file?.size || 0,
              uri: file?.uri,
              managedFile: false,
            },
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'mock_user_123',
      };

      // Store in memory
      mockStorage.uploadedDocuments.push(documentEntry);

      // Store in AsyncStorage for persistence
      const existingDocs = await AsyncStorage.getItem('uploadedDocuments');
      const docs = existingDocs ? JSON.parse(existingDocs) : [];
      docs.push(documentEntry);
      await AsyncStorage.setItem('uploadedDocuments', JSON.stringify(docs));

      return createMockResponse({
        documentId,
        message: 'Document uploaded successfully',
        document: documentEntry,
        fileManager: {
          saved: !!managedFile,
          localPath: managedFile?.localPath,
          fileId: managedFile?.id,
        },
      });
    } catch (error) {
      console.error('Upload document error:', error);
      throw createMockError('Failed to upload document');
    }
  }

  // Search Documents - Returns filtered results
  async searchDocuments(data: DocumentSearchRequest): Promise<AxiosResponse> {
    await mockDelay();

    console.log('Mock API: Search Documents', data);

    try {
      // Load documents from AsyncStorage
      const storedDocs = await AsyncStorage.getItem('uploadedDocuments');
      const allDocs = storedDocs
        ? JSON.parse(storedDocs)
        : mockStorage.uploadedDocuments;

      let filteredDocs = [...allDocs];

      // Apply filters
      if (data.major_head) {
        filteredDocs = filteredDocs.filter(
          doc => doc.major_head === data.major_head,
        );
      }

      if (data.minor_head) {
        filteredDocs = filteredDocs.filter(
          doc => doc.minor_head === data.minor_head,
        );
      }

      if (data.from_date && data.to_date) {
        filteredDocs = filteredDocs.filter(doc => {
          const docDate = new Date(doc.document_date);
          const fromDate = new Date(data.from_date!);
          const toDate = new Date(data.to_date!);
          return docDate >= fromDate && docDate <= toDate;
        });
      }

      if (data.tags && data.tags.length > 0) {
        filteredDocs = filteredDocs.filter(doc => {
          const docTags = doc.tags || [];
          return data.tags!.some((searchTag: any) =>
            docTags.some(
              (docTag: any) => docTag.tag_name === searchTag.tag_name,
            ),
          );
        });
      }

      if (data.search?.value) {
        const searchTerm = data.search.value.toLowerCase();
        filteredDocs = filteredDocs.filter(
          doc =>
            doc.document_remarks?.toLowerCase().includes(searchTerm) ||
            doc.file?.name?.toLowerCase().includes(searchTerm) ||
            doc.major_head?.toLowerCase().includes(searchTerm) ||
            doc.minor_head?.toLowerCase().includes(searchTerm),
        );
      }

      // Apply pagination
      const start = data.start || 0;
      const length = data.length || 10;
      const paginatedDocs = filteredDocs.slice(start, start + length);

      return createMockResponse({
        data: paginatedDocs,
        recordsTotal: allDocs.length,
        recordsFiltered: filteredDocs.length,
      });
    } catch (error) {
      throw createMockError('Failed to search documents');
    }
  }

  // Get Document Tags - Returns tags from uploaded documents + custom ones
  async getDocumentTags(data: DocumentTagsRequest): Promise<AxiosResponse> {
    await mockDelay();

    console.log('Mock API: Get Document Tags', data);

    try {
      // Load uploaded documents from AsyncStorage
      const storedDocs = await AsyncStorage.getItem('uploadedDocuments');
      const allDocs = storedDocs
        ? JSON.parse(storedDocs)
        : mockStorage.uploadedDocuments;

      // Extract tags from all uploaded documents
      const documentTags: { [key: string]: { tag_name: string } } = {};

      allDocs.forEach((doc: any) => {
        if (doc.tags && Array.isArray(doc.tags)) {
          doc.tags.forEach((tag: any) => {
            if (tag.tag_name) {
              documentTags[tag.tag_name] = { tag_name: tag.tag_name };
            }
          });
        }
      });

      // Load custom tags from AsyncStorage
      const storedTags = await AsyncStorage.getItem('customTags');
      const customTags = storedTags ? JSON.parse(storedTags) : [];

      // Combine document tags and custom tags, avoiding duplicates
      const allTags = [...Object.values(documentTags)];

      customTags.forEach((customTag: any) => {
        if (!documentTags[customTag.tag_name]) {
          allTags.push(customTag);
        }
      });

      // Add some default predefined tags if no tags exist yet
      if (allTags.length === 0) {
        const defaultTags = [...mockStorage.documentTags];
        allTags.push(...defaultTags);
      }

      let filteredTags = allTags;

      // Filter by search term
      if (data.term) {
        const searchTerm = data.term.toLowerCase();
        filteredTags = allTags.filter(tag =>
          tag.tag_name.toLowerCase().includes(searchTerm),
        );
      }

      console.log(
        `Returning ${filteredTags.length} tags (${
          Object.keys(documentTags).length
        } from documents, ${customTags.length} custom)`,
      );

      return createMockResponse(filteredTags);
    } catch (error) {
      throw createMockError('Failed to get document tags');
    }
  }

  // Save new tag
  async saveTag(tagName: string): Promise<void> {
    try {
      // Load uploaded documents to check for existing tags
      const storedDocs = await AsyncStorage.getItem('uploadedDocuments');
      const allDocs = storedDocs
        ? JSON.parse(storedDocs)
        : mockStorage.uploadedDocuments;

      // Extract existing tags from documents
      const existingDocumentTags = new Set<string>();
      allDocs.forEach((doc: any) => {
        if (doc.tags && Array.isArray(doc.tags)) {
          doc.tags.forEach((tag: any) => {
            if (tag.tag_name) {
              existingDocumentTags.add(tag.tag_name.toLowerCase());
            }
          });
        }
      });

      // Load custom tags from AsyncStorage
      const storedTags = await AsyncStorage.getItem('customTags');
      const customTags = storedTags ? JSON.parse(storedTags) : [];

      const newTag = { tag_name: tagName };

      // Check if tag already exists in any source
      const existsInCustom = customTags.some(
        (tag: any) => tag.tag_name.toLowerCase() === tagName.toLowerCase(),
      );
      const existsInDefaults = mockStorage.documentTags.some(
        tag => tag.tag_name.toLowerCase() === tagName.toLowerCase(),
      );
      const existsInDocuments = existingDocumentTags.has(tagName.toLowerCase());

      if (!existsInCustom && !existsInDefaults && !existsInDocuments) {
        customTags.push(newTag);
        await AsyncStorage.setItem('customTags', JSON.stringify(customTags));
        console.log(`New custom tag saved: ${tagName}`);
      } else {
        console.log(`Tag already exists: ${tagName}`);
      }
    } catch (error) {
      console.error('Failed to save tag:', error);
    }
  }

  // Clear all stored data (for testing)
  async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem('uploadedDocuments');
      await AsyncStorage.removeItem('customTags');
      mockStorage.uploadedDocuments = [];

      // Also clean up file manager storage
      await fileManager.cleanTemporaryFiles(0); // Clean all temp files

      console.log('Mock storage and file manager storage cleared');
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  // File Management Methods
  async getStorageInfo(): Promise<AxiosResponse> {
    try {
      const storageInfo = await fileManager.getStorageInfo();
      const documentsCount = await AsyncStorage.getItem(
        'uploadedDocuments',
      ).then(data => (data ? JSON.parse(data).length : 0));

      return createMockResponse({
        storage: storageInfo,
        documentsCount,
        formattedSizes: {
          documents: this.formatBytes(storageInfo.documentsSize),
          temp: this.formatBytes(storageInfo.tempSize),
          cache: this.formatBytes(storageInfo.cacheSize),
          total: this.formatBytes(storageInfo.totalSize),
        },
      });
    } catch (error) {
      throw createMockError('Failed to get storage info');
    }
  }

  async cleanupFiles(): Promise<AxiosResponse> {
    try {
      const deletedCount = await fileManager.cleanTemporaryFiles(24); // Clean files older than 24 hours

      return createMockResponse({
        message: `Cleaned up ${deletedCount} temporary files`,
        deletedCount,
      });
    } catch (error) {
      throw createMockError('Failed to cleanup files');
    }
  }

  // Download Document
  async downloadDocument(
    documentId: string,
    fileName: string,
  ): Promise<string> {
    await mockDelay();

    console.log('Mock API: Download Document', documentId, fileName);

    try {
      // Load documents from AsyncStorage
      const storedDocs = await AsyncStorage.getItem('uploadedDocuments');
      const allDocs = storedDocs
        ? JSON.parse(storedDocs)
        : mockStorage.uploadedDocuments;

      const document = allDocs.find((doc: any) => doc.id === documentId);

      if (!document) {
        throw createMockError('Document not found');
      }

      if (!document.file || !document.file.localPath) {
        throw createMockError('File not available for download');
      }

      // Check if the file still exists on the device
      const fileExists = await RNFS.exists(document.file.localPath);
      if (!fileExists) {
        throw createMockError('File not found on device');
      }

      // Create downloads directory
      const downloadDir =
        Platform.OS === 'ios'
          ? RNFS.MainBundlePath + '/Downloads'
          : RNFS.DownloadDirectoryPath;

      const dirExists = await RNFS.exists(downloadDir);
      if (!dirExists) {
        await RNFS.mkdir(downloadDir);
      }

      // Generate unique filename to avoid conflicts
      const timestamp = new Date().getTime();
      const fileExtension = fileName.split('.').pop() || '';
      const baseName = fileName.replace(`.${fileExtension}`, '');
      const downloadFileName = `${baseName}_${timestamp}.${fileExtension}`;
      const downloadPath = `${downloadDir}/${downloadFileName}`;

      // Copy file to downloads directory with progress simulation
      await RNFS.copyFile(document.file.localPath, downloadPath);

      // Simulate download progress for user feedback
      console.log('Mock API: Download progress: 100%');

      console.log('Mock API: File downloaded to:', downloadPath);
      return downloadPath;
    } catch (error: any) {
      console.error('Mock download error:', error);
      throw createMockError(error.message || 'Failed to download document');
    }
  }

  async deleteDocument(documentId: string): Promise<AxiosResponse> {
    try {
      // Load documents from AsyncStorage
      const storedDocs = await AsyncStorage.getItem('uploadedDocuments');
      const allDocs = storedDocs ? JSON.parse(storedDocs) : [];

      const documentIndex = allDocs.findIndex(
        (doc: any) => doc.id === documentId,
      );

      if (documentIndex === -1) {
        throw createMockError('Document not found');
      }

      const document = allDocs[documentIndex];

      // Delete the file if it's managed by file manager
      if (document.file && document.file.managedFile && document.file.id) {
        await fileManager.deleteFile(document.file.id, document.file.localPath);
        console.log('Managed file deleted:', document.file.localPath);
      }

      // Remove from storage
      allDocs.splice(documentIndex, 1);
      await AsyncStorage.setItem('uploadedDocuments', JSON.stringify(allDocs));

      // Update memory storage
      const memoryIndex = mockStorage.uploadedDocuments.findIndex(
        doc => doc.id === documentId,
      );
      if (memoryIndex !== -1) {
        mockStorage.uploadedDocuments.splice(memoryIndex, 1);
      }

      return createMockResponse({
        message: 'Document deleted successfully',
        documentId,
      });
    } catch (error) {
      console.error('Delete document error:', error);
      throw createMockError('Failed to delete document');
    }
  }

  // Helper method to format bytes
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const mockApiService = new MockApiService();
export default mockApiService;
