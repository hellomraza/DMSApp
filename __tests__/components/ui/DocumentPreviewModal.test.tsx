import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import DocumentPreviewModal from '../../../src/components/ui/DocumentPreviewModal';

// Mock the PDFViewer component
jest.mock('../../../src/components/ui/PDFViewer', () => {
  const { View, Text } = require('react-native');
  return ({ source, style }: any) => (
    <View style={style} testID="pdf-viewer">
      <Text>PDF Viewer - {source?.uri}</Text>
    </View>
  );
});

const mockDocument = {
  id: '1',
  major_head: 'Test Major Head',
  minor_head: 'Test Minor Head',
  document_date: '2024-01-15',
  document_remarks: 'Test remarks',
  uploadedAt: '2024-01-15T10:30:00.000Z',
  uploadedBy: 'John Doe',
  file: {
    name: 'test-document.pdf',
    type: 'application/pdf',
    size: 1024000,
    localPath: '/path/to/test-document.pdf',
  },
  tags: [{ tag_name: 'Important' }, { tag_name: 'Urgent' }],
};

const mockImageDocument = {
  ...mockDocument,
  file: {
    name: 'test-image.jpg',
    type: 'image/jpeg',
    size: 512000,
    localPath: '/path/to/test-image.jpg',
  },
};

const mockTextDocument = {
  ...mockDocument,
  file: {
    name: 'test-document.txt',
    type: 'text/plain',
    size: 2048,
  },
};

const defaultProps = {
  visible: true,
  document: mockDocument,
  onClose: jest.fn(),
  onDownload: jest.fn(),
  onOpenPDFFullscreen: jest.fn(),
};

