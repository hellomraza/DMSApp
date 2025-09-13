import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { fontSize, scale, spacing } from '../../utils/scale';
import PDFCardPreview from './PDFCardPreview';

interface Tag {
  tag_name: string;
}

interface SearchResult {
  id: string;
  major_head: string;
  minor_head: string;
  document_date: string;
  document_remarks: string;
  tags: Tag[];
  file?: {
    name: string;
    type: string;
    size: number;
    localPath?: string;
  };
  uploadedAt: string;
  uploadedBy: string;
}

interface DocumentCardProps {
  document: SearchResult;
  isDownloading: boolean;
  downloadProgress: number;
  onPreview: (document: SearchResult) => void;
  onDownload: (document: SearchResult) => void;
  isPreviewable: (fileType: string) => boolean;
  isDownloaded?: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.md * 3) / 2; // 2 columns with spacing

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isDownloading,
  downloadProgress,
  onPreview,
  isDownloaded = false,
}) => {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    });
  };

  // Get file type icon or show image/PDF preview
  const getFilePreview = () => {
    if (document.file?.type.startsWith('image/') && document.file.localPath) {
      return (
        <Image
          source={{ uri: `file://${document.file.localPath}` }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      );
    }

    // PDF preview
    if (document.file?.type === 'application/pdf') {
      // If we have a local path, show PDF preview
      if (document.file.localPath) {
        return (
          <View style={styles.pdfPreviewContainer}>
            <PDFCardPreview
              source={{ uri: `file://${document.file.localPath}` }}
              style={styles.pdfPreview}
            />
          </View>
        );
      }
      // If we have a URL, show PDF preview
      else if (
        document.file.name &&
        (document.file.name.startsWith('http') ||
          document.file.name.includes('.pdf'))
      ) {
        return (
          <View style={styles.pdfPreviewContainer}>
            <PDFCardPreview
              source={{
                uri: document.file.name.startsWith('http')
                  ? document.file.name
                  : `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`,
              }}
              style={styles.pdfPreview}
            />
          </View>
        );
      }
    }

    // Default file type icons
    const fileType = document.file?.type || '';
    let icon = '📄';
    if (fileType.includes('pdf')) icon = '📕';
    else if (fileType.includes('image')) icon = '🖼️';
    else if (fileType.includes('doc')) icon = '📝';
    else if (fileType.includes('excel') || fileType.includes('sheet'))
      icon = '📊';

    return (
      <View style={styles.fileIcon}>
        <Text style={styles.fileIconText}>{icon}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPreview(document)}
      activeOpacity={0.8}
    >
      {/* Image/File Preview */}
      <View style={styles.previewContainer}>
        {getFilePreview()}
        {isDownloading && (
          <View style={styles.downloadingOverlay}>
            <Text style={styles.downloadingText}>⬇️</Text>
          </View>
        )}
        {isDownloaded && !isDownloading && (
          <View style={styles.downloadedBadge}>
            <Text style={styles.downloadedText}>✓</Text>
          </View>
        )}
      </View>

      {/* Document Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {document.major_head}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {document.minor_head}
        </Text>
        <Text style={styles.date}>{formatDate(document.document_date)}</Text>

        {/* File info */}
        {document.file && (
          <Text style={styles.fileInfo} numberOfLines={1}>
            {formatFileSize(document.file.size)}
          </Text>
        )}

        {/* Tags - show max 2 */}
        {document.tags && document.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {document.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText} numberOfLines={1}>
                  {tag.tag_name}
                </Text>
              </View>
            ))}
            {document.tags.length > 2 && (
              <Text style={styles.moreTagsText}>
                +{document.tags.length - 2}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Download progress bar */}
      {isDownloading && downloadProgress > 0 && (
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBar, { width: `${downloadProgress}%` }]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: spacing.sm,
    marginBottom: spacing.md,
    marginHorizontal: spacing.xs,
    width: cardWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewContainer: {
    width: '100%',
    height: scale(100),
    borderRadius: scale(8),
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: scale(8),
  },
  pdfPreviewContainer: {
    width: '100%',
    height: '100%',
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  pdfPreview: {
    width: '100%',
    height: '100%',
  },
  fileIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIconText: {
    fontSize: fontSize.xxl,
  },
  downloadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(8),
  },
  downloadingText: {
    fontSize: fontSize.lg,
    color: '#fff',
  },
  downloadedBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: '#27ae60',
    borderRadius: scale(10),
    width: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadedText: {
    fontSize: fontSize.xs,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: spacing.xs / 2,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: '#7f8c8d',
    marginBottom: spacing.xs / 2,
  },
  date: {
    fontSize: fontSize.xs,
    color: '#95a5a6',
    marginBottom: spacing.xs,
  },
  fileInfo: {
    fontSize: fontSize.xs,
    color: '#7f8c8d',
    marginBottom: spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.xs / 2,
  },
  tag: {
    backgroundColor: '#e8f5e8',
    borderRadius: scale(10),
    paddingHorizontal: spacing.xs,
    paddingVertical: scale(2),
    marginRight: spacing.xs / 2,
    marginBottom: spacing.xs / 2,
  },
  tagText: {
    fontSize: fontSize.xs - 1,
    color: '#27ae60',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: fontSize.xs,
    color: '#95a5a6',
    fontWeight: '500',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(3),
    backgroundColor: '#ecf0f1',
    borderBottomLeftRadius: scale(12),
    borderBottomRightRadius: scale(12),
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498db',
    borderBottomLeftRadius: scale(12),
  },
});

export default DocumentCard;
