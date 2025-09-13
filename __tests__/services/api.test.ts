import axios from 'axios';
import RNFS from 'react-native-fs';

// Mock dependencies
jest.mock('axios');
jest.mock('react-native-config', () => ({
  API_BASE_URL: 'https://test-api.com',
}));
jest.mock('../../src/utils/auth', () => ({
  getCurrentToken: jest.fn(() => 'mock-token'),
}));
jest.mock('../../src/services/fileManager', () => ({
  fileManager: {
    initialize: jest.fn(() => Promise.resolve()),
    fileExists: jest.fn(() => Promise.resolve(true)),
    getFileInfo: jest.fn(() =>
      Promise.resolve({
        path: 'test-path',
        size: 1024,
        isDirectory: () => false,
        isFile: () => true,
        mtime: new Date(),
        ctime: new Date(),
        mode: 33188,
        originalFilepath: 'test-path',
      }),
    ),
  },
}));
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/test/documents',
  downloadFile: jest.fn(() => ({
    promise: Promise.resolve({ statusCode: 200 }),
    jobId: 1,
  })),
  exists: jest.fn(() => Promise.resolve(false)),
  mkdir: jest.fn(() => Promise.resolve()),
}));
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios instance
const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
  });

  describe('API Client Setup', () => {
    it('should create axios client with correct configuration', () => {
      // Import the service to trigger axios.create
      require('../../src/services/api');

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://test-api.com',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('generateOTP', () => {
    it('should generate OTP successfully', async () => {
      const { apiService } = require('../../src/services/api');
      const mockResponse = {
        data: {
          status: true,
          success: true,
          message: 'OTP sent successfully',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const mockRequest: OTPGenerateRequest = {
        mobile_number: '9876543210',
      };

      const result = await apiService.generateOTP(mockRequest);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/generateOTP',
        mockRequest,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when OTP generation fails', async () => {
      const { apiService } = require('../../src/services/api');
      const mockResponse = {
        data: {
          status: false,
          data: 'Invalid mobile number',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const mockRequest: OTPGenerateRequest = {
        mobile_number: '9876543210',
      };

      await expect(apiService.generateOTP(mockRequest)).rejects.toThrow(
        'Failed to generate OTP: Invalid mobile number',
      );
    });
  });

  describe('validateOTP', () => {
    it('should validate OTP successfully', async () => {
      const { apiService } = require('../../src/services/api');
      const mockResponse = {
        data: {
          status: true,
          success: true,
          token: 'auth-token',
          message: 'OTP validated successfully',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const mockRequest: OTPValidateRequest = {
        mobile_number: '9876543210',
        otp: '123456',
      };

      const result = await apiService.validateOTP(mockRequest);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/validateOTP',
        mockRequest,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when OTP validation fails', async () => {
      const { apiService } = require('../../src/services/api');
      const mockResponse = {
        data: {
          status: false,
          data: 'Invalid OTP',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const mockRequest: OTPValidateRequest = {
        mobile_number: '9876543210',
        otp: '123456',
      };

      await expect(apiService.validateOTP(mockRequest)).rejects.toThrow(
        'Failed to validate OTP: Invalid OTP',
      );
    });
  });

  describe('uploadDocument', () => {
    it('should upload document successfully', async () => {
      const { apiService } = require('../../src/services/api');
      const mockResponse = {
        data: {
          status: true,
          success: true,
          message: 'Document uploaded successfully',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const mockFile = {
        uri: 'file://test-document.pdf',
        type: 'application/pdf',
        name: 'test-document.pdf',
        size: 1024,
      };

      const mockUploadData: DocumentUploadData = {
        major_head: 'Finance',
        minor_head: 'Invoices',
        document_date: '2023-01-01',
        document_remarks: 'Test document',
        tags: [{ tag_name: 'test' }],
        user_id: 'user123',
      };

      const result = await apiService.uploadDocument(mockFile, mockUploadData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/saveDocumentEntry',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when no file is provided', async () => {
      const { apiService } = require('../../src/services/api');
      const mockUploadData: DocumentUploadData = {
        major_head: 'Finance',
        minor_head: 'Invoices',
        document_date: '2023-01-01',
        document_remarks: 'Test document',
        tags: [],
        user_id: 'user123',
      };

      await expect(
        apiService.uploadDocument(null, mockUploadData),
      ).rejects.toThrow('No file provided for upload');
    });
  });

  describe('searchDocuments', () => {
    it('should search documents successfully', async () => {
      const { apiService } = require('../../src/services/api');
      const mockResponse = {
        data: {
          status: true,
          success: true,
          data: [
            {
              id: '1',
              major_head: 'Finance',
              minor_head: 'Invoices',
              document_date: '2023-01-01',
            },
          ],
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const mockSearchRequest: DocumentSearchRequest = {
        major_head: 'Finance',
        from_date: '2023-01-01',
        to_date: '2023-12-31',
      };

      const result = await apiService.searchDocuments(mockSearchRequest);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/searchDocumentEntry',
        mockSearchRequest,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getDocumentTags', () => {
    it('should get document tags successfully', async () => {
      const { apiService } = require('../../src/services/api');
      const mockResponse = {
        data: {
          status: true,
          success: true,
          data: [{ tag_name: 'finance' }, { tag_name: 'financial' }],
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const mockTagsRequest: DocumentTagsRequest = {
        term: 'finance',
      };

      const result = await apiService.getDocumentTags(mockTagsRequest);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/documentTags',
        mockTagsRequest,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('downloadDocument', () => {
    it('should download document successfully', async () => {
      const { apiService } = require('../../src/services/api');
      const mockRNFS = RNFS as jest.Mocked<typeof RNFS>;

      const mockDownloadResult = {
        statusCode: 200,
        promise: Promise.resolve({ statusCode: 200 }),
      };

      mockRNFS.downloadFile.mockReturnValue(mockDownloadResult as any);

      const documentId = 'doc123';
      const fileName = 'test-document.pdf';

      const result = await apiService.downloadDocument(documentId, fileName);

      expect(mockRNFS.downloadFile).toHaveBeenCalledWith(
        expect.objectContaining({
          fromUrl: 'https://test-api.com/downloadDocument/doc123',
          toFile: '/test/documents/Downloads/test-document.pdf',
          headers: {
            token: 'mock-token',
          },
        }),
      );
      expect(result).toBe('/test/documents/Downloads/test-document.pdf');
    });
  });

  describe('deleteDocument', () => {
    it('should delete document successfully', async () => {
      const { apiService } = require('../../src/services/api');
      const mockResponse = {
        data: {
          status: true,
          success: true,
          message: 'Document deleted successfully',
        },
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const documentId = 'doc123';

      const result = await apiService.deleteDocument(documentId);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/deleteDocument/doc123',
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('validateFile', () => {
    it('should validate PDF file successfully', () => {
      const { apiService } = require('../../src/services/api');
      const validFile = {
        uri: 'file://test.pdf',
        type: 'application/pdf',
        size: 1024 * 1024, // 1MB
      };

      const result = apiService.validateFile(validFile);

      expect(result).toEqual({ isValid: true });
    });

    it('should reject file without URI', () => {
      const { apiService } = require('../../src/services/api');
      const invalidFile = {
        type: 'application/pdf',
        size: 1024,
      };

      const result = apiService.validateFile(invalidFile);

      expect(result).toEqual({
        isValid: false,
        error: 'No file selected',
      });
    });

    it('should reject unsupported file type', () => {
      const { apiService } = require('../../src/services/api');
      const invalidFile = {
        uri: 'file://test.txt',
        type: 'text/plain',
        size: 1024,
      };

      const result = apiService.validateFile(invalidFile);

      expect(result).toEqual({
        isValid: false,
        error:
          'File type not supported. Please select PDF, Image, or Document files.',
      });
    });

    it('should reject file that is too large', () => {
      const { apiService } = require('../../src/services/api');
      const invalidFile = {
        uri: 'file://test.pdf',
        type: 'application/pdf',
        size: 60 * 1024 * 1024, // 60MB
      };

      const result = apiService.validateFile(invalidFile);

      expect(result).toEqual({
        isValid: false,
        error: 'File is too large. Maximum size is 50MB.',
      });
    });
  });

  describe('getUploadStatus', () => {
    it('should get upload status successfully', async () => {
      const { apiService } = require('../../src/services/api');
      const mockResponse = {
        data: {
          status: 'completed',
          progress: 100,
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const uploadId = 'upload123';

      const result = await apiService.getUploadStatus(uploadId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/uploadStatus/upload123',
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
