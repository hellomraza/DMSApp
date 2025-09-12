import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

interface DocumentPreviewModalProps {
  visible: boolean;
  document: SearchResult | null;
  onClose: () => void;
  onDownload: (document: SearchResult) => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  visible,
  document,
  onClose,
  onDownload,
}) => {
  if (!document?.file) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.previewModalOverlay}>
        <View style={styles.previewModalContent}>
          <View style={styles.previewModalHeader}>
            <Text style={styles.previewModalTitle}>
              {document.file.name || 'Document Preview'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewContent}>
            {document.file.type.startsWith('image/') ? (
              <View style={styles.imagePreviewContainer}>
                {document.file.localPath ? (
                  <Image
                    source={{
                      uri: `file://${document.file.localPath}`,
                    }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.previewPlaceholder}>
                    <Text style={styles.previewPlaceholderText}>
                      🖼️ Image Preview
                    </Text>
                    <Text style={styles.previewPlaceholderSubtext}>
                      Download the file to view the full image
                    </Text>
                  </View>
                )}
              </View>
            ) : document.file.type === 'application/pdf' ? (
              <View style={styles.pdfPreviewContainer}>
                <Text style={styles.previewPlaceholderText}>
                  📄 PDF Document
                </Text>
                <Text style={styles.previewPlaceholderSubtext}>
                  Download to view the PDF document
                </Text>
                <TouchableOpacity
                  style={styles.downloadPreviewButton}
                  onPress={() => {
                    onClose();
                    onDownload(document);
                  }}
                >
                  <Text style={styles.downloadPreviewButtonText}>
                    Download PDF
                  </Text>
                </TouchableOpacity>
              </View>
            ) : document.file.type.startsWith('text/') ? (
              <View style={styles.textPreviewContainer}>
                <Text style={styles.previewPlaceholderText}>
                  📝 Text Document
                </Text>
                <Text style={styles.previewPlaceholderSubtext}>
                  Download to view the full content
                </Text>
              </View>
            ) : (
              <View style={styles.previewPlaceholder}>
                <Text style={styles.previewPlaceholderText}>
                  ❓ Unsupported Format
                </Text>
                <Text style={styles.previewPlaceholderSubtext}>
                  Preview not available for this file type
                </Text>
              </View>
            )}

            <View style={styles.previewActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.downloadButton]}
                onPress={() => {
                  onClose();
                  onDownload(document);
                }}
              >
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModalContent: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    width: '95%',
    maxHeight: '90%',
  },
  previewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  previewModalTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  modalCloseButton: {
    padding: spacing.sm,
  },
  modalCloseText: {
    fontSize: fontSize.lg,
    color: '#7f8c8d',
  },
  previewContent: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  imagePreviewContainer: {
    width: '100%',
    height: scale(400),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: scale(8),
    marginBottom: spacing.md,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(8),
  },
  pdfPreviewContainer: {
    width: '100%',
    height: scale(300),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: scale(8),
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  textPreviewContainer: {
    width: '100%',
    height: scale(200),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: scale(8),
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  previewPlaceholder: {
    width: '100%',
    height: scale(200),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: scale(8),
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  previewPlaceholderText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  previewPlaceholderSubtext: {
    fontSize: fontSize.base,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: scale(20),
  },
  downloadPreviewButton: {
    backgroundColor: '#3498db',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: scale(6),
    marginTop: spacing.md,
  },
  downloadPreviewButtonText: {
    fontSize: fontSize.base,
    color: '#fff',
    fontWeight: '600',
  },
  previewActions: {
    width: '100%',
    marginTop: spacing.md,
  },
  actionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: scale(6),
    alignItems: 'center',
    borderWidth: 1,
  },
  downloadButton: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  downloadButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#fff',
  },
});

export default DocumentPreviewModal;
