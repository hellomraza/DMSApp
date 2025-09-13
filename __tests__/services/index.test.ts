// Mock React Native dependencies
jest.mock('react-native-config', () => ({}));
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}));
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/test/documents',
}));
jest.mock('../../src/services/fileManager', () => ({
  fileManager: { initialize: jest.fn() },
}));
jest.mock('../../src/utils/auth', () => ({
  getCurrentToken: jest.fn(() => 'mock-token'),
}));
jest.mock('../../src/store', () => ({
  __esModule: true,
  default: { dispatch: jest.fn() },
}));
jest.mock('../../src/store/slices/authSlice', () => ({
  logout: jest.fn(() => ({ type: 'auth/logout' })),
}));
jest.mock('redux-persist', () => ({
  persistReducer: jest.fn((config, reducer) => reducer),
  persistStore: jest.fn(),
}));

describe('Services Index', () => {
  it('should export all service modules', () => {
    const services = require('../../src/services/index');

    expect(services).toHaveProperty('apiService');
    expect(services).toHaveProperty('apiSwitcher');
    expect(services).toHaveProperty('authService');
    expect(services).toHaveProperty('mockApiService');
    expect(services).toHaveProperty('MOCK_CONFIG');
  });

  it('should allow importing individual services', () => {
    const {
      apiService,
      authService,
      apiSwitcher,
      mockApiService,
      MOCK_CONFIG,
    } = require('../../src/services/index');

    expect(apiService).toBeDefined();
    expect(authService).toBeDefined();
    expect(apiSwitcher).toBeDefined();
    expect(mockApiService).toBeDefined();
    expect(MOCK_CONFIG).toBeDefined();
  });

  it('should export services as named exports', () => {
    const services = require('../../src/services/index');

    expect(typeof services.apiService).toBe('object');
    expect(typeof services.authService).toBe('object');
    expect(typeof services.apiSwitcher).toBe('object');
    expect(typeof services.mockApiService).toBe('object');
    expect(typeof services.MOCK_CONFIG).toBe('object');
  });
});
