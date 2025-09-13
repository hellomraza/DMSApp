import { render } from '@testing-library/react-native';
import React from 'react';
import PDFViewer from '../../../src/components/ui/PDFViewer';

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
      testID: 'pdf-viewer-component',
      ...props,
    });
  };
});

describe('PDFViewer', () => {
  const defaultSource = {
    uri: 'https://example.com/test.pdf',
  };

  it('renders correctly', () => {
    const { getByTestId } = render(<PDFViewer source={defaultSource} />);
    expect(getByTestId('pdf-viewer-component')).toBeTruthy();
  });

  it('passes source prop', () => {
    const { getByTestId } = render(<PDFViewer source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-viewer-component');
    expect(pdfComponent.props.source).toEqual(defaultSource);
  });

  it('sets configuration props', () => {
    const { getByTestId } = render(<PDFViewer source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-viewer-component');

    expect(pdfComponent.props.trustAllCerts).toBe(true);
    expect(pdfComponent.props.enablePaging).toBe(true);
    expect(pdfComponent.props.horizontal).toBe(true);
  });

  it('has callback functions', () => {
    const { getByTestId } = render(<PDFViewer source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-viewer-component');

    expect(typeof pdfComponent.props.onLoadComplete).toBe('function');
    expect(typeof pdfComponent.props.onError).toBe('function');
  });

  it('renders with custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <PDFViewer source={defaultSource} style={customStyle} />,
    );
    expect(getByTestId('pdf-viewer-component')).toBeTruthy();
  });

  it('renders with custom pdfStyle', () => {
    const customPdfStyle = { borderWidth: 2 };
    const { getByTestId } = render(
      <PDFViewer source={defaultSource} pdfStyle={customPdfStyle} />,
    );
    expect(getByTestId('pdf-viewer-component')).toBeTruthy();
  });

  it('handles different source types', () => {
    const localSource = { uri: '/local/path/document.pdf' };
    const { getByTestId } = render(<PDFViewer source={localSource} />);
    const pdfComponent = getByTestId('pdf-viewer-component');
    expect(pdfComponent.props.source).toEqual(localSource);
  });

  it('sets scale props correctly', () => {
    const { getByTestId } = render(<PDFViewer source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-viewer-component');

    expect(pdfComponent.props.scale).toBe(1.0);
    expect(pdfComponent.props.minScale).toBe(1.0);
    expect(pdfComponent.props.maxScale).toBe(3.0);
  });

  it('sets scroll indicators correctly', () => {
    const { getByTestId } = render(<PDFViewer source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-viewer-component');

    expect(pdfComponent.props.showsVerticalScrollIndicator).toBe(false);
    expect(pdfComponent.props.showsHorizontalScrollIndicator).toBe(true);
  });

  it('renders without crashing with empty source', () => {
    expect(() => {
      render(<PDFViewer source={{} as any} />);
    }).not.toThrow();
  });

  it('handles component unmounting gracefully', () => {
    const { unmount } = render(<PDFViewer source={defaultSource} />);
    expect(() => unmount()).not.toThrow();
  });
});
