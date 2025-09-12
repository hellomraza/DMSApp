import React, { forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { fontSize, scale, spacing } from '../../utils/scale';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  (
    {
      label,
      error,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[styles.input, error && styles.inputError, inputStyle, style]}
          placeholderTextColor="#999"
          {...props}
        />
        {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: spacing.sm,
  },
  input: {
    height: scale(50),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    paddingHorizontal: spacing.md,
    backgroundColor: '#ffffff',
    fontSize: fontSize.md,
    color: '#2c3e50',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  error: {
    fontSize: fontSize.sm,
    color: '#e74c3c',
    marginTop: spacing.xs,
  },
});

CustomTextInput.displayName = 'CustomTextInput';

export default CustomTextInput;
