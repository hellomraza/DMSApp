import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { fontSize, scale, spacing } from '../../utils/scale';

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
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isDownloading,
  downloadProgress,
  onPreview,
  onDownload,
  isPreviewable,
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
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>
          {document.major_head} - {document.minor_head}
        </Text>
        <Text style={styles.resultDate}>
          {formatDate(document.document_date)}
        </Text>
      </View>

      {document.file && (
        <View style={styles.fileInfo}>
          <View style={styles.fileDetails}>
            <Text style={styles.fileName}>📄 {document.file.name}</Text>
            <Text style={styles.fileSize}>
              {document.file.type} • {formatFileSize(document.file.size)}
            </Text>
          </View>

          {/* Preview and Download Actions */}
          <View style={styles.fileActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.previewButton,
                !isPreviewable(document.file.type) && styles.disabledButton,
              ]}
              onPress={() => onPreview(document)}
              disabled={!isPreviewable(document.file.type)}
            >
              <Text
                style={[
                  styles.previewButtonText,
                  !isPreviewable(document.file.type) &&
                    styles.disabledButtonText,
                ]}
              >
                👁️ Preview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.downloadButton]}
              onPress={() => onDownload(document)}
              disabled={isDownloading}
            >
              <Text style={styles.actionButtonText}>
                {isDownloading ? '⬇️ Downloading...' : 'Download'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Download Progress */}
          {isDownloading && downloadProgress > 0 && (
            <View style={styles.progressContainer}>
              <View
                style={[styles.progressBar, { width: `${downloadProgress}%` }]}
              />
              <Text style={styles.progressText}>{downloadProgress}%</Text>
            </View>
          )}
        </View>
      )}

      {document.document_remarks && (
        <Text style={styles.resultRemarks}>{document.document_remarks}</Text>
      )}

      {document.tags && document.tags.length > 0 && (
        <View style={styles.resultTags}>
          {document.tags.map((tag, index) => (
            <View key={index} style={styles.resultTag}>
              <Text style={styles.resultTagText}>{tag.tag_name}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.uploadInfo}>
        Uploaded: {formatDate(document.uploadedAt)} by {document.uploadedBy}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: scale(8),
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  resultTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  resultDate: {
    fontSize: fontSize.sm,
    color: '#7f8c8d',
  },
  fileInfo: {
    backgroundColor: '#f8f9fa',
    padding: spacing.sm,
    borderRadius: scale(4),
    marginBottom: spacing.sm,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#2c3e50',
  },
  fileSize: {
    fontSize: fontSize.sm,
    color: '#7f8c8d',
    marginTop: spacing.xs,
  },
  fileActions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: scale(6),
    alignItems: 'center',
    borderWidth: 1,
  },
  previewButton: {
    backgroundColor: '#f8f9fa',
    borderColor: '#3498db',
  },
  downloadButton: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  disabledButton: {
    backgroundColor: '#ecf0f1',
    borderColor: '#bdc3c7',
  },
  previewButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#3498db',
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#95a5a6',
  },
  progressContainer: {
    marginTop: spacing.sm,
    backgroundColor: '#ecf0f1',
    borderRadius: scale(10),
    height: scale(20),
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: scale(10),
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    fontSize: fontSize.xs,
    color: '#2c3e50',
    lineHeight: scale(20),
  },
  resultRemarks: {
    fontSize: fontSize.base,
    color: '#2c3e50',
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  resultTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  resultTag: {
    backgroundColor: '#e8f5e8',
    borderRadius: scale(12),
    paddingHorizontal: spacing.sm,
    paddingVertical: scale(2),
  },
  resultTagText: {
    fontSize: fontSize.xs,
    color: '#27ae60',
    fontWeight: '500',
  },
  uploadInfo: {
    fontSize: fontSize.xs,
    color: '#95a5a6',
    marginTop: spacing.sm,
  },
});

export default DocumentCard;
