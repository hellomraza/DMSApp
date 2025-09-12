# Responsive Scaling Guide

This guide explains how to use the `react-native-pixel-perfect` scaling system implemented in the DMSApp project.

## Overview

The scaling system ensures consistent font sizes and spacing across different screen sizes and densities. All scaling functions are based on a design resolution and automatically adapt to the device's actual screen size.

## Scaling Functions

### Import the scaling functions:

```typescript
import {
  scale,
  fontSize,
  spacing,
  scaleFont,
  moderateScale,
} from '../utils/scale';
```

### Available Functions

#### 1. `scale(size: number)` - General Scaling

Use for general width/height scaling:

```typescript
width: scale(100),
height: scale(50),
borderRadius: scale(8),
```

#### 2. `scaleFont(size: number)` - Font Scaling

Use specifically for font sizes:

```typescript
fontSize: scaleFont(16),
```

#### 3. `moderateScale(size: number, factor?: number)` - Moderate Scaling

Use for elements that shouldn't scale too aggressively:

```typescript
fontSize: moderateScale(16, 0.3), // Less aggressive scaling
```

### Pre-defined Constants

#### Spacing Constants

```typescript
spacing.xs; // 4px scaled
spacing.sm; // 8px scaled
spacing.md; // 16px scaled
spacing.lg; // 24px scaled
spacing.xl; // 32px scaled
spacing.xxl; // 48px scaled
```

#### Font Size Constants

```typescript
fontSize.xs; // 10px scaled
fontSize.sm; // 12px scaled
fontSize.base; // 14px scaled
fontSize.md; // 16px scaled
fontSize.lg; // 18px scaled
fontSize.xl; // 20px scaled
fontSize.xxl; // 24px scaled
fontSize.xxxl; // 28px scaled
fontSize.huge; // 32px scaled
```

## Usage Examples

### Component Styling

```typescript
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    margin: spacing.md,
    borderRadius: scale(12),
  },
  title: {
    fontSize: fontSize.xl,
    marginBottom: spacing.sm,
  },
  button: {
    height: scale(44),
    paddingHorizontal: spacing.md,
    borderRadius: scale(8),
  },
  buttonText: {
    fontSize: fontSize.md,
  },
});
```

### Input Components

```typescript
const inputStyles = StyleSheet.create({
  input: {
    height: scale(50),
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    borderRadius: scale(8),
    borderWidth: 1,
  },
  label: {
    fontSize: fontSize.base,
    marginBottom: spacing.xs,
  },
});
```

### Text Components

```typescript
const textStyles = StyleSheet.create({
  heading1: {
    fontSize: fontSize.xxxl,
    marginBottom: spacing.lg,
  },
  heading2: {
    fontSize: fontSize.xl,
    marginBottom: spacing.md,
  },
  body: {
    fontSize: fontSize.base,
    lineHeight: scale(20),
  },
  caption: {
    fontSize: fontSize.sm,
    color: '#666',
  },
});
```

## Design Resolution

The scaling is based on a design resolution of:

```typescript
const designResolution = {
  width: 375, // iPhone X/11/12 base width
  height: 812, // iPhone X/11/12 base height
};
```

## Best Practices

### 1. Use Pre-defined Constants

Prefer using the pre-defined spacing and fontSize constants for consistency:

✅ **Good:**

```typescript
marginTop: spacing.md,
fontSize: fontSize.lg,
```

❌ **Avoid:**

```typescript
marginTop: scale(16),
fontSize: scaleFont(18),
```

### 2. Consistent Scaling

Always scale related dimensions together:

✅ **Good:**

```typescript
const card = {
  padding: spacing.lg,
  borderRadius: scale(12),
  shadowRadius: scale(4),
  elevation: scale(3),
};
```

### 3. Text and Touch Targets

Use appropriate scaling for touch targets (minimum 44pt):

```typescript
const button = {
  minHeight: scale(44),
  minWidth: scale(44),
  paddingHorizontal: spacing.md,
};
```

### 4. Line Heights

Scale line heights proportionally to font sizes:

```typescript
const text = {
  fontSize: fontSize.base,
  lineHeight: scale(20), // ~1.4x the font size
};
```

## Migration from Hard-coded Values

When updating existing styles, replace hard-coded values:

### Before:

```typescript
const styles = StyleSheet.create({
  container: {
    padding: 24,
    margin: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
});
```

### After:

```typescript
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    margin: spacing.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    marginBottom: spacing.sm,
  },
});
```

## Testing Different Screen Sizes

To test your scaling implementation:

1. Test on different device simulators/devices
2. Use the device settings to change font size (accessibility)
3. Test on tablets and phones
4. Check that UI elements remain proportional

## Troubleshooting

### Common Issues:

1. **Text too small/large**: Adjust the `moderateScale` factor or use different fontSize constants
2. **Layout breaking**: Ensure all related dimensions are scaled together
3. **Touch targets too small**: Use minimum scale(44) for interactive elements

### Debug Scaling:

You can temporarily log scaled values to see the actual pixel values:

```typescript
console.log('Scaled value:', scale(16));
console.log('Font size:', fontSize.md);
```

This scaling system ensures your app looks consistent and professional across all device sizes!
