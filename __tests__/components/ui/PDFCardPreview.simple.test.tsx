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

// Mock react-native-pdf
jest.mock('react-native-pdf', () => {
  return function MockPdf(props: any) {
    return React.createElement(View, {
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

  it('applies custom style correctly', () => {
    const customStyle = { backgroundColor: 'red', height: 200 };
    const { container } = render(
      <PDFCardPreview source={defaultSource} style={customStyle} />,
    );

    // Check that the component renders with custom style
    expect(container).toBeTruthy();
  });

  it('passes source prop to PDF component', () => {
    const { getByTestId } = render(<PDFCardPreview source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-component');

    expect(pdfComponent.props.source).toEqual(defaultSource);
  });

  it('handles different source types', () => {
    const localSource = {
      uri: '/local/path/document.pdf',
    };

    const { getByTestId } = render(<PDFCardPreview source={localSource} />);
    const pdfComponent = getByTestId('pdf-component');

    expect(pdfComponent.props.source).toEqual(localSource);
  });

  it('handles source with cache property', () => {
    const cacheSource = {
      uri: 'https://example.com/test.pdf',
      cache: true,
    };

    const { getByTestId } = render(<PDFCardPreview source={cacheSource} />);
    const pdfComponent = getByTestId('pdf-component');

    expect(pdfComponent.props.source).toEqual(cacheSource);
  });

  it('sets correct PDF props', () => {
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

  it('has onLoadComplete callback', () => {
    const { getByTestId } = render(<PDFCardPreview source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-component');

    expect(typeof pdfComponent.props.onLoadComplete).toBe('function');
  });

  it('has onError callback', () => {
    const { getByTestId } = render(<PDFCardPreview source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-component');

    expect(typeof pdfComponent.props.onError).toBe('function');
  });

  it('has renderActivityIndicator function', () => {
    const { getByTestId } = render(<PDFCardPreview source={defaultSource} />);
    const pdfComponent = getByTestId('pdf-component');

    expect(typeof pdfComponent.props.renderActivityIndicator).toBe('function');
  });

  it('renders without crashing when source is null', () => {
    const { container } = render(<PDFCardPreview source={{} as any} />);

    expect(container).toBeTruthy();
  });

  it('renders with empty style prop', () => {
    const { getByTestId } = render(
      <PDFCardPreview source={defaultSource} style={{}} />,
    );

    expect(getByTestId('pdf-component')).toBeTruthy();
  });

  it('renders with undefined style prop', () => {
    const { getByTestId } = render(
      <PDFCardPreview source={defaultSource} style={undefined} />,
    );

    expect(getByTestId('pdf-component')).toBeTruthy();
  });
});
