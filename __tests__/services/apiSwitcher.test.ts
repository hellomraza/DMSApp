// Mock React Native dependencies
jest.mock('react-native-config', () => ({}));
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

// Mock the services
const mockApiService = {
  generateOTP: jest.fn(),
  validateOTP: jest.fn(),
  uploadDocument: jest.fn(),
  searchDocuments: jest.fn(),
  getDocumentTags: jest.fn(),
  downloadDocument: jest.fn(),
  deleteDocument: jest.fn(),
  validateFile: jest.fn(),
  getUploadStatus: jest.fn(),
};

const mockMockApiService = {
  generateOTP: jest.fn(),
  validateOTP: jest.fn(),
  uploadDocument: jest.fn(),
  searchDocuments: jest.fn(),
  getDocumentTags: jest.fn(),
  downloadDocument: jest.fn(),
  deleteDocument: jest.fn(),
  saveTag: jest.fn(),
  clearStorage: jest.fn(),
};

jest.mock('../../src/services/api', () => ({
  apiService: mockApiService,
}));

jest.mock('../../src/services/mockApiService', () => ({
  mockApiService: mockMockApiService,
}));

// Mock config with enabled/disabled state
let mockConfigEnabled = false;
jest.mock('../../src/services/mockConfig', () => ({
  MOCK_CONFIG: {
    get ENABLED() {
      return mockConfigEnabled;
    },
    set ENABLED(value) {
      mockConfigEnabled = value;
    },
    STATIC_OTP: '123456',
  },
}));

describe('ApiSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigEnabled = false; // Default to real API
  });

  describe('when using real API', () => {
    beforeEach(() => {
      mockConfigEnabled = false;
    });

    it('should call real API for generateOTP', async () => {
      const { apiSwitcher } = require('../../src/services/apiSwitcher');
      const mockData: OTPGenerateRequest = { mobile_number: '9876543210' };
      const mockResponse = { data: { success: true } };

      mockApiService.generateOTP.mockResolvedValue(mockResponse);

      const result = await apiSwitcher.generateOTP(mockData);

      expect(mockApiService.generateOTP).toHaveBeenCalledWith(mockData);
      expect(mockMockApiService.generateOTP).not.toHaveBeenCalled();
      expect(result).toBe(mockResponse);
    });

    it('should call real API for validateFile', () => {
      const { apiSwitcher } = require('../../src/services/apiSwitcher');
      const mockFile = { uri: 'file://test.pdf', type: 'application/pdf' };
      const mockResult = { isValid: true };

      mockApiService.validateFile.mockReturnValue(mockResult);

      const result = apiSwitcher.validateFile(mockFile);

      expect(mockApiService.validateFile).toHaveBeenCalledWith(mockFile);
      expect(result).toBe(mockResult);
    });
  });

  describe('when using mock API', () => {
    beforeEach(() => {
      mockConfigEnabled = true;
    });

    it('should call mock API for generateOTP', async () => {
      const { apiSwitcher } = require('../../src/services/apiSwitcher');
      const mockData: OTPGenerateRequest = { mobile_number: '9876543210' };
      const mockResponse = { data: { success: true } };

      mockMockApiService.generateOTP.mockResolvedValue(mockResponse);

      const result = await apiSwitcher.generateOTP(mockData);

      expect(mockMockApiService.generateOTP).toHaveBeenCalledWith(mockData);
      expect(mockApiService.generateOTP).not.toHaveBeenCalled();
      expect(result).toBe(mockResponse);
    });

    it('should throw error for getUploadStatus in mock mode', async () => {
      const { apiSwitcher } = require('../../src/services/apiSwitcher');
      const uploadId = 'upload123';

      await expect(apiSwitcher.getUploadStatus(uploadId)).rejects.toThrow(
        'Upload status not available in mock mode',
      );
    });

    it('should call mock API for saveTag', async () => {
      const { apiSwitcher } = require('../../src/services/apiSwitcher');
      const tagName = 'test-tag';

      mockMockApiService.saveTag.mockResolvedValue(undefined);

      await apiSwitcher.saveTag(tagName);

      expect(mockMockApiService.saveTag).toHaveBeenCalledWith(tagName);
    });
  });

  describe('utility methods', () => {
    it('should return correct mock mode status', () => {
      const { apiSwitcher } = require('../../src/services/apiSwitcher');

      mockConfigEnabled = false;
      expect(apiSwitcher.isMockMode()).toBe(false);

      mockConfigEnabled = true;
      expect(apiSwitcher.isMockMode()).toBe(true);
    });

    it('should return mock OTP', () => {
      const { apiSwitcher } = require('../../src/services/apiSwitcher');
      const otp = apiSwitcher.getMockOTP();
      expect(otp).toBe('123456');
    });
  });

  describe('real API only methods', () => {
    beforeEach(() => {
      mockConfigEnabled = false;
    });

    it('should log message for saveTag in real API mode', async () => {
      const { apiSwitcher } = require('../../src/services/apiSwitcher');
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await apiSwitcher.saveTag('test-tag');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Save tag not implemented for real API',
      );
      consoleSpy.mockRestore();
    });
  });
});
