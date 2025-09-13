import { render } from '@testing-library/react-native';
import React from 'react';
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

// Mock react-native-pdf
jest.mock('react-native-pdf', () => {
  const mockReact = require('react');
  const { View } = require('react-native');

  return function MockPdf(props: any) {
    return mockReact.createElement(View, {
      testID: 'pdf-component',
      ...props,
    });
  };
});

describe('PDFCardPreview', () => {
  const defaultSource = {
    uri: 'https://example.com/test.pdf',
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<PDFCardPreview source={defaultSource} />);

    expect(getByTestId('pdf-component')).toBeTruthy();
  });

  it('renders with custom style', () => {
    const customStyle = { backgroundColor: 'red', height: 200 };
    const { getByTestId } = render(
      <PDFCardPreview source={defaultSource} style={customStyle} />,
    );

    expect(getByTestId('pdf-component')).toBeTruthy();
  });

  it('passes source to PDF component', () => {
    const { getByTestId } = render(<PDFCardPreview source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-component');

    expect(pdfComponent.props.source).toEqual(defaultSource);
  });

  it('sets PDF configuration props correctly', () => {
    const { getByTestId } = render(<PDFCardPreview source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-component');

    expect(pdfComponent.props.trustAllCerts).toBe(true);
    expect(pdfComponent.props.enablePaging).toBe(false);
    expect(pdfComponent.props.enableRTL).toBe(false);
    expect(pdfComponent.props.enableAnnotationRendering).toBe(false);
    expect(pdfComponent.props.enableAntialiasing).toBe(true);
    expect(pdfComponent.props.fitPolicy).toBe(0);
    expect(pdfComponent.props.spacing).toBe(0);
    expect(pdfComponent.props.horizontal).toBe(false);
    expect(pdfComponent.props.showsVerticalScrollIndicator).toBe(false);
    expect(pdfComponent.props.showsHorizontalScrollIndicator).toBe(false);
    expect(pdfComponent.props.page).toBe(1);
    expect(pdfComponent.props.scale).toBe(1.0);
    expect(pdfComponent.props.minScale).toBe(1.0);
    expect(pdfComponent.props.maxScale).toBe(1.0);
  });

  it('has callback functions', () => {
    const { getByTestId } = render(<PDFCardPreview source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-component');

    expect(typeof pdfComponent.props.onLoadComplete).toBe('function');
    expect(typeof pdfComponent.props.onError).toBe('function');
    expect(typeof pdfComponent.props.renderActivityIndicator).toBe('function');
  });

  it('handles different source types', () => {
    const localSource = { uri: '/local/path/document.pdf' };
    const { getByTestId } = render(<PDFCardPreview source={localSource} />);
    const pdfComponent = getByTestId('pdf-component');

    expect(pdfComponent.props.source).toEqual(localSource);
  });

  it('handles source with cache property', () => {
    const cacheSource = { uri: 'https://example.com/test.pdf', cache: true };
    const { getByTestId } = render(<PDFCardPreview source={cacheSource} />);
    const pdfComponent = getByTestId('pdf-component');

    expect(pdfComponent.props.source).toEqual(cacheSource);
  });

  it('renders activity indicator correctly', () => {
    const { getByTestId } = render(<PDFCardPreview source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-component');
    const activityIndicator = pdfComponent.props.renderActivityIndicator();

    expect(activityIndicator).toBeTruthy();
  });

  it('renders without crashing with empty source', () => {
    expect(() => {
      render(<PDFCardPreview source={{} as any} />);
    }).not.toThrow();
  });

  it('renders with undefined style', () => {
    expect(() => {
      render(<PDFCardPreview source={defaultSource} style={undefined} />);
    }).not.toThrow();
  });

  it('handles component lifecycle correctly', () => {
    const { unmount } = render(<PDFCardPreview source={defaultSource} />);

    expect(() => unmount()).not.toThrow();
  });
});
