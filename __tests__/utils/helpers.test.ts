import {
  formatDate,
  formatDateTime,
  formatFileSize,
  formatMobileNumber,
  validateMobileNumber,
  validateOTP,
} from '../../src/utils/helpers';

describe('helpers utility functions', () => {
  describe('formatMobileNumber', () => {
    it('should remove non-numeric characters', () => {
      expect(formatMobileNumber('123-456-7890')).toBe('1234567890');
      expect(formatMobileNumber('+91 98765 43210')).toBe('9876543210');
      expect(formatMobileNumber('(123) 456-7890')).toBe('1234567890');
    });

    it('should return last 10 digits if number is longer', () => {
      expect(formatMobileNumber('919876543210')).toBe('9876543210');
      expect(formatMobileNumber('0919876543210')).toBe('9876543210');
    });

    it('should handle numbers with less than 10 digits', () => {
      expect(formatMobileNumber('12345')).toBe('12345');
      expect(formatMobileNumber('123456789')).toBe('123456789');
    });

    it('should handle empty string', () => {
      expect(formatMobileNumber('')).toBe('');
    });

    it('should handle string with no numbers', () => {
      expect(formatMobileNumber('abcdef')).toBe('');
    });
  });

  describe('validateMobileNumber', () => {
    it('should return true for valid 10-digit mobile numbers', () => {
      expect(validateMobileNumber('9876543210')).toBe(true);
      expect(validateMobileNumber('1234567890')).toBe(true);
    });

    it('should return false for invalid mobile numbers', () => {
      expect(validateMobileNumber('123456789')).toBe(false); // 9 digits
      expect(validateMobileNumber('12345678901')).toBe(false); // 11 digits
      expect(validateMobileNumber('123456789a')).toBe(false); // contains letter
      expect(validateMobileNumber('')).toBe(false); // empty string
      expect(validateMobileNumber('12-34-56-78-90')).toBe(false); // contains dashes
    });
  });

  describe('validateOTP', () => {
    it('should return true for valid 6-digit OTP', () => {
      expect(validateOTP('123456')).toBe(true);
      expect(validateOTP('000000')).toBe(true);
      expect(validateOTP('999999')).toBe(true);
    });

    it('should return false for invalid OTP', () => {
      expect(validateOTP('12345')).toBe(false); // 5 digits
      expect(validateOTP('1234567')).toBe(false); // 7 digits
      expect(validateOTP('12345a')).toBe(false); // contains letter
      expect(validateOTP('')).toBe(false); // empty string
      expect(validateOTP('12-34-56')).toBe(false); // contains dashes
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(500)).toBe('500 Bytes');
      expect(formatFileSize(1023)).toBe('1023 Bytes');
    });

    it('should format KB correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
    });

    it('should format MB correctly', () => {
      expect(formatFileSize(1048576)).toBe('1 MB'); // 1024 * 1024
      expect(formatFileSize(1572864)).toBe('1.5 MB'); // 1.5 * 1024 * 1024
      expect(formatFileSize(2097152)).toBe('2 MB'); // 2 * 1024 * 1024
    });

    it('should format GB correctly', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB'); // 1024 * 1024 * 1024
      expect(formatFileSize(1610612736)).toBe('1.5 GB'); // 1.5 * 1024 * 1024 * 1024
    });

    it('should handle large numbers', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 5.25)).toBe('5.25 GB');
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      // Mock Date to ensure consistent test results
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should format date string to Indian format', () => {
      const testDate = '2023-12-25T10:30:00Z';
      const formatted = formatDate(testDate);

      // The format should be DD/MM/YYYY
      expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('should handle different date formats', () => {
      const isoDate = '2023-06-15T08:00:00.000Z';
      const formatted = formatDate(isoDate);

      expect(formatted).toMatch(/^\d{2}\/\d{2}\/2023$/);
    });

    it('should handle invalid date strings', () => {
      const invalidDate = 'invalid-date';
      const formatted = formatDate(invalidDate);

      // Invalid date should still return some string (likely "Invalid Date")
      expect(typeof formatted).toBe('string');
    });
  });

  describe('formatDateTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should format datetime string to Indian format with time', () => {
      const testDateTime = '2023-12-25T14:30:00Z';
      const formatted = formatDateTime(testDateTime);

      // Should contain date and time
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/); // Date part
      expect(formatted).toMatch(/\d{2}:\d{2}/); // Time part
    });

    it('should handle different datetime formats', () => {
      const isoDateTime = '2023-06-15T20:45:30.000Z';
      const formatted = formatDateTime(isoDateTime);

      expect(formatted).toMatch(/^\d{2}\/\d{2}\/2023.*\d{2}:\d{2}/);
    });

    it('should handle invalid datetime strings', () => {
      const invalidDateTime = 'invalid-datetime';
      const formatted = formatDateTime(invalidDateTime);

      expect(typeof formatted).toBe('string');
    });
  });
});
