import {
  fontSize,
  horizontalScale,
  moderateScale,
  perfectSize,
  scale,
  scaleFont,
  spacing,
  verticalScale,
} from '../../src/utils/scale';

// Mock react-native-pixel-perfect
jest.mock('react-native-pixel-perfect', () => ({
  create: jest.fn(() => jest.fn(value => value * 1.2)), // Mock scaling factor
}));

describe('scale utility functions', () => {
  describe('scale function', () => {
    it('should scale values correctly', () => {
      expect(scale(10)).toBe(12); // 10 * 1.2
      expect(scale(20)).toBe(24); // 20 * 1.2
      expect(scale(0)).toBe(0);
    });

    it('should handle negative values', () => {
      expect(scale(-10)).toBe(-12);
    });

    it('should handle decimal values', () => {
      expect(scale(10.5)).toBe(12.6); // 10.5 * 1.2
    });
  });

  describe('scaleFont function', () => {
    it('should scale font sizes correctly', () => {
      expect(scaleFont(14)).toBe(16.8); // 14 * 1.2
      expect(scaleFont(16)).toBe(19.2); // 16 * 1.2
      expect(scaleFont(12)).toBeCloseTo(14.4, 1); // 12 * 1.2 (handle floating point)
    });

    it('should handle small font sizes', () => {
      expect(scaleFont(8)).toBe(9.6); // 8 * 1.2
    });

    it('should handle large font sizes', () => {
      expect(scaleFont(32)).toBe(38.4); // 32 * 1.2
    });
  });

  describe('verticalScale function', () => {
    it('should scale vertical dimensions correctly', () => {
      expect(verticalScale(100)).toBe(120); // 100 * 1.2
      expect(verticalScale(50)).toBe(60); // 50 * 1.2
    });

    it('should handle zero values', () => {
      expect(verticalScale(0)).toBe(0);
    });
  });

  describe('horizontalScale function', () => {
    it('should scale horizontal dimensions correctly', () => {
      expect(horizontalScale(200)).toBe(240); // 200 * 1.2
      expect(horizontalScale(150)).toBe(180); // 150 * 1.2
    });

    it('should handle small values', () => {
      expect(horizontalScale(1)).toBe(1.2); // 1 * 1.2
    });
  });

  describe('moderateScale function', () => {
    it('should apply moderate scaling with default factor', () => {
      const input = 10;
      const scaled = 12; // 10 * 1.2 (mocked scaling)
      const expected = input + (scaled - input) * 0.5; // 10 + (12 - 10) * 0.5 = 11

      expect(moderateScale(10)).toBe(expected);
    });

    it('should apply moderate scaling with custom factor', () => {
      const input = 20;
      const scaled = 24; // 20 * 1.2 (mocked scaling)
      const factor = 0.3;
      const expected = input + (scaled - input) * factor; // 20 + (24 - 20) * 0.3 = 21.2

      expect(moderateScale(20, 0.3)).toBe(expected);
    });

    it('should handle factor of 0 (no scaling)', () => {
      expect(moderateScale(15, 0)).toBe(15);
    });

    it('should handle factor of 1 (full scaling)', () => {
      expect(moderateScale(10, 1)).toBe(12); // Same as regular scale
    });
  });

  describe('perfectSize function', () => {
    it('should be exported and work correctly', () => {
      expect(perfectSize).toBeDefined();
      expect(typeof perfectSize).toBe('function');
      expect(perfectSize(10)).toBe(12); // 10 * 1.2
    });
  });

  describe('spacing constants', () => {
    it('should provide correct spacing values', () => {
      expect(spacing.xs).toBeCloseTo(4.8, 1); // scale(4) = 4 * 1.2
      expect(spacing.sm).toBeCloseTo(9.6, 1); // scale(8) = 8 * 1.2
      expect(spacing.md).toBeCloseTo(19.2, 1); // scale(16) = 16 * 1.2
      expect(spacing.lg).toBeCloseTo(28.8, 1); // scale(24) = 24 * 1.2
      expect(spacing.xl).toBeCloseTo(38.4, 1); // scale(32) = 32 * 1.2
      expect(spacing.xxl).toBeCloseTo(57.6, 1); // scale(48) = 48 * 1.2
    });

    it('should have all spacing properties defined', () => {
      expect(spacing).toHaveProperty('xs');
      expect(spacing).toHaveProperty('sm');
      expect(spacing).toHaveProperty('md');
      expect(spacing).toHaveProperty('lg');
      expect(spacing).toHaveProperty('xl');
      expect(spacing).toHaveProperty('xxl');
    });
  });

  describe('fontSize constants', () => {
    it('should provide correct font size values', () => {
      expect(fontSize.xs).toBeCloseTo(12, 1); // scaleFont(10) = 10 * 1.2
      expect(fontSize.sm).toBeCloseTo(14.4, 1); // scaleFont(12) = 12 * 1.2
      expect(fontSize.base).toBeCloseTo(16.8, 1); // scaleFont(14) = 14 * 1.2
      expect(fontSize.md).toBeCloseTo(19.2, 1); // scaleFont(16) = 16 * 1.2
      expect(fontSize.lg).toBeCloseTo(21.6, 1); // scaleFont(18) = 18 * 1.2
      expect(fontSize.xl).toBeCloseTo(24, 1); // scaleFont(20) = 20 * 1.2
      expect(fontSize.xxl).toBeCloseTo(28.8, 1); // scaleFont(24) = 24 * 1.2
      expect(fontSize.xxxl).toBeCloseTo(33.6, 1); // scaleFont(28) = 28 * 1.2
      expect(fontSize.huge).toBeCloseTo(38.4, 1); // scaleFont(32) = 32 * 1.2
    });

    it('should have all font size properties defined', () => {
      expect(fontSize).toHaveProperty('xs');
      expect(fontSize).toHaveProperty('sm');
      expect(fontSize).toHaveProperty('base');
      expect(fontSize).toHaveProperty('md');
      expect(fontSize).toHaveProperty('lg');
      expect(fontSize).toHaveProperty('xl');
      expect(fontSize).toHaveProperty('xxl');
      expect(fontSize).toHaveProperty('xxxl');
      expect(fontSize).toHaveProperty('huge');
    });

    it('should have increasing font sizes', () => {
      expect(fontSize.xs).toBeLessThan(fontSize.sm);
      expect(fontSize.sm).toBeLessThan(fontSize.base);
      expect(fontSize.base).toBeLessThan(fontSize.md);
      expect(fontSize.md).toBeLessThan(fontSize.lg);
      expect(fontSize.lg).toBeLessThan(fontSize.xl);
      expect(fontSize.xl).toBeLessThan(fontSize.xxl);
      expect(fontSize.xxl).toBeLessThan(fontSize.xxxl);
      expect(fontSize.xxxl).toBeLessThan(fontSize.huge);
    });
  });
});
