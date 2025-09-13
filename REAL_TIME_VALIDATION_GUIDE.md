# Real-time Form Validation Implementation Guide

## Overview

The DMS React Native application implements comprehensive real-time form validation to provide users with immediate feedback and prevent submission of invalid data. This guide details the implementation, patterns, and best practices used throughout the application.

## ✨ Features

### Real-time Validation

- **Immediate Feedback**: Validation occurs as users type
- **Progressive Disclosure**: Errors only show after user interaction
- **Smart Button States**: Submit buttons automatically disable for invalid forms
- **Input Filtering**: Automatic filtering of invalid characters
- **Contextual Error Messages**: Specific, actionable error messages

### User Experience Benefits

- **Reduced Friction**: Users know immediately if their input is valid
- **Clear Guidance**: Specific error messages guide users to correct input
- **Prevention over Correction**: Invalid characters are filtered out automatically
- **Consistent Behavior**: Same validation patterns across all forms

## 🎯 Implementation Details

### State Management Pattern

```typescript
// Error state management
const [errors, setErrors] = useState<{
  mobile_number?: string;
}>({});

// Touch tracking to control when errors are shown
const [touched, setTouched] = useState<{
  mobile_number?: boolean;
}>({});
```

### Validation Functions

#### Mobile Number Validation (LoginScreen)

```typescript
const validateMobileNumber = (mobile: string): string | undefined => {
  if (!mobile.trim()) {
    return 'Mobile number is required';
  }
  if (mobile.length < 10) {
    return 'Mobile number must be at least 10 digits';
  }
  if (mobile.length > 10) {
    return 'Mobile number must be exactly 10 digits';
  }
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile)) {
    return 'Please enter a valid 10-digit mobile number';
  }
  return undefined;
};
```

#### Form-level Validation

```typescript
const validateForm = (): boolean => {
  const newErrors: { mobile_number?: string } = {};

  const mobileError = validateMobileNumber(formData.mobile_number);
  if (mobileError) {
    newErrors.mobile_number = mobileError;
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Event Handlers

#### Real-time Input Handler

```typescript
const handleMobileNumberChange = (text: string) => {
  // Input filtering - only allow numeric input
  const numericText = text.replace(/[^0-9]/g, '');

  // Update form data
  setFormData({ ...formData, mobile_number: numericText });

  // Real-time validation (only if field has been touched)
  if (touched.mobile_number) {
    const error = validateMobileNumber(numericText);
    setErrors(prev => ({ ...prev, mobile_number: error }));
  }
};
```

#### Blur Handler (Touch Tracking)

```typescript
const handleMobileNumberBlur = () => {
  // Mark field as touched
  setTouched(prev => ({ ...prev, mobile_number: true }));

  // Validate immediately on blur
  const error = validateMobileNumber(formData.mobile_number);
  setErrors(prev => ({ ...prev, mobile_number: error }));
};
```

#### Submit Handler

```typescript
const handleGenerateOTP = async () => {
  // Mark all fields as touched on submit attempt
  setTouched({ mobile_number: true });

  // Validate entire form
  if (!validateForm()) {
    return; // Prevent submission if validation fails
  }

  // Proceed with API call...
};
```

### UI Integration

#### CustomTextInput with Error Display

```typescript
<CustomTextInput
  label="Mobile Number"
  placeholder="Enter your mobile number"
  value={formData.mobile_number}
  onChangeText={handleMobileNumberChange}
  onBlur={handleMobileNumberBlur}
  keyboardType="numeric"
  maxLength={10}
  editable={!generateOTPMutation.isPending}
  error={touched.mobile_number ? errors.mobile_number : undefined}
  labelStyle={styles.label}
  inputStyle={styles.input}
/>
```

#### Smart Button State

```typescript
<CustomButton
  title="Send OTP"
  onPress={handleGenerateOTP}
  loading={generateOTPMutation.isPending}
  disabled={
    generateOTPMutation.isPending ||
    !!errors.mobile_number ||
    !formData.mobile_number.trim()
  }
