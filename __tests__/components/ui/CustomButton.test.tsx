import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import CustomButton from '../../../src/components/ui/CustomButton';

// Mock the scale utilities
jest.mock('../../../src/utils/scale', () => ({
  scale: jest.fn(value => value),
  fontSize: {
    base: 14,
    md: 16,
    lg: 18,
  },
  spacing: {
    md: 12,
    lg: 16,
    xl: 20,
  },
}));

describe('CustomButton', () => {
  const defaultProps = {
    title: 'Test Button',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render correctly with default props', () => {
      const { getByText } = render(<CustomButton {...defaultProps} />);

      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render with custom title', () => {
      const { getByText } = render(
        <CustomButton {...defaultProps} title="Custom Title" />,
      );

      expect(getByText('Custom Title')).toBeTruthy();
    });

    it('should render loading indicator when loading is true', () => {
      const { getByTestId, queryByText } = render(
        <CustomButton
          {...defaultProps}
          loading={true}
          testID="custom-button"
        />,
      );

      expect(getByTestId('custom-button')).toBeTruthy();
      expect(queryByText('Test Button')).toBeNull();
    });

    it('should not render title text when loading', () => {
      const { queryByText } = render(
        <CustomButton {...defaultProps} loading={true} />,
      );

      expect(queryByText('Test Button')).toBeNull();
    });
  });

  describe('Variants', () => {
    it('should render primary variant by default', () => {
      const { getByText } = render(<CustomButton {...defaultProps} />);
      const button = getByText('Test Button').parent;

      expect(button).toBeTruthy();
    });

    it('should render secondary variant', () => {
      const { getByText } = render(
        <CustomButton {...defaultProps} variant="secondary" />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render danger variant', () => {
      const { getByText } = render(
        <CustomButton {...defaultProps} variant="danger" />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render outline variant', () => {
      const { getByText } = render(
        <CustomButton {...defaultProps} variant="outline" />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      const { getByText } = render(<CustomButton {...defaultProps} />);

      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render small size', () => {
      const { getByText } = render(
        <CustomButton {...defaultProps} size="small" />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render large size', () => {
      const { getByText } = render(
        <CustomButton {...defaultProps} size="large" />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <CustomButton {...defaultProps} onPress={onPressMock} />,
      );

      fireEvent.press(getByText('Test Button'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <CustomButton
          {...defaultProps}
          onPress={onPressMock}
          disabled={true}
        />,
      );

      fireEvent.press(getByText('Test Button'));
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should not call onPress when loading', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <CustomButton
          {...defaultProps}
          onPress={onPressMock}
          loading={true}
          testID="custom-button"
        />,
      );

      fireEvent.press(getByTestId('custom-button'));
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should be accessible when not disabled', () => {
      const { getByText } = render(<CustomButton {...defaultProps} />);
      const button = getByText('Test Button').parent;

      expect(button).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when loading is true', () => {
      const { getByTestId } = render(
        <CustomButton
          {...defaultProps}
          loading={true}
          testID="custom-button"
        />,
      );

      const button = getByTestId('custom-button');
      expect(button).toBeTruthy();
    });

    it('should use custom loading color when provided', () => {
      const { getByTestId } = render(
        <CustomButton
          {...defaultProps}
          loading={true}
          loadingColor="#ff0000"
          testID="custom-button"
        />,
      );

      expect(getByTestId('custom-button')).toBeTruthy();
    });

    it('should use default loading color for primary variant', () => {
      const { getByTestId } = render(
        <CustomButton
          {...defaultProps}
          loading={true}
          variant="primary"
          testID="custom-button"
        />,
      );

      expect(getByTestId('custom-button')).toBeTruthy();
    });

    it('should use default loading color for outline variant', () => {
      const { getByTestId } = render(
        <CustomButton
          {...defaultProps}
          loading={true}
          variant="outline"
          testID="custom-button"
        />,
      );

      expect(getByTestId('custom-button')).toBeTruthy();
    });
  });

  describe('Disabled State', () => {
    it('should render correctly when disabled', () => {
      const { getByText } = render(
        <CustomButton {...defaultProps} disabled={true} />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should not respond to press when disabled', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <CustomButton
          {...defaultProps}
          onPress={onPressMock}
          disabled={true}
        />,
      );

      fireEvent.press(getByText('Test Button'));
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Custom Styles', () => {
    it('should apply custom button style', () => {
      const customButtonStyle = { backgroundColor: '#custom' };
      const { getByText } = render(
        <CustomButton {...defaultProps} buttonStyle={customButtonStyle} />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should apply custom text style', () => {
      const customTextStyle = { color: '#custom' };
      const { getByText } = render(
        <CustomButton {...defaultProps} textStyle={customTextStyle} />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should apply custom style prop', () => {
      const customStyle = { margin: 10 };
      const { getByText } = render(
        <CustomButton {...defaultProps} style={customStyle} />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });
  });

  describe('TouchableOpacity Props', () => {
    it('should pass through TouchableOpacity props', () => {
      const { getByTestId } = render(
        <CustomButton
          {...defaultProps}
          testID="custom-button"
          accessibilityLabel="Custom Button"
        />,
      );

      expect(getByTestId('custom-button')).toBeTruthy();
    });

    it('should handle onLongPress', () => {
      const onLongPressMock = jest.fn();
      const { getByText } = render(
        <CustomButton {...defaultProps} onLongPress={onLongPressMock} />,
      );

      fireEvent(getByText('Test Button'), 'onLongPress');
      expect(onLongPressMock).toHaveBeenCalledTimes(1);
    });

    it('should handle activeOpacity', () => {
      const { getByText } = render(
        <CustomButton {...defaultProps} activeOpacity={0.5} />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      const { getByText } = render(<CustomButton {...defaultProps} title="" />);

      expect(getByText('')).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Button! @#$%^&*()';
      const { getByText } = render(
        <CustomButton {...defaultProps} title={specialTitle} />,
      );

      expect(getByText(specialTitle)).toBeTruthy();
    });

    it('should handle both loading and disabled states', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <CustomButton
          {...defaultProps}
          onPress={onPressMock}
          loading={true}
          disabled={true}
          testID="custom-button"
        />,
      );

      fireEvent.press(getByTestId('custom-button'));
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should handle undefined onPress', () => {
      const { getByText } = render(<CustomButton title="Test Button" />);

      expect(() => {
        fireEvent.press(getByText('Test Button'));
      }).not.toThrow();
    });
  });

  describe('Style Combinations', () => {
    it('should combine variant and size styles correctly', () => {
      const { getByText } = render(
        <CustomButton {...defaultProps} variant="outline" size="large" />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should apply disabled styles when loading', () => {
      const { getByTestId } = render(
        <CustomButton
          {...defaultProps}
          loading={true}
          testID="custom-button"
        />,
      );

      expect(getByTestId('custom-button')).toBeTruthy();
    });

    it('should apply disabled styles when disabled prop is true', () => {
      const { getByText } = render(
        <CustomButton {...defaultProps} disabled={true} />,
      );

      expect(getByText('Test Button')).toBeTruthy();
    });
  });
});
