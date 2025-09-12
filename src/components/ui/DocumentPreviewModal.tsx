import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { fontSize, scale, spacing } from '../../utils/scale';
import PDFViewer from './PDFViewer';

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
  onOpenPDFFullscreen?: (source: any, title: string) => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  visible,
  document,
  onClose,
  onDownload,
  onOpenPDFFullscreen,
}) => {
  if (!document) return null;

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
            <Text style={styles.previewModalTitle}>Document Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* File Preview Section */}
            {document.file && (
              <View style={styles.previewSection}>
                <Text style={styles.sectionTitle}>File Preview</Text>
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
                    {document.file.localPath ? (
                      <>
                        <PDFViewer
                          source={{ uri: `file://${document.file.localPath}` }}
                          style={styles.pdfViewer}
                        />
                        {onOpenPDFFullscreen && (
                          <TouchableOpacity
                            style={styles.fullscreenButton}
                            onPress={() =>
                              onOpenPDFFullscreen(
                                { uri: `file://${document.file?.localPath}` },
                                document.file?.name || 'PDF Document',
                              )
                            }
                          >
                            <Text style={styles.fullscreenButtonText}>
                              📱 View Fullscreen
                            </Text>
                          </TouchableOpacity>
                        )}
                      </>
                    ) : document.file.name &&
                      (document.file.name.startsWith('http') ||
                        document.file.name.includes('.pdf')) ? (
                      <>
                        <PDFViewer
                          source={{
                            uri: document.file.name.startsWith('http')
                              ? document.file.name
                              : `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`, // Fallback test PDF
                          }}
                          style={styles.pdfViewer}
                        />
                        {onOpenPDFFullscreen && (
                          <TouchableOpacity
                            style={styles.fullscreenButton}
                            onPress={() =>
                              onOpenPDFFullscreen(
                                {
                                  uri: document.file?.name?.startsWith('http')
                                    ? document.file.name
                                    : `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`,
                                },
                                document.file?.name || 'PDF Document',
                              )
                            }
                          >
                            <Text style={styles.fullscreenButtonText}>
                              📱 View Fullscreen
                            </Text>
                          </TouchableOpacity>
                        )}
                      </>
                    ) : (
                      <View style={styles.previewPlaceholder}>
                        <Text style={styles.previewPlaceholderText}>
                          📄 PDF Document
                        </Text>
                        <Text style={styles.previewPlaceholderSubtext}>
                          {document.file.name}
                        </Text>
                        <Text style={styles.previewPlaceholderSubtext}>
                          Download the file to view the PDF
                        </Text>
                      </View>
                    )}
                  </View>
                ) : document.file.type.startsWith('text/') ? (
                  <View style={styles.textPreviewContainer}>
                    <Text style={styles.previewPlaceholderText}>
                      📝 Text Document
                    </Text>
                    <Text style={styles.previewPlaceholderSubtext}>
                      {document.file.name}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.previewPlaceholder}>
                    <Text style={styles.previewPlaceholderText}>
                      📄 {document.file.name}
                    </Text>
                    <Text style={styles.previewPlaceholderSubtext}>
                      Preview not available for this file type
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Document Information Section */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Document Information</Text>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Major Head:</Text>
                  <Text style={styles.infoValue}>{document.major_head}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Minor Head:</Text>
                  <Text style={styles.infoValue}>{document.minor_head}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Document Date:</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(document.document_date)}
                  </Text>
                </View>

                {document.document_remarks && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Remarks:</Text>
                    <Text style={styles.infoValue}>
                      {document.document_remarks}
                    </Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Uploaded:</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(document.uploadedAt)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Uploaded By:</Text>
                  <Text style={styles.infoValue}>{document.uploadedBy}</Text>
                </View>
              </View>
            </View>

            {/* File Information Section */}
            {document.file && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>File Information</Text>

                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>File Name:</Text>
                    <Text style={styles.infoValue}>{document.file.name}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>File Type:</Text>
                    <Text style={styles.infoValue}>{document.file.type}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>File Size:</Text>
                    <Text style={styles.infoValue}>
                      {formatFileSize(document.file.size)}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Tags Section */}
            {document.tags && document.tags.length > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {document.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag.tag_name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Download Button */}
            <View style={styles.downloadSection}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => {
                  onDownload(document);
                  onClose();
                }}
              >
                <Text style={styles.downloadButtonText}>
                  📥 Download Document
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  scrollContainer: {
    maxHeight: '100%',
  },
  previewSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: spacing.md,
  },
  imagePreviewContainer: {
    width: '100%',
    height: scale(200),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: scale(8),
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(8),
  },
  pdfPreviewContainer: {
    width: '100%',
    height: scale(300),
    backgroundColor: '#f8f9fa',
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  pdfViewer: {
    width: '100%',
    height: '100%',
  },
  textPreviewContainer: {
    width: '100%',
    height: scale(120),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: scale(8),
    padding: spacing.lg,
  },
  previewPlaceholder: {
    width: '100%',
    height: scale(120),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: scale(8),
    padding: spacing.lg,
  },
  previewPlaceholderText: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  previewPlaceholderSubtext: {
    fontSize: fontSize.sm,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: scale(18),
  },
  infoSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: scale(8),
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#7f8c8d',
    flex: 0.4,
  },
  infoValue: {
    fontSize: fontSize.sm,
    color: '#2c3e50',
    flex: 0.6,
    textAlign: 'right',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: '#e8f5e8',
    borderRadius: scale(12),
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: fontSize.sm,
    color: '#27ae60',
    fontWeight: '500',
  },
  downloadSection: {
    padding: spacing.lg,
  },
  downloadButton: {
    backgroundColor: '#3498db',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: scale(8),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadButtonText: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: '#fff',
  },
  fullscreenButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: scale(6),
  },
  fullscreenButtonText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});

export default DocumentPreviewModal;
