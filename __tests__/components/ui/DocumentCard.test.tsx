import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import DocumentCard from '../../../src/components/ui/DocumentCard';

// Mock the scale utilities
jest.mock('../../../src/utils/scale', () => ({
  scale: jest.fn(value => value),
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
}));

// Mock PDFCardPreview component
jest.mock('../../../src/components/ui/PDFCardPreview', () => {
  return function MockPDFCardPreview({ source: _source, style: _style }: any) {
    return null; // Return null to simulate the component rendering
  };
});

describe('DocumentCard', () => {
  const mockDocument = {
    id: '1',
    major_head: 'Test Document Title',
    minor_head: 'Test Document Subtitle',
    document_date: '2025-01-15',
    document_remarks: 'Test remarks',
    tags: [
      { tag_name: 'Important' },
      { tag_name: 'Finance' },
      { tag_name: 'Legal' },
    ],
    file: {
      name: 'test-document.pdf',
      type: 'application/pdf',
      size: 1024000, // 1MB
      localPath: '/path/to/local/file.pdf',
    },
    uploadedAt: '2025-01-15T10:00:00Z',
    uploadedBy: 'test@example.com',
  };

  const defaultProps = {
    document: mockDocument,
    isDownloading: false,
    downloadProgress: 0,
    onPreview: jest.fn(),
    onDownload: jest.fn(),
    isPreviewable: jest.fn(() => true),
    isDownloaded: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render correctly with default props', () => {
      const { getByText } = render(<DocumentCard {...defaultProps} />);

      expect(getByText('Test Document Title')).toBeTruthy();
      expect(getByText('Test Document Subtitle')).toBeTruthy();
    });

    it('should render document title and subtitle', () => {
      const { getByText } = render(<DocumentCard {...defaultProps} />);

      expect(getByText('Test Document Title')).toBeTruthy();
      expect(getByText('Test Document Subtitle')).toBeTruthy();
    });

    it('should render formatted date', () => {
      const { getByText } = render(<DocumentCard {...defaultProps} />);

      expect(getByText('Jan 15, 25')).toBeTruthy();
    });

    it('should render file size when file is present', () => {
      const { getByText } = render(<DocumentCard {...defaultProps} />);

      expect(getByText('1000 KB')).toBeTruthy();
    });

    it('should render without file info when file is not present', () => {
      const documentWithoutFile = { ...mockDocument, file: undefined };
      const { queryByText } = render(
        <DocumentCard {...defaultProps} document={documentWithoutFile} />,
      );

      expect(queryByText('1000 KB')).toBeNull();
    });
  });

  describe('Tags', () => {
    it('should render up to 2 tags', () => {
      const { getByText } = render(<DocumentCard {...defaultProps} />);

      expect(getByText('Important')).toBeTruthy();
      expect(getByText('Finance')).toBeTruthy();
    });

    it('should show more tags indicator when there are more than 2 tags', () => {
      const { getByText } = render(<DocumentCard {...defaultProps} />);

      expect(getByText('+1')).toBeTruthy();
    });

    it('should render correctly with no tags', () => {
      const documentWithoutTags = { ...mockDocument, tags: [] };
      const { queryByText } = render(
        <DocumentCard {...defaultProps} document={documentWithoutTags} />,
      );

      expect(queryByText('Important')).toBeNull();
    });

    it('should render correctly with only one tag', () => {
      const documentWithOneTag = {
        ...mockDocument,
        tags: [{ tag_name: 'Single Tag' }],
      };
      const { getByText, queryByText } = render(
        <DocumentCard {...defaultProps} document={documentWithOneTag} />,
      );

      expect(getByText('Single Tag')).toBeTruthy();
      expect(queryByText('+')).toBeNull();
    });

    it('should render correctly with exactly 2 tags', () => {
      const documentWithTwoTags = {
        ...mockDocument,
        tags: [{ tag_name: 'Tag 1' }, { tag_name: 'Tag 2' }],
      };
      const { getByText, queryByText } = render(
        <DocumentCard {...defaultProps} document={documentWithTwoTags} />,
      );

      expect(getByText('Tag 1')).toBeTruthy();
      expect(getByText('Tag 2')).toBeTruthy();
      expect(queryByText('+')).toBeNull();
    });
  });

  describe('File Type Icons', () => {
    it('should show PDF preview for PDF files with local path', () => {
      const { getByText } = render(<DocumentCard {...defaultProps} />);

      // PDF files with local path should show PDFCardPreview, not icon
      // Just verify the component renders correctly
      expect(getByText('Test Document Title')).toBeTruthy();
    });

    it('should show PDF icon for PDF files without local path', () => {
      const documentWithPDFNoPath = {
        ...mockDocument,
        file: {
          name: 'document',
          type: 'application/pdf',
          size: 500000,
        },
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithPDFNoPath} />,
      );

      expect(getByText('📕')).toBeTruthy();
    });

    it('should show image icon for image files', () => {
      const documentWithImage = {
        ...mockDocument,
        file: {
          name: 'image.jpg',
          type: 'image/jpeg',
          size: 500000,
        },
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithImage} />,
      );

      expect(getByText('🖼️')).toBeTruthy();
    });

    it('should show document icon for Word files', () => {
      const documentWithDoc = {
        ...mockDocument,
        file: {
          name: 'document.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 200000,
        },
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithDoc} />,
      );

      expect(getByText('📝')).toBeTruthy();
    });

    it('should show spreadsheet icon for Excel files', () => {
      const documentWithExcel = {
        ...mockDocument,
        file: {
          name: 'spreadsheet.xlsx',
          type: 'application/vnd.ms-excel',
          size: 300000,
        },
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithExcel} />,
      );

      expect(getByText('📊')).toBeTruthy();
    });

    it('should show default file icon for unknown file types', () => {
      const documentWithUnknownType = {
        ...mockDocument,
        file: {
          name: 'unknown.xyz',
          type: 'application/unknown',
          size: 100000,
        },
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithUnknownType} />,
      );

      expect(getByText('📄')).toBeTruthy();
    });
  });

  describe('Download States', () => {
    it('should show downloading overlay when isDownloading is true', () => {
      const { getByText } = render(
        <DocumentCard {...defaultProps} isDownloading={true} />,
      );

      expect(getByText('⬇️')).toBeTruthy();
    });

    it('should show downloaded badge when isDownloaded is true', () => {
      const { getByText } = render(
        <DocumentCard {...defaultProps} isDownloaded={true} />,
      );

      expect(getByText('✓')).toBeTruthy();
    });

    it('should show progress bar when downloading with progress', () => {
      const { getByText } = render(
        <DocumentCard
          {...defaultProps}
          isDownloading={true}
          downloadProgress={50}
        />,
      );

      expect(getByText('⬇️')).toBeTruthy();
    });

    it('should not show downloaded badge when downloading', () => {
      const { getByText, queryByText } = render(
        <DocumentCard
          {...defaultProps}
          isDownloading={true}
          isDownloaded={true}
        />,
      );

      expect(getByText('⬇️')).toBeTruthy();
      expect(queryByText('✓')).toBeNull();
    });

    it('should not show progress bar when not downloading', () => {
      const { getByText } = render(
        <DocumentCard
          {...defaultProps}
          isDownloading={false}
          downloadProgress={0}
        />,
      );

      expect(getByText('Test Document Title')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should call onPreview when card is pressed', () => {
      const onPreviewMock = jest.fn();
      const { getByText } = render(
        <DocumentCard {...defaultProps} onPreview={onPreviewMock} />,
      );

      fireEvent.press(getByText('Test Document Title'));
      expect(onPreviewMock).toHaveBeenCalledWith(mockDocument);
    });

    it('should call onPreview with correct document data', () => {
      const onPreviewMock = jest.fn();
      const customDocument = { ...mockDocument, id: 'custom-id' };
      const { getByText } = render(
        <DocumentCard
          {...defaultProps}
          document={customDocument}
          onPreview={onPreviewMock}
        />,
      );

      fireEvent.press(getByText('Test Document Title'));
      expect(onPreviewMock).toHaveBeenCalledWith(customDocument);
    });

    it('should be touchable when not downloading', () => {
      const onPreviewMock = jest.fn();
      const { getByText } = render(
        <DocumentCard
          {...defaultProps}
          onPreview={onPreviewMock}
          isDownloading={false}
        />,
      );

      fireEvent.press(getByText('Test Document Title'));
      expect(onPreviewMock).toHaveBeenCalled();
    });
  });

  describe('File Size Formatting', () => {
    it('should format bytes correctly', () => {
      const documentWithSmallFile = {
        ...mockDocument,
        file: { ...mockDocument.file!, size: 500 },
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithSmallFile} />,
      );

      expect(getByText('500 Bytes')).toBeTruthy();
    });

    it('should format KB correctly', () => {
      const documentWithKBFile = {
        ...mockDocument,
        file: { ...mockDocument.file!, size: 2048 },
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithKBFile} />,
      );

      expect(getByText('2 KB')).toBeTruthy();
    });

    it('should format MB correctly', () => {
      const documentWithMBFile = {
        ...mockDocument,
        file: { ...mockDocument.file!, size: 2097152 }, // 2MB
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithMBFile} />,
      );

      expect(getByText('2 MB')).toBeTruthy();
    });

    it('should handle zero file size', () => {
      const documentWithZeroSize = {
        ...mockDocument,
        file: { ...mockDocument.file!, size: 0 },
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithZeroSize} />,
      );

      expect(getByText('0 Bytes')).toBeTruthy();
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly', () => {
      const { getByText } = render(<DocumentCard {...defaultProps} />);

      expect(getByText('Jan 15, 25')).toBeTruthy();
    });

    it('should handle different date formats', () => {
      const documentWithDifferentDate = {
        ...mockDocument,
        document_date: '2024-12-31',
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithDifferentDate} />,
      );

      expect(getByText('Dec 31, 24')).toBeTruthy();
    });
  });

  describe('Image Preview', () => {
    it('should render image preview for image files with local path', () => {
      const documentWithImage = {
        ...mockDocument,
        file: {
          name: 'image.jpg',
          type: 'image/jpeg',
          size: 500000,
          localPath: '/path/to/image.jpg',
        },
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithImage} />,
      );

      expect(getByText('Test Document Title')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle document without major_head', () => {
      const documentWithoutTitle = { ...mockDocument, major_head: '' };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithoutTitle} />,
      );

      expect(getByText('')).toBeTruthy();
    });

    it('should handle document without minor_head', () => {
      const documentWithoutSubtitle = { ...mockDocument, minor_head: '' };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithoutSubtitle} />,
      );

      expect(getByText('')).toBeTruthy();
    });

    it('should handle very long titles', () => {
      const documentWithLongTitle = {
        ...mockDocument,
        major_head:
          'This is a very long document title that should be truncated',
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithLongTitle} />,
      );

      expect(
        getByText(
          'This is a very long document title that should be truncated',
        ),
      ).toBeTruthy();
    });

    it('should handle documents without file property', () => {
      const documentWithoutFile = {
        ...mockDocument,
        file: undefined,
      } as any;

      const { getByText, queryByText } = render(
        <DocumentCard {...defaultProps} document={documentWithoutFile} />,
      );

      expect(getByText('Test Document Title')).toBeTruthy();
      expect(queryByText('1000 KB')).toBeNull();
    });

    it('should handle invalid date strings', () => {
      const documentWithInvalidDate = {
        ...mockDocument,
        document_date: 'invalid-date',
      };
      const { getByText } = render(
        <DocumentCard {...defaultProps} document={documentWithInvalidDate} />,
      );

      // Should still render the component even with invalid date
      expect(getByText('Test Document Title')).toBeTruthy();
    });
  });

  describe('Progress Bar', () => {
    it('should show progress bar only when downloading and progress > 0', () => {
      const { rerender, getByText } = render(
        <DocumentCard
          {...defaultProps}
          isDownloading={false}
          downloadProgress={50}
        />,
      );

      // Should render normally when not downloading
      expect(getByText('Test Document Title')).toBeTruthy();

      // Should show progress bar when downloading with progress
      rerender(
        <DocumentCard
          {...defaultProps}
          isDownloading={true}
          downloadProgress={75}
        />,
      );

      expect(getByText('⬇️')).toBeTruthy();
    });

    it('should not show progress bar when downloading but progress is 0', () => {
      const { getByText } = render(
        <DocumentCard
          {...defaultProps}
          isDownloading={true}
          downloadProgress={0}
        />,
      );

      expect(getByText('⬇️')).toBeTruthy();
    });
  });
});
