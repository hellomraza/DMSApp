import { store } from '../../src/store';
import { getCurrentToken, isUserAuthenticated } from '../../src/utils/auth';

// Mock the store
jest.mock('../../src/store', () => ({
  store: {
    getState: jest.fn(),
  },
}));

const mockStore = store as jest.Mocked<typeof store>;

describe('auth utility functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentToken', () => {
    it('should return token from store state', () => {
      const mockToken = 'test-token-123';
      mockStore.getState.mockReturnValue({
        auth: {
          token: mockToken,
          isAuthenticated: true,
        },
      } as any);

      const result = getCurrentToken();
      expect(result).toBe(mockToken);
      expect(mockStore.getState).toHaveBeenCalledTimes(1);
    });

    it('should return null when token is null', () => {
      mockStore.getState.mockReturnValue({
        auth: {
          token: null,
          isAuthenticated: false,
        },
      } as any);

      const result = getCurrentToken();
      expect(result).toBeNull();
      expect(mockStore.getState).toHaveBeenCalledTimes(1);
    });

    it('should return undefined when token is undefined', () => {
      mockStore.getState.mockReturnValue({
        auth: {
          isAuthenticated: false,
        },
      } as any);

      const result = getCurrentToken();
      expect(result).toBeUndefined();
      expect(mockStore.getState).toHaveBeenCalledTimes(1);
    });
  });

  describe('isUserAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      mockStore.getState.mockReturnValue({
        auth: {
          token: 'some-token',
          isAuthenticated: true,
        },
      } as any);

      const result = isUserAuthenticated();
      expect(result).toBe(true);
      expect(mockStore.getState).toHaveBeenCalledTimes(1);
    });

    it('should return false when user is not authenticated', () => {
      mockStore.getState.mockReturnValue({
        auth: {
          token: null,
          isAuthenticated: false,
        },
      } as any);

      const result = isUserAuthenticated();
      expect(result).toBe(false);
      expect(mockStore.getState).toHaveBeenCalledTimes(1);
    });

    it('should return false when isAuthenticated is undefined', () => {
      mockStore.getState.mockReturnValue({
        auth: {
          token: 'some-token',
        },
      } as any);

      const result = isUserAuthenticated();
      expect(result).toBeFalsy();
      expect(mockStore.getState).toHaveBeenCalledTimes(1);
    });

    it('should handle missing auth state gracefully', () => {
      mockStore.getState.mockReturnValue({} as any);

      expect(() => isUserAuthenticated()).toThrow();
      expect(mockStore.getState).toHaveBeenCalledTimes(1);
    });
  });
});