/>
```

## 🎨 CustomTextInput Component

### Props Interface

```typescript
interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string; // Error message to display
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle; // Custom error styling
}
```

### Error Styling

```typescript
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  inputError: {
    borderColor: '#e74c3c', // Red border for errors
  },
  error: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
});
```

## 🔄 Validation Flow

### 1. Initial State

- No errors displayed
- Fields not marked as touched
- Submit button enabled (will validate on press)

### 2. User Interaction

- User starts typing → Input filtering applies
- User leaves field (onBlur) → Field marked as touched, validation runs
- Errors appear if validation fails

### 3. Real-time Updates

- As user continues typing → Real-time validation runs
- Errors update immediately
- Submit button state updates based on validation

### 4. Form Submission

- All fields marked as touched
- Complete form validation runs
- Submission prevented if validation fails

## 📋 Best Practices

### 1. Progressive Error Disclosure

```typescript
// Only show errors after user interaction
error={touched.fieldName ? errors.fieldName : undefined}
```

### 2. Input Filtering

```typescript
// Filter invalid characters before setting state
const numericText = text.replace(/[^0-9]/g, '');
```

### 3. Contextual Error Messages

```typescript
// Provide specific, actionable error messages
if (!mobile.trim()) return 'Mobile number is required';
if (mobile.length < 10) return 'Mobile number must be at least 10 digits';
```

### 4. Smart Button States

```typescript
// Disable submit when validation fails
disabled={
  isLoading ||
  !!errors.fieldName ||
  !formData.fieldName.trim()
}
```

### 5. Consistent Validation Patterns

- Same validation logic across components
- Reusable validation functions
- Consistent error message formatting

## 🚀 Extending the Pattern

### Adding New Fields

1. **Add to State**

```typescript
const [errors, setErrors] = useState<{
  mobile_number?: string;
  email?: string; // New field
}>({});

const [touched, setTouched] = useState<{
  mobile_number?: boolean;
  email?: boolean; // New field
}>({});
```

2. **Create Validation Function**

```typescript
const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return undefined;
};
```

3. **Add Event Handlers**

```typescript
const handleEmailChange = (text: string) => {
  setFormData({ ...formData, email: text });
  if (touched.email) {
    const error = validateEmail(text);
    setErrors(prev => ({ ...prev, email: error }));
  }
};

const handleEmailBlur = () => {
  setTouched(prev => ({ ...prev, email: true }));
  const error = validateEmail(formData.email);
  setErrors(prev => ({ ...prev, email: error }));
};
```

4. **Update Form Validation**

```typescript
const validateForm = (): boolean => {
  const newErrors: { mobile_number?: string; email?: string } = {};

  const mobileError = validateMobileNumber(formData.mobile_number);
  if (mobileError) newErrors.mobile_number = mobileError;

  const emailError = validateEmail(formData.email);
  if (emailError) newErrors.email = emailError;

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## 🧪 Testing Validation

### Unit Tests for Validation Functions

```typescript
describe('validateMobileNumber', () => {
  it('should return error for empty mobile number', () => {
    expect(validateMobileNumber('')).toBe('Mobile number is required');
  });

  it('should return error for short mobile number', () => {
    expect(validateMobileNumber('123')).toBe(
      'Mobile number must be at least 10 digits',
    );
  });

  it('should return error for long mobile number', () => {
    expect(validateMobileNumber('12345678901')).toBe(
      'Mobile number must be exactly 10 digits',
    );
  });

  it('should return undefined for valid mobile number', () => {
    expect(validateMobileNumber('1234567890')).toBeUndefined();
  });
});
```

### Integration Tests

```typescript
describe('LoginScreen Validation', () => {
  it('should show error when mobile number field is blurred with invalid input', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const input = getByPlaceholderText('Enter your mobile number');
    fireEvent.changeText(input, '123');
    fireEvent(input, 'blur');

    expect(getByText('Mobile number must be at least 10 digits')).toBeTruthy();
  });

  it('should disable submit button when validation fails', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const input = getByPlaceholderText('Enter your mobile number');
    const button = getByText('Send OTP');

    fireEvent.changeText(input, '123');
    fireEvent(input, 'blur');

    expect(button.props.disabled).toBe(true);
  });
});
```

## 📚 Related Documentation

- [CustomTextInput Component Guide](src/components/ui/README.md)
- [Authentication Flow](API_DOCUMENTATION.md#authentication)
- [TypeScript Definitions](TYPE_DEFINITIONS.md)
- [Testing Guide](DEVELOPMENT_GUIDE.md#testing)

## 🔧 Configuration

### Validation Rules Configuration

Consider extracting validation rules to configuration files for easier maintenance:

```typescript
// validationRules.ts
export const VALIDATION_RULES = {
  MOBILE_NUMBER: {
    REQUIRED: 'Mobile number is required',
    MIN_LENGTH: 'Mobile number must be at least 10 digits',
    MAX_LENGTH: 'Mobile number must be exactly 10 digits',
    INVALID_FORMAT: 'Please enter a valid 10-digit mobile number',
    REGEX: /^[0-9]{10}$/,
  },
};
```

This approach makes it easier to:

- Maintain consistent error messages
- Update validation rules globally
- Support internationalization
- Configure rules per environment
