import axios, { AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import RNFS from 'react-native-fs';
import { getCurrentToken } from '../utils/auth';
import { fileManager } from './fileManager';

const API_BASE_URL = Config.API_BASE_URL || '';
// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token from Redux store
apiClient.interceptors.request.use(
  config => {
    const token = getCurrentToken();
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

class ApiService {
  // Generate OTP
  async generateOTP(data: OTPGenerateRequest): Promise<AxiosResponse> {
    const response = await apiClient.post('/generateOTP', data);
    if (!response.data || !response.data.status) {
      throw new Error(
        'Failed to generate OTP: ' + (response.data?.data || 'Unknown error'),
      );
    }
    return response;
  }

  // Validate OTP
  async validateOTP(
    data: OTPValidateRequest,
  ): Promise<AxiosResponse<OTPValidateResponse>> {
    const response = await apiClient.post('/validateOTP', data);
    if (!response.data || !response.data.status) {
      throw new Error(
        'Failed to validate OTP: ' + (response.data?.data || 'Unknown error'),
      );
    }
    return response;
  }

  // Upload Document with enhanced file handling
  async uploadDocument(
    file: any,
    data: DocumentUploadData,
  ): Promise<AxiosResponse> {
    try {
      console.log('API: Starting file upload process');

      // Initialize file manager
      await fileManager.initialize();

      const formData = new FormData();

      // Handle file data based on the file object structure
      let fileData: any = null;

      if (file && file.uri) {
        // Check if file exists and get proper file info
        const fileExists = await fileManager.fileExists(file.uri);

        if (!fileExists) {
          throw new Error(`File not found at path: ${file.uri}`);
        }

        // Get file stats for accurate information
        const fileInfo = await fileManager.getFileInfo(file.uri);

        if (Platform.OS === 'ios') {
          // iOS file handling
          fileData = {
            uri: file.uri,
            type: file.type || 'application/octet-stream',
            name: file.name || 'document',
          };
        } else {
          // Android file handling
          fileData = {
            uri: file.uri,
            type: file.type || 'application/octet-stream',
            name: file.name || 'document',
          };
        }

        // Add file to FormData
        formData.append('file', fileData as any);

        console.log('File prepared for upload:', {
          name: fileData.name,
          type: fileData.type,
          uri: fileData.uri,
          size: fileInfo?.size || file.size || 'unknown',
        });
      } else {
        throw new Error('No file provided for upload');
      }

      // Add document metadata
      formData.append('major_head', data.major_head);
      formData.append('minor_head', data.minor_head);
      formData.append('document_date', data.document_date);
      formData.append('document_remarks', data.document_remarks || '');

      // Add tags as JSON string if provided
      if (data.tags && data.tags.length > 0) {
        formData.append('tags', JSON.stringify(data.tags));
      }

      console.log(
        'Uploading to API endpoint:',
        `${API_BASE_URL}/saveDocumentEntry`,
      );

      const response = await apiClient.post('/saveDocumentEntry', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds for file uploads
        onUploadProgress: progressEvent => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        },
      });

      if (!response.data || !response.data.status) {
        throw new Error(
          'Failed to upload document: ' +
            (response.data?.message || response.data?.data || 'Unknown error'),
        );
      }

      console.log('File upload successful:', response.data);
      return response;
    } catch (error: any) {
      console.error('File upload error:', error);

      // Provide more specific error messages
      if (error.code === 'ENOENT') {
        throw new Error('File not found. Please select a valid file.');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error(
          'Network error. Please check your internet connection.',
        );
      } else if (error.response?.status === 413) {
        throw new Error('File is too large. Please select a smaller file.');
      } else if (error.response?.status === 415) {
        throw new Error(
          'File type not supported. Please select a PDF or image file.',
        );
      } else {
        throw new Error(
          error.message || 'Failed to upload document. Please try again.',
        );
      }
    }
  }

  // Search Documents
  async searchDocuments(data: DocumentSearchRequest): Promise<AxiosResponse> {
    const response = await apiClient.post('/searchDocumentEntry', data);
    if (!response.data || !response.data.status) {
      throw new Error(
        'Failed to search documents: ' +
          (response.data?.data || 'Unknown error'),
      );
    }
    return response;
  }

  // Get Document Tags
  async getDocumentTags(data: DocumentTagsRequest): Promise<AxiosResponse> {
    const response = await apiClient.post('/documentTags', data);
    if (!response.data || !response.data.status) {
      throw new Error(
        'Failed to get document tags: ' +
          (response.data?.data || 'Unknown error'),
      );
    }
    return response;
  }

  // Download Document
  async downloadDocument(
    documentId: string,
    fileName: string,
  ): Promise<string> {
    try {
      console.log('Downloading document:', documentId);

      // Initialize file manager
      await fileManager.initialize();

      const downloadUrl = `/downloadDocument/${documentId}`;
      const localPath =
        (await RNFS.DocumentDirectoryPath) + `/Downloads/${fileName}`;

      // Create downloads directory if it doesn't exist
      const downloadDir = RNFS.DocumentDirectoryPath + '/Downloads';
      const dirExists = await RNFS.exists(downloadDir);
      if (!dirExists) {
        await RNFS.mkdir(downloadDir);
      }

      // Download file
      const downloadResult = await RNFS.downloadFile({
        fromUrl: `${API_BASE_URL}${downloadUrl}`,
        toFile: localPath,
        headers: {
          token: getCurrentToken() || '',
        },
        progress: res => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${Math.round(progress)}%`);
        },
      }).promise;

      if (downloadResult.statusCode === 200) {
        console.log('Document downloaded successfully:', localPath);
        return localPath;
      } else {
        throw new Error(
          `Download failed with status: ${downloadResult.statusCode}`,
        );
      }
    } catch (error: any) {
      console.error('Document download error:', error);
      throw new Error(error.message || 'Failed to download document');
    }
  }

  // Delete Document
  async deleteDocument(documentId: string): Promise<AxiosResponse> {
    try {
      const response = await apiClient.delete(`/deleteDocument/${documentId}`);

      if (!response.data || !response.data.status) {
        throw new Error(
          'Failed to delete document: ' +
            (response.data?.message || response.data?.data || 'Unknown error'),
        );
      }

      console.log('Document deleted successfully:', documentId);
      return response;
    } catch (error: any) {
      console.error('Document deletion error:', error);
      throw new Error(error.message || 'Failed to delete document');
    }
  }

  // Get Upload Progress (for large files)
  async getUploadStatus(uploadId: string): Promise<AxiosResponse> {
    try {
      const response = await apiClient.get(`/uploadStatus/${uploadId}`);
      return response;
    } catch (error: any) {
      console.error('Upload status error:', error);
      throw new Error(error.message || 'Failed to get upload status');
    }
  }

  // Validate file before upload
  validateFile(file: any): { isValid: boolean; error?: string } {
    if (!file || !file.uri) {
      return { isValid: false, error: 'No file selected' };
    }

    if (!file.type) {
      return { isValid: false, error: 'File type is required' };
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return {
        isValid: false,
        error:
          'File type not supported. Please select PDF, Image, or Document files.',
      };
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size && file.size > maxSize) {
      return {
        isValid: false,
        error: 'File is too large. Maximum size is 50MB.',
      };
    }

    return { isValid: true };
  }
}

export const apiService = new ApiService();
export default apiService;
