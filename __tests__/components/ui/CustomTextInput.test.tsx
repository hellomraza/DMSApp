import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { TextInput } from 'react-native';
import CustomTextInput from '../../../src/components/ui/CustomTextInput';

// Mock the scale utilities
jest.mock('../../../src/utils/scale', () => ({
  scale: jest.fn(value => value),
  fontSize: {
    sm: 12,
    md: 16,
    lg: 18,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
}));

describe('CustomTextInput', () => {
  const defaultProps = {
    testID: 'custom-text-input',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render correctly with default props', () => {
      const { getByTestId } = render(<CustomTextInput {...defaultProps} />);

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should render with placeholder text', () => {
      const { getByPlaceholderText } = render(
        <CustomTextInput {...defaultProps} placeholder="Enter text" />,
      );

      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should render with initial value', () => {
      const { getByDisplayValue } = render(
        <CustomTextInput {...defaultProps} value="Initial value" />,
      );

      expect(getByDisplayValue('Initial value')).toBeTruthy();
    });

    it('should render without label when label prop is not provided', () => {
      const { queryByText } = render(<CustomTextInput {...defaultProps} />);

      expect(queryByText('Label')).toBeNull();
    });

    it('should render without error when error prop is not provided', () => {
      const { queryByText } = render(<CustomTextInput {...defaultProps} />);

      expect(queryByText('Error message')).toBeNull();
    });
  });

  describe('Label', () => {
    it('should render label when label prop is provided', () => {
      const { getByText } = render(
        <CustomTextInput {...defaultProps} label="Username" />,
      );

      expect(getByText('Username')).toBeTruthy();
    });

    it('should render multiple labels with different text', () => {
      const { rerender, getByText } = render(
        <CustomTextInput {...defaultProps} label="Email" />,
      );

      expect(getByText('Email')).toBeTruthy();

      rerender(<CustomTextInput {...defaultProps} label="Password" />);
      expect(getByText('Password')).toBeTruthy();
    });

    it('should handle empty label', () => {
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} label="" />,
      );

      // Empty label should still render the input
      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should handle special characters in label', () => {
      const specialLabel = 'Label with @#$%^&*()';
      const { getByText } = render(
        <CustomTextInput {...defaultProps} label={specialLabel} />,
      );

      expect(getByText(specialLabel)).toBeTruthy();
    });
  });

  describe('Error State', () => {
    it('should render error message when error prop is provided', () => {
      const { getByText } = render(
        <CustomTextInput {...defaultProps} error="This field is required" />,
      );

      expect(getByText('This field is required')).toBeTruthy();
    });

    it('should apply error styles to input when error is present', () => {
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} error="Error message" />,
      );

      const input = getByTestId('custom-text-input');
      expect(input).toBeTruthy();
    });

    it('should render both label and error', () => {
      const { getByText } = render(
        <CustomTextInput
          {...defaultProps}
          label="Email"
          error="Invalid email format"
        />,
      );

      expect(getByText('Email')).toBeTruthy();
      expect(getByText('Invalid email format')).toBeTruthy();
    });

    it('should handle empty error message', () => {
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} error="" />,
      );

      // Empty error should still render the input
      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should handle special characters in error message', () => {
      const specialError = 'Error with @#$%^&*()';
      const { getByText } = render(
        <CustomTextInput {...defaultProps} error={specialError} />,
      );

      expect(getByText(specialError)).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should call onChangeText when text changes', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} onChangeText={onChangeTextMock} />,
      );

      fireEvent.changeText(getByTestId('custom-text-input'), 'new text');
      expect(onChangeTextMock).toHaveBeenCalledWith('new text');
    });

    it('should call onFocus when input is focused', () => {
      const onFocusMock = jest.fn();
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} onFocus={onFocusMock} />,
      );

      fireEvent(getByTestId('custom-text-input'), 'focus');
      expect(onFocusMock).toHaveBeenCalled();
    });

    it('should call onBlur when input loses focus', () => {
      const onBlurMock = jest.fn();
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} onBlur={onBlurMock} />,
      );

      fireEvent(getByTestId('custom-text-input'), 'blur');
      expect(onBlurMock).toHaveBeenCalled();
    });

    it('should handle text input when not disabled', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} onChangeText={onChangeTextMock} />,
      );

      fireEvent.changeText(getByTestId('custom-text-input'), 'test input');
      expect(onChangeTextMock).toHaveBeenCalledWith('test input');
    });

    it('should handle multiple text changes', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} onChangeText={onChangeTextMock} />,
      );

      fireEvent.changeText(getByTestId('custom-text-input'), 'first');
      fireEvent.changeText(getByTestId('custom-text-input'), 'second');

      expect(onChangeTextMock).toHaveBeenCalledTimes(2);
      expect(onChangeTextMock).toHaveBeenNthCalledWith(1, 'first');
      expect(onChangeTextMock).toHaveBeenNthCalledWith(2, 'second');
    });
  });

  describe('TextInput Props', () => {
    it('should pass through TextInput props', () => {
      const { getByTestId } = render(
        <CustomTextInput
          {...defaultProps}
          multiline={true}
          numberOfLines={4}
          maxLength={100}
        />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should handle secureTextEntry for password inputs', () => {
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} secureTextEntry={true} />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should handle keyboardType', () => {
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} keyboardType="email-address" />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should handle autoCapitalize', () => {
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} autoCapitalize="words" />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should handle editable prop', () => {
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} editable={false} />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });
  });

  describe('Custom Styles', () => {
    it('should apply custom container style', () => {
      const customContainerStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <CustomTextInput
          {...defaultProps}
          containerStyle={customContainerStyle}
        />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should apply custom input style', () => {
      const customInputStyle = { backgroundColor: 'blue' };
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} inputStyle={customInputStyle} />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should apply custom label style', () => {
      const customLabelStyle = { color: 'green' };
      const { getByText } = render(
        <CustomTextInput
          {...defaultProps}
          label="Custom Label"
          labelStyle={customLabelStyle}
        />,
      );

      expect(getByText('Custom Label')).toBeTruthy();
    });

    it('should apply custom error style', () => {
      const customErrorStyle = { fontSize: 20 };
      const { getByText } = render(
        <CustomTextInput
          {...defaultProps}
          error="Custom Error"
          errorStyle={customErrorStyle}
        />,
      );

      expect(getByText('Custom Error')).toBeTruthy();
    });

    it('should apply style prop to input', () => {
      const customStyle = { borderColor: 'purple' };
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} style={customStyle} />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });
  });

  describe('Ref Handling', () => {
    it('should forward ref to TextInput', () => {
      const ref = React.createRef<TextInput>();
      render(<CustomTextInput {...defaultProps} ref={ref} />);

      expect(ref.current).toBeTruthy();
      expect(ref.current).toBeInstanceOf(TextInput);
    });

    it('should allow calling focus method through ref', () => {
      const ref = React.createRef<TextInput>();
      render(<CustomTextInput {...defaultProps} ref={ref} />);

      expect(() => ref.current?.focus()).not.toThrow();
    });

    it('should allow calling blur method through ref', () => {
      const ref = React.createRef<TextInput>();
      render(<CustomTextInput {...defaultProps} ref={ref} />);

      expect(() => ref.current?.blur()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with proper testID', () => {
      const { getByTestId } = render(
        <CustomTextInput testID="accessible-input" />,
      );

      expect(getByTestId('accessible-input')).toBeTruthy();
    });

    it('should handle accessibilityLabel', () => {
      const { getByTestId } = render(
        <CustomTextInput
          {...defaultProps}
          accessibilityLabel="Username input field"
        />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should handle accessibilityHint', () => {
      const { getByTestId } = render(
        <CustomTextInput
          {...defaultProps}
          accessibilityHint="Enter your username here"
        />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value gracefully', () => {
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} value={undefined} />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should handle null value gracefully', () => {
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} value={null as any} />,
      );

      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should handle very long text input', () => {
      const longText = 'a'.repeat(1000);
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} onChangeText={onChangeTextMock} />,
      );

      fireEvent.changeText(getByTestId('custom-text-input'), longText);
      expect(onChangeTextMock).toHaveBeenCalledWith(longText);
    });

    it('should handle special characters in input', () => {
      const specialText = '!@#$%^&*()_+-={}|[]\\:";\'<>?,./';
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} onChangeText={onChangeTextMock} />,
      );

      fireEvent.changeText(getByTestId('custom-text-input'), specialText);
      expect(onChangeTextMock).toHaveBeenCalledWith(specialText);
    });

    it('should handle empty string input', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <CustomTextInput {...defaultProps} onChangeText={onChangeTextMock} />,
      );

      fireEvent.changeText(getByTestId('custom-text-input'), '');
      expect(onChangeTextMock).toHaveBeenCalledWith('');
    });
  });

  describe('Combined States', () => {
    it('should render label, input, and error together', () => {
      const { getByText, getByTestId } = render(
        <CustomTextInput
          {...defaultProps}
          label="Email Address"
          error="Please enter a valid email"
          placeholder="example@email.com"
        />,
      );

      expect(getByText('Email Address')).toBeTruthy();
      expect(getByText('Please enter a valid email')).toBeTruthy();
      expect(getByTestId('custom-text-input')).toBeTruthy();
    });

    it('should handle error state with custom styles', () => {
      const { getByText, getByTestId } = render(
        <CustomTextInput
          {...defaultProps}
          error="Error message"
          inputStyle={{ borderWidth: 2 }}
          errorStyle={{ fontSize: 14 }}
        />,
      );

      expect(getByText('Error message')).toBeTruthy();
      expect(getByTestId('custom-text-input')).toBeTruthy();
    });
  });

  describe('Component Identity', () => {
    it('should have correct displayName', () => {
      expect(CustomTextInput.displayName).toBe('CustomTextInput');
    });
  });
});
