import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  size = 'medium',
  buttonStyle,
  textStyle,
  loadingColor,
  disabled,
  style,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button, styles[`button_${size}`]];

    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.buttonSecondary);
        break;
      case 'danger':
        baseStyle.push(styles.buttonDanger);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutline);
        break;
      default:
        baseStyle.push(styles.buttonPrimary);
    }

    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabled);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: any[] = [styles.buttonText, styles[`buttonText_${size}`]];

    switch (variant) {
      case 'outline':
        baseStyle.push(styles.buttonTextOutline);
        break;
      default:
        baseStyle.push(styles.buttonTextDefault);
    }

    return baseStyle;
  };

  const getLoadingColor = () => {
    if (loadingColor) return loadingColor;
    return variant === 'outline' ? '#3498db' : '#ffffff';
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), buttonStyle, style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button_small: {
    height: 36,
    paddingHorizontal: 16,
  },
  button_medium: {
    height: 50,
    paddingHorizontal: 20,
  },
  button_large: {
    height: 56,
    paddingHorizontal: 24,
  },
  buttonPrimary: {
    backgroundColor: '#3498db',
  },
  buttonSecondary: {
    backgroundColor: '#95a5a6',
  },
  buttonDanger: {
    backgroundColor: '#e74c3c',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
    borderColor: '#bdc3c7',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonText_small: {
    fontSize: 14,
  },
  buttonText_medium: {
    fontSize: 16,
  },
  buttonText_large: {
    fontSize: 18,
  },
  buttonTextDefault: {
    color: '#ffffff',
  },
  buttonTextOutline: {
    color: '#3498db',
  },
});

export default CustomButton;
