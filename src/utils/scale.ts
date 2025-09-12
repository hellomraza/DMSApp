import { create } from 'react-native-pixel-perfect';

const designResolution = {
  width: 375, // iPhone X/11/12 base width
  height: 812, // iPhone X/11/12 base height
}; // This should match your design mockup dimensions

const perfectSize = create(designResolution);

// Font scaling function
export const scaleFont = (size: number): number => {
  return perfectSize(size);
};

// General scaling function for width/height
export const scale = (size: number): number => {
  return perfectSize(size);
};

// Vertical scaling (for heights, margins, paddings)
export const verticalScale = (size: number): number => {
  return perfectSize(size);
};

// Horizontal scaling (for widths, margins, paddings)
export const horizontalScale = (size: number): number => {
  return perfectSize(size);
};

// Moderate scaling (for elements that shouldn't scale too much)
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const scaled = perfectSize(size);
  return size + (scaled - size) * factor;
};

// Export the original perfectSize function as well
export { perfectSize };

// Common spacing constants
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
};

// Common font sizes
export const fontSize = {
  xs: scaleFont(10),
  sm: scaleFont(12),
  base: scaleFont(14),
  md: scaleFont(16),
  lg: scaleFont(18),
  xl: scaleFont(20),
  xxl: scaleFont(24),
  xxxl: scaleFont(28),
  huge: scaleFont(32),
};
