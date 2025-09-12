import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { fontSize, scale, spacing } from '../../utils/scale';
import DocumentCard from './DocumentCard';
import DocumentListSkeleton from './DocumentListSkeleton';

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

interface DocumentListProps {
  documents: SearchResult[];
  isLoading: boolean;
  isDownloading: { [key: string]: boolean };
  downloadProgress: { [key: string]: number };
  isDownloadingAll: boolean;
  hasFilters: boolean;
  onPreview: (document: SearchResult) => void;
  onDownload: (document: SearchResult) => void;
  onDownloadAll: () => void;
  isPreviewable: (fileType: string) => boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  isDownloading,
  downloadProgress,
  isDownloadingAll,
  hasFilters,
  onPreview,
  onDownload,
  onDownloadAll,
  isPreviewable,
}) => {
  if (isLoading) {
    return <DocumentListSkeleton />;
  }

  return (
    <View style={styles.documentsSection}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {hasFilters
            ? `Filtered Results (${documents.length})`
            : `All Documents (${documents.length})`}
        </Text>

        {/* Download All Button */}
        {documents.length > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.downloadAllButton]}
            onPress={onDownloadAll}
            disabled={isDownloadingAll}
          >
            <Text style={styles.downloadAllButtonText}>
              {isDownloadingAll ? '⬇️ Downloading All...' : 'Download All'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {documents.length > 0 ? (
        <FlatList
          data={documents}
          renderItem={({ item }) => (
            <DocumentCard
              document={item}
              isDownloading={isDownloading[item.id] || false}
              downloadProgress={downloadProgress[item.id] || 0}
              onPreview={onPreview}
              onDownload={onDownload}
              isPreviewable={isPreviewable}
            />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>
            {hasFilters
              ? 'No documents found matching your criteria.'
              : 'No documents available.'}
          </Text>
          <Text style={styles.noResultsSubtext}>
            {hasFilters
              ? 'Try adjusting your search terms or filters.'
              : 'Upload some documents to get started.'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  documentsSection: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultsTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  button: {
    padding: spacing.md,
    borderRadius: scale(8),
    alignItems: 'center',
  },
  downloadAllButton: {
    backgroundColor: '#27ae60',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: scale(6),
    marginLeft: spacing.md,
  },
  downloadAllButtonText: {
    fontSize: fontSize.sm,
    color: '#fff',
    fontWeight: '600',
  },
  noResults: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  noResultsText: {
    fontSize: fontSize.base,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  noResultsSubtext: {
    fontSize: fontSize.sm,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

export default DocumentList;
