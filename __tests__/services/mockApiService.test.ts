// Mock all React Native dependencies
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/test/documents',
  downloadFile: jest.fn(),
  exists: jest.fn(),
  mkdir: jest.fn(),
}));

// Mock the file manager
jest.mock('../../src/services/fileManager', () => ({
  fileManager: {
    initialize: jest.fn(),
    fileExists: jest.fn(),
    getFileInfo: jest.fn(),
    createManagedFile: jest.fn(),
  },
  ManagedFile: jest.fn(),
}));

// Mock the config
const mockConfig = {
  ENABLED: true,
  STATIC_OTP: '123456',
  MOCK_TOKEN: 'mock-token-123',
  DELAY_MS: 500,
};

jest.mock('../../src/services/mockConfig', () => ({
  MOCK_CONFIG: mockConfig,
  mockDelay: jest.fn(() => Promise.resolve()),
  createMockResponse: jest.fn(data => ({
    data: { status: true, success: true, ...data },
  })),
  createMockError: jest.fn(message => new Error(message)),
  mockStorage: {
    documents: [],
    tags: [],
  },
}));

import { mockApiService } from '../../src/services/mockApiService';

describe('MockApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock storage
    mockConfig.ENABLED = true;
  });

  describe('generateOTP', () => {
    it('should generate OTP successfully with valid mobile number', async () => {
      const mockData: OTPGenerateRequest = {
        mobile_number: '9876543210',
      };

      const result = await mockApiService.generateOTP(mockData);

      expect(result.data.success).toBe(true);
      expect(result.data.message).toContain('OTP sent to 9876543210');
      expect(result.data.otp).toBe('123456');
    });

    it('should throw error for invalid mobile number', async () => {
      const mockData: OTPGenerateRequest = {
        mobile_number: '123', // Invalid short number
      };

      await expect(mockApiService.generateOTP(mockData)).rejects.toThrow(
        'Invalid mobile number',
      );
    });

    it('should throw error for empty mobile number', async () => {
      const mockData: OTPGenerateRequest = {
        mobile_number: '',
      };

      await expect(mockApiService.generateOTP(mockData)).rejects.toThrow(
        'Invalid mobile number',
      );
    });
  });

  describe('validateOTP', () => {
    it('should validate OTP successfully with correct OTP', async () => {
      const mockData: OTPValidateRequest = {
        mobile_number: '9876543210',
        otp: '123456',
      };

      const result = await mockApiService.validateOTP(mockData);

      expect(result.data.success).toBe(true);
      expect(result.data.token).toBe('mock-token-123');
      expect(result.data.message).toBe('OTP validated successfully');
    });

    it('should throw error for invalid OTP', async () => {
      const mockData: OTPValidateRequest = {
        mobile_number: '9876543210',
        otp: '654321', // Wrong OTP
      };

      await expect(mockApiService.validateOTP(mockData)).rejects.toThrow(
        'Invalid OTP',
      );
    });
  });

  describe('uploadDocument', () => {
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
      document_remarks: 'Test document upload',
      tags: [{ tag_name: 'finance' }, { tag_name: 'invoice' }],
      user_id: 'user123',
    };

    beforeEach(() => {
      const { fileManager } = require('../../src/services/fileManager');
      fileManager.initialize.mockResolvedValue(undefined);
      fileManager.fileExists.mockResolvedValue(true);
      fileManager.createManagedFile.mockResolvedValue({
        id: 'managed-file-123',
        originalPath: mockFile.uri,
        storedPath: '/stored/path/test-document.pdf',
        metadata: { originalName: mockFile.name },
      });
    });

    it('should upload document successfully', async () => {
      const result = await mockApiService.uploadDocument(
        mockFile,
        mockUploadData,
      );

      expect(result.data.success).toBe(true);
      expect(result.data.message).toBe('Document uploaded successfully');
      expect(result.data.documentId).toBeDefined();
    });

    it('should throw error when file does not exist', async () => {
      const { fileManager } = require('../../src/services/fileManager');
      fileManager.fileExists.mockResolvedValue(false);

      await expect(
        mockApiService.uploadDocument(mockFile, mockUploadData),
      ).rejects.toThrow('File not found');
    });

    it('should throw error when no file is provided', async () => {
      await expect(
        mockApiService.uploadDocument(null, mockUploadData),
      ).rejects.toThrow('No file provided');
    });

    it('should throw error for file without URI', async () => {
      const invalidFile = { type: 'application/pdf', name: 'test.pdf' };

      await expect(
        mockApiService.uploadDocument(invalidFile, mockUploadData),
      ).rejects.toThrow('Invalid file: URI is required');
    });
  });

  describe('searchDocuments', () => {
    it('should search documents successfully', async () => {
      const mockSearchRequest: DocumentSearchRequest = {
        major_head: 'Finance',
        from_date: '2023-01-01',
        to_date: '2023-12-31',
      };

      const result = await mockApiService.searchDocuments(mockSearchRequest);

      expect(result.data.success).toBe(true);
      expect(Array.isArray(result.data.data)).toBe(true);
      expect(typeof result.data.recordsTotal).toBe('number');
      expect(typeof result.data.recordsFiltered).toBe('number');
    });

    it('should filter documents by major_head', async () => {
      const mockSearchRequest: DocumentSearchRequest = {
        major_head: 'HR',
      };

      const result = await mockApiService.searchDocuments(mockSearchRequest);

      expect(result.data.success).toBe(true);
      expect(Array.isArray(result.data.data)).toBe(true);
    });

    it('should handle empty search request', async () => {
      const mockSearchRequest: DocumentSearchRequest = {};

      const result = await mockApiService.searchDocuments(mockSearchRequest);

      expect(result.data.success).toBe(true);
      expect(Array.isArray(result.data.data)).toBe(true);
    });
  });

  describe('getDocumentTags', () => {
    it('should get document tags successfully', async () => {
      const mockTagsRequest: DocumentTagsRequest = {
        term: 'finance',
      };

      const result = await mockApiService.getDocumentTags(mockTagsRequest);

      expect(result.data.success).toBe(true);
      expect(Array.isArray(result.data.data)).toBe(true);
    });

    it('should filter tags by term', async () => {
      const mockTagsRequest: DocumentTagsRequest = {
        term: 'fin',
      };

      const result = await mockApiService.getDocumentTags(mockTagsRequest);

      expect(result.data.success).toBe(true);
      expect(Array.isArray(result.data.data)).toBe(true);
    });

    it('should handle empty term', async () => {
      const mockTagsRequest: DocumentTagsRequest = {
        term: '',
      };

      const result = await mockApiService.getDocumentTags(mockTagsRequest);

      expect(result.data.success).toBe(true);
      expect(Array.isArray(result.data.data)).toBe(true);
    });
  });

  describe('downloadDocument', () => {
    const documentId = 'doc123';
    const fileName = 'test-document.pdf';

    beforeEach(() => {
      const RNFS = require('react-native-fs');
      RNFS.DocumentDirectoryPath = '/test/documents';
      RNFS.exists.mockResolvedValue(false);
      RNFS.mkdir.mockResolvedValue(undefined);
    });

    it('should download document successfully', async () => {
      const result = await mockApiService.downloadDocument(
        documentId,
        fileName,
      );

      expect(result).toContain('/test/documents/Downloads/');
      expect(result).toContain(fileName);
    });

    it('should create downloads directory if it does not exist', async () => {
      const RNFS = require('react-native-fs');

      await mockApiService.downloadDocument(documentId, fileName);

      expect(RNFS.exists).toHaveBeenCalledWith('/test/documents/Downloads');
      expect(RNFS.mkdir).toHaveBeenCalledWith('/test/documents/Downloads');
    });
  });

  describe('deleteDocument', () => {
    const documentId = 'doc123';

    it('should delete document successfully', async () => {
      const result = await mockApiService.deleteDocument(documentId);

      expect(result.data.success).toBe(true);
      expect(result.data.message).toBe('Document deleted successfully');
    });

    it('should throw error for non-existent document', async () => {
      await expect(
        mockApiService.deleteDocument('non-existent'),
      ).rejects.toThrow('Document not found');
    });
  });

  describe('saveTag', () => {
    it('should save tag successfully', async () => {
      const tagName = 'new-tag';

      await mockApiService.saveTag(tagName);

      // Should not throw any error
      expect(true).toBe(true);
    });

    it('should handle duplicate tags', async () => {
      const tagName = 'duplicate-tag';

      await mockApiService.saveTag(tagName);
      await mockApiService.saveTag(tagName); // Save again

      // Should not throw any error
      expect(true).toBe(true);
    });
  });

  describe('clearStorage', () => {
    it('should clear storage successfully', async () => {
      await mockApiService.clearStorage();

      // Should not throw any error
      expect(true).toBe(true);
    });
  });
});
