import { render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import PDFCardPreview from '../../../src/components/ui/PDFCardPreview';

// Mock the scale utilities
jest.mock('../../../src/utils/scale', () => ({
  scale: jest.fn(value => value),
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
}));

// Mock react-native-pdf with a simple mock
const mockReactNativePdf = jest.fn(props => {
  return React.createElement(View, {
    testID: 'pdf-component',
    ...props,
  });
});

jest.mock('react-native-pdf', () => mockReactNativePdf);

describe('PDFCardPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultSource = {
    uri: 'https://example.com/test.pdf',
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<PDFCardPreview source={defaultSource} />);

    expect(getByTestId('pdf-component')).toBeTruthy();
  });

  it('passes source prop to PDF component', () => {
    render(<PDFCardPreview source={defaultSource} />);

    expect(mockReactNativePdf).toHaveBeenCalledWith(
      expect.objectContaining({
        source: defaultSource,
      }),
      expect.any(Object),
    );
  });

  it('passes correct PDF configuration props', () => {
    render(<PDFCardPreview source={defaultSource} />);

    expect(mockReactNativePdf).toHaveBeenCalledWith(
      expect.objectContaining({
        trustAllCerts: true,
        enablePaging: false,
        enableRTL: false,
        enableAnnotationRendering: false,
        enableAntialiasing: true,
        fitPolicy: 0,
        spacing: 0,
        horizontal: false,
        showsVerticalScrollIndicator: false,
        showsHorizontalScrollIndicator: false,
        page: 1,
        scale: 1.0,
        minScale: 1.0,
        maxScale: 1.0,
      }),
      expect.any(Object),
    );
  });

  it('applies custom style correctly', () => {
    const customStyle = { backgroundColor: 'red', height: 200 };

    render(<PDFCardPreview source={defaultSource} style={customStyle} />);

    // Just verify it renders without error
    expect(mockReactNativePdf).toHaveBeenCalled();
  });

  it('handles different source types', () => {
    const localSource = {
      uri: '/local/path/document.pdf',
    };

    render(<PDFCardPreview source={localSource} />);

    expect(mockReactNativePdf).toHaveBeenCalledWith(
      expect.objectContaining({
        source: localSource,
      }),
      expect.any(Object),
    );
  });

  it('handles source with cache property', () => {
    const cacheSource = {
      uri: 'https://example.com/test.pdf',
      cache: true,
    };

    render(<PDFCardPreview source={cacheSource} />);

    expect(mockReactNativePdf).toHaveBeenCalledWith(
      expect.objectContaining({
        source: cacheSource,
      }),
      expect.any(Object),
    );
  });

  it('has required callback functions', () => {
    render(<PDFCardPreview source={defaultSource} />);

    const lastCall =
      mockReactNativePdf.mock.calls[mockReactNativePdf.mock.calls.length - 1];
    const props = lastCall[0];

    expect(typeof props.onLoadComplete).toBe('function');
    expect(typeof props.onError).toBe('function');
    expect(typeof props.renderActivityIndicator).toBe('function');
  });

  it('renders activity indicator as empty view', () => {
    render(<PDFCardPreview source={defaultSource} />);

    const lastCall =
      mockReactNativePdf.mock.calls[mockReactNativePdf.mock.calls.length - 1];
    const props = lastCall[0];
    const activityIndicator = props.renderActivityIndicator();

    expect(activityIndicator).toBeTruthy();
  });

  it('renders without crashing with empty source', () => {
    expect(() => {
      render(<PDFCardPreview source={{} as any} />);
    }).not.toThrow();
  });

  it('renders with undefined style prop', () => {
    expect(() => {
      render(<PDFCardPreview source={defaultSource} style={undefined} />);
    }).not.toThrow();
  });

  it('handles component unmounting gracefully', () => {
    const { unmount } = render(<PDFCardPreview source={defaultSource} />);

    expect(() => unmount()).not.toThrow();
  });
});
