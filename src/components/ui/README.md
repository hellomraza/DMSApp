# Reusable UI Components

This document provides examples of how to use the reusable UI components created for the DMS App.

## CustomTextInput

A reusable text input component with label support, error handling, and customizable styling.

### Props

```typescript
interface CustomTextInputProps extends TextInputProps {
  label?: string; // Optional label text
  error?: string; // Error message to display
  containerStyle?: ViewStyle; // Style for the container
  inputStyle?: TextStyle; // Style for the input field
  labelStyle?: TextStyle; // Style for the label
  errorStyle?: TextStyle; // Style for the error text
}
```

### Usage Examples

```tsx
import { CustomTextInput } from '../components/ui';

// Basic usage
<CustomTextInput
  label="Mobile Number"
  placeholder="Enter your mobile number"
  value={mobileNumber}
  onChangeText={setMobileNumber}
  keyboardType="numeric"
/>

// With error
<CustomTextInput
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  keyboardType="email-address"
/>

// Custom styling
<CustomTextInput
  label="OTP"
  placeholder="000000"
  value={otp}
  onChangeText={setOtp}
  textAlign="center"
  maxLength={6}
  inputStyle={{ fontSize: 18, letterSpacing: 2 }}
  labelStyle={{ textAlign: 'center' }}
/>
```

## CustomButton

A reusable button component with loading states, variants, and sizes.

### Props

```typescript
interface CustomButtonProps extends TouchableOpacityProps {
  title: string; // Button text (required)
  loading?: boolean; // Show loading indicator
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'; // Button style variant
  size?: 'small' | 'medium' | 'large'; // Button size
  buttonStyle?: ViewStyle; // Custom button style
  textStyle?: TextStyle; // Custom text style
  loadingColor?: string; // Loading indicator color
}
```

### Usage Examples

```tsx
import { CustomButton } from '../components/ui';

// Primary button (default)
<CustomButton
  title="Send OTP"
  onPress={handleSendOTP}
  loading={isLoading}
/>

// Secondary button
<CustomButton
  title="Cancel"
  variant="secondary"
  onPress={handleCancel}
/>

// Danger button
<CustomButton
  title="Delete"
  variant="danger"
  onPress={handleDelete}
/>

// Outline button
<CustomButton
  title="Change Number"
  variant="outline"
  size="small"
  onPress={handleChangeNumber}
/>

// Custom styling
<CustomButton
  title="Custom Button"
  onPress={handlePress}
  buttonStyle={{ backgroundColor: '#purple' }}
  textStyle={{ fontSize: 18 }}
/>
```

## Component Features

### CustomTextInput Features

- ✅ Built-in label support
- ✅ Error message display
- ✅ Customizable styling for all parts
- ✅ Forwarded ref support
- ✅ All TextInput props supported
- ✅ Consistent default styling

### CustomButton Features

- ✅ Loading state with spinner
- ✅ Multiple variants (primary, secondary, danger, outline)
- ✅ Three sizes (small, medium, large)
- ✅ Disabled state handling
- ✅ Customizable colors and styles
- ✅ All TouchableOpacity props supported

## Import

```tsx
// Individual imports
import { CustomTextInput, CustomButton } from '../components/ui';

// Or from main components index
import { CustomTextInput, CustomButton } from '../components';
```

## Styling Guidelines

The components use consistent colors and styling that match the app's design system:

- Primary color: `#3498db`
- Text color: `#2c3e50`
- Error color: `#e74c3c`
- Secondary color: `#95a5a6`
- Border color: `#ddd`
- Background: `#ffffff`

You can override these by passing custom styles through the respective style props.
