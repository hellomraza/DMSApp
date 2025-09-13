import * as authUtils from '../../src/utils/auth';
import * as helperUtils from '../../src/utils/helpers';
import * as utilsIndex from '../../src/utils/index';
import * as scaleUtils from '../../src/utils/scale';

describe('utils index exports', () => {
  it('should export all auth utilities', () => {
    expect(utilsIndex.getCurrentToken).toBeDefined();
    expect(utilsIndex.isUserAuthenticated).toBeDefined();

    // Check if they're the same functions
    expect(utilsIndex.getCurrentToken).toBe(authUtils.getCurrentToken);
    expect(utilsIndex.isUserAuthenticated).toBe(authUtils.isUserAuthenticated);
  });

  it('should export all helper utilities', () => {
    expect(utilsIndex.formatMobileNumber).toBeDefined();
    expect(utilsIndex.validateMobileNumber).toBeDefined();
    expect(utilsIndex.validateOTP).toBeDefined();
    expect(utilsIndex.formatFileSize).toBeDefined();
    expect(utilsIndex.formatDate).toBeDefined();
    expect(utilsIndex.formatDateTime).toBeDefined();

    // Check if they're the same functions
    expect(utilsIndex.formatMobileNumber).toBe(helperUtils.formatMobileNumber);
    expect(utilsIndex.validateMobileNumber).toBe(
      helperUtils.validateMobileNumber,
    );
    expect(utilsIndex.validateOTP).toBe(helperUtils.validateOTP);
    expect(utilsIndex.formatFileSize).toBe(helperUtils.formatFileSize);
    expect(utilsIndex.formatDate).toBe(helperUtils.formatDate);
    expect(utilsIndex.formatDateTime).toBe(helperUtils.formatDateTime);
  });

  it('should export all scale utilities', () => {
    expect(utilsIndex.scale).toBeDefined();
    expect(utilsIndex.scaleFont).toBeDefined();
    expect(utilsIndex.verticalScale).toBeDefined();
    expect(utilsIndex.horizontalScale).toBeDefined();
    expect(utilsIndex.moderateScale).toBeDefined();
    expect(utilsIndex.perfectSize).toBeDefined();
    expect(utilsIndex.spacing).toBeDefined();
    expect(utilsIndex.fontSize).toBeDefined();

    // Check if they're the same functions/objects
    expect(utilsIndex.scale).toBe(scaleUtils.scale);
    expect(utilsIndex.scaleFont).toBe(scaleUtils.scaleFont);
    expect(utilsIndex.verticalScale).toBe(scaleUtils.verticalScale);
    expect(utilsIndex.horizontalScale).toBe(scaleUtils.horizontalScale);
    expect(utilsIndex.moderateScale).toBe(scaleUtils.moderateScale);
    expect(utilsIndex.perfectSize).toBe(scaleUtils.perfectSize);
    expect(utilsIndex.spacing).toBe(scaleUtils.spacing);
    expect(utilsIndex.fontSize).toBe(scaleUtils.fontSize);
  });

  it('should have all expected exports available', () => {
    const expectedExports = [
      // Auth utils
      'getCurrentToken',
      'isUserAuthenticated',
      // Helper utils
      'formatMobileNumber',
      'validateMobileNumber',
      'validateOTP',
      'formatFileSize',
      'formatDate',
      'formatDateTime',
      // Scale utils
      'scale',
      'scaleFont',
      'verticalScale',
      'horizontalScale',
      'moderateScale',
      'perfectSize',
      'spacing',
      'fontSize',
    ];

    expectedExports.forEach(exportName => {
      expect(utilsIndex).toHaveProperty(exportName);
      expect(utilsIndex[exportName as keyof typeof utilsIndex]).toBeDefined();
    });
  });

  it('should not have any unexpected exports', () => {
    const actualExports = Object.keys(utilsIndex);
    const expectedExports = [
      'getCurrentToken',
      'isUserAuthenticated',
      'formatMobileNumber',
      'validateMobileNumber',
      'validateOTP',
      'formatFileSize',
      'formatDate',
      'formatDateTime',
      'scale',
      'scaleFont',
      'verticalScale',
      'horizontalScale',
      'moderateScale',
      'perfectSize',
      'spacing',
      'fontSize',
    ];

    // Check that we don't have unexpected exports
    actualExports.forEach(exportName => {
      expect(expectedExports).toContain(exportName);
    });
  });
});