describe('DocumentPreviewModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible with document', () => {
    const { getByText } = render(<DocumentPreviewModal {...defaultProps} />);

    expect(getByText('Document Details')).toBeTruthy();
    expect(getByText('Test Major Head')).toBeTruthy();
    expect(getByText('Test Minor Head')).toBeTruthy();
    expect(getByText('test-document.pdf')).toBeTruthy();
    expect(getByText('application/pdf')).toBeTruthy();
    expect(getByText('Important')).toBeTruthy();
    expect(getByText('Urgent')).toBeTruthy();
  });

  it('does not render when document is null', () => {
    const { queryByText } = render(
      <DocumentPreviewModal {...defaultProps} document={null} />,
    );

    expect(queryByText('Document Details')).toBeNull();
  });

  it('does not render when visible is false', () => {
    const { queryByText } = render(
      <DocumentPreviewModal {...defaultProps} visible={false} />,
    );

    expect(queryByText('Document Details')).toBeNull();
  });

  it('calls onClose when close button is pressed', () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(
      <DocumentPreviewModal {...defaultProps} onClose={onCloseMock} />,
    );

    fireEvent.press(getByText('✕'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('renders PDF preview with fullscreen button', () => {
    const { getByTestId, getByText } = render(
      <DocumentPreviewModal {...defaultProps} />,
    );

    expect(getByTestId('pdf-viewer')).toBeTruthy();
    expect(getByText('📱 View Fullscreen')).toBeTruthy();
  });

  it('calls onOpenPDFFullscreen when fullscreen button is pressed', () => {
    const onOpenPDFFullscreenMock = jest.fn();
    const { getByText } = render(
      <DocumentPreviewModal
        {...defaultProps}
        onOpenPDFFullscreen={onOpenPDFFullscreenMock}
      />,
    );

    fireEvent.press(getByText('📱 View Fullscreen'));
    expect(onOpenPDFFullscreenMock).toHaveBeenCalledWith(
      { uri: 'file:///path/to/test-document.pdf' },
      'test-document.pdf',
    );
  });

  it('renders image preview for image files', () => {
    const { getByText, queryByTestId } = render(
      <DocumentPreviewModal {...defaultProps} document={mockImageDocument} />,
    );

    expect(getByText('test-image.jpg')).toBeTruthy();
    expect(getByText('image/jpeg')).toBeTruthy();
    expect(queryByTestId('pdf-viewer')).toBeNull();
  });

  it('renders text file preview placeholder', () => {
    const { getByText, getAllByText } = render(
      <DocumentPreviewModal {...defaultProps} document={mockTextDocument} />,
    );

    expect(getByText('📝 Text Document')).toBeTruthy();
    // Use getAllByText since filename appears in multiple places
    const filenameElements = getAllByText('test-document.txt');
    expect(filenameElements.length).toBeGreaterThan(0);
  });

  it('renders document without file information', () => {
    const documentWithoutFile = {
      ...mockDocument,
      file: undefined,
    };

    const { getByText, queryByText } = render(
      <DocumentPreviewModal {...defaultProps} document={documentWithoutFile} />,
    );

    expect(getByText('Document Details')).toBeTruthy();
    expect(getByText('Test Major Head')).toBeTruthy();
    expect(queryByText('File Information')).toBeNull();
    expect(queryByText('File Preview')).toBeNull();
  });

  it('renders document without tags', () => {
    const documentWithoutTags = {
      ...mockDocument,
      tags: [],
    };

    const { getByText, queryByText } = render(
      <DocumentPreviewModal {...defaultProps} document={documentWithoutTags} />,
    );

    expect(getByText('Document Details')).toBeTruthy();
    expect(queryByText('Tags')).toBeNull();
    expect(queryByText('Important')).toBeNull();
  });

  it('renders document without remarks', () => {
    const documentWithoutRemarks = {
      ...mockDocument,
      document_remarks: '',
    };

    const { getByText, queryByText } = render(
      <DocumentPreviewModal
        {...defaultProps}
        document={documentWithoutRemarks}
      />,
    );

    expect(getByText('Document Details')).toBeTruthy();
    expect(queryByText('Test remarks')).toBeNull();
  });

  it('calls onDownload and onClose when download button is pressed', () => {
    const onDownloadMock = jest.fn();
    const onCloseMock = jest.fn();
    const { getByText } = render(
      <DocumentPreviewModal
        {...defaultProps}
        onDownload={onDownloadMock}
        onClose={onCloseMock}
      />,
    );

    fireEvent.press(getByText('📥 Download Document'));
    expect(onDownloadMock).toHaveBeenCalledWith(mockDocument);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('shows downloading state correctly', () => {
    const { getByText } = render(
      <DocumentPreviewModal {...defaultProps} isDownloading={true} />,
    );

    expect(getByText('⬇️ Downloading...')).toBeTruthy();
  });

  it('shows downloading all state correctly', () => {
    const { getByText } = render(
      <DocumentPreviewModal
        {...defaultProps}
        isDownloadingAll={true}
        downloadedFilesCount={2}
        totalFilesCount={5}
      />,
    );

    expect(getByText('📥 Download Document (2/5 downloading)')).toBeTruthy();
  });

  it('formats file size correctly', () => {
    const { getByText } = render(<DocumentPreviewModal {...defaultProps} />);

    expect(getByText('1000 KB')).toBeTruthy();
  });

  it('formats date correctly', () => {
    const { getAllByText } = render(<DocumentPreviewModal {...defaultProps} />);

    // Date appears in both Document Date and Uploaded fields
    const dateElements = getAllByText('Monday, January 15, 2024');
    expect(dateElements.length).toBe(2);
  });

  it('renders PDF placeholder when no local path available', () => {
    const documentWithoutLocalPath = {
      ...mockDocument,
      file: {
        ...mockDocument.file,
        localPath: undefined,
        name: 'document-without-url', // Non-URL filename without .pdf extension
      },
    };

    const { getByText } = render(
      <DocumentPreviewModal
        {...defaultProps}
        document={documentWithoutLocalPath}
      />,
    );

    expect(getByText('📄 PDF Document')).toBeTruthy();
    expect(getByText('Download the file to view the PDF')).toBeTruthy();
  });

  it('renders image placeholder when no local path available', () => {
    const imageDocumentWithoutLocalPath = {
      ...mockImageDocument,
      file: {
        ...mockImageDocument.file,
        localPath: undefined,
      },
    };

    const { getByText } = render(
      <DocumentPreviewModal
        {...defaultProps}
        document={imageDocumentWithoutLocalPath}
      />,
    );

    expect(getByText('🖼️ Image Preview')).toBeTruthy();
    expect(getByText('Download the file to view the full image')).toBeTruthy();
  });

  it('renders unknown file type placeholder', () => {
    const unknownFileDocument = {
      ...mockDocument,
      file: {
        name: 'test-file.xyz',
        type: 'application/unknown',
        size: 1024,
      },
    };

    const { getByText } = render(
      <DocumentPreviewModal {...defaultProps} document={unknownFileDocument} />,
    );

    expect(getByText('📄 test-file.xyz')).toBeTruthy();
    expect(getByText('Preview not available for this file type')).toBeTruthy();
  });

  it('handles PDF from URL source', () => {
    const urlPdfDocument = {
      ...mockDocument,
      file: {
        name: 'https://example.com/test.pdf',
        type: 'application/pdf',
        size: 1024000,
        localPath: undefined,
      },
    };

    const { getByTestId } = render(
      <DocumentPreviewModal {...defaultProps} document={urlPdfDocument} />,
    );

    expect(getByTestId('pdf-viewer')).toBeTruthy();
  });
});
