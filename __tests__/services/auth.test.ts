// Mock all React Native dependencies first
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-config', () => ({}));
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/test/documents',
}));
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}));

// Mock the file manager
jest.mock('../../src/services/fileManager', () => ({
  fileManager: {
    initialize: jest.fn(),
  },
}));

// Mock the auth utils
jest.mock('../../src/utils/auth', () => ({
  getCurrentToken: jest.fn(() => 'mock-token'),
}));

// Mock Redux store and actions
const mockDispatch = jest.fn();
jest.mock('../../src/store', () => ({
  __esModule: true,
  default: {
    dispatch: mockDispatch,
  },
}));

const mockLogoutAction = { type: 'auth/logout' };
jest.mock('../../src/store/slices/authSlice', () => ({
  logout: jest.fn(() => mockLogoutAction),
}));

// Mock redux-persist
jest.mock('redux-persist', () => ({
  persistReducer: jest.fn((config, reducer) => reducer),
  persistStore: jest.fn(),
}));

// Create a mock for the api service
const mockApiServiceMethods = {
  generateOTP: jest.fn(),
  validateOTP: jest.fn(),
};

jest.doMock('../../src/services/api', () => ({
  apiService: mockApiServiceMethods,
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateOTP', () => {
    it('should generate OTP successfully', async () => {
      const { authService } = require('../../src/services/auth');
      const mockResponse = {
        data: {
          success: true,
          message: 'OTP sent successfully',
          otp: '123456',
        },
      };

      mockApiServiceMethods.generateOTP.mockResolvedValue(mockResponse);

      const result = await authService.generateOTP('9876543210');

      expect(mockApiServiceMethods.generateOTP).toHaveBeenCalledWith({
        mobile_number: '9876543210',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when OTP generation fails', async () => {
      const { authService } = require('../../src/services/auth');
      const mockResponse = {
        data: {
          success: false,
          message: 'Invalid mobile number',
        },
      };

      mockApiServiceMethods.generateOTP.mockResolvedValue(mockResponse);

      await expect(authService.generateOTP('9876543210')).rejects.toThrow(
        'Invalid mobile number',
      );
    });

    it('should use default error message when none provided', async () => {
      const { authService } = require('../../src/services/auth');
      const mockResponse = {
        data: {
          success: false,
        },
      };

      mockApiServiceMethods.generateOTP.mockResolvedValue(mockResponse);

      await expect(authService.generateOTP('9876543210')).rejects.toThrow(
        'OTP generation failed',
      );
    });
  });

  describe('validateOTPAndLogin', () => {
    it('should validate OTP and return user data successfully', async () => {
      const { authService } = require('../../src/services/auth');
      const mockResponse = {
        data: {
          success: true,
          token: 'auth-token-123',
          message: 'OTP validated successfully',
        },
      };

      mockApiServiceMethods.validateOTP.mockResolvedValue(mockResponse);

      const result = await authService.validateOTPAndLogin(
        '9876543210',
        '123456',
      );

      expect(mockApiServiceMethods.validateOTP).toHaveBeenCalledWith({
        mobile_number: '9876543210',
        otp: '123456',
      });
      expect(result).toEqual({
        mobile_number: '9876543210',
        token: 'auth-token-123',
      });
    });

    it('should throw error when OTP validation fails', async () => {
      const { authService } = require('../../src/services/auth');
      const mockResponse = {
        data: {
          success: false,
          message: 'Invalid OTP',
        },
      };

      mockApiServiceMethods.validateOTP.mockResolvedValue(mockResponse);

      await expect(
        authService.validateOTPAndLogin('9876543210', '123456'),
      ).rejects.toThrow('Invalid OTP');
    });

    it('should throw error when token is missing', async () => {
      const { authService } = require('../../src/services/auth');
      const mockResponse = {
        data: {
          success: true,
          message: 'OTP validated successfully',
          // token is missing
        },
      };

      mockApiServiceMethods.validateOTP.mockResolvedValue(mockResponse);

      await expect(
        authService.validateOTPAndLogin('9876543210', '123456'),
      ).rejects.toThrow('OTP validated successfully');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const { authService } = require('../../src/services/auth');

      await authService.logout();

      expect(mockDispatch).toHaveBeenCalledWith(mockLogoutAction);
    });
  });
});
