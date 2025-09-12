import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import RNFS from 'react-native-fs';

import { apiSwitcher } from '../../services/apiSwitcher';
import { spacing } from '../../utils/scale';
import DocumentList from './DocumentList';
import DocumentPreviewModal from './DocumentPreviewModal';
import SearchFilters from './SearchFilters';
import SearchHeader from './SearchHeader';

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

interface FileSearchComponentProps {
  onSearchResults?: (results: SearchResult[]) => void;
  refreshTrigger?: number;
}

const FileSearchComponent: React.FC<FileSearchComponentProps> = ({
  onSearchResults,
  refreshTrigger,
}) => {
  // Search filters state
  const [majorHead, setMajorHead] = useState<'Personal' | 'Professional' | ''>(
    '',
  );
  const [minorHead, setMinorHead] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  // Date picker state
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  // Search results state
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Preview and download state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<SearchResult | null>(
    null,
  );
  const [isDownloading, setIsDownloading] = useState<{
    [key: string]: boolean;
  }>({});
  const [downloadProgress, setDownloadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  // New state for showing all docs and filter controls
  const [showFilters, setShowFilters] = useState(false);
  const [allDocuments, setAllDocuments] = useState<SearchResult[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  // Load available tags and all documents on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      await loadAvailableTags();
      await loadAllDocuments();
    };
    loadInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle refresh trigger from parent component
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      const refreshData = async () => {
        console.log('Refreshing data triggered by pull-to-refresh...');
        await loadAvailableTags();
        await loadAllDocuments();
      };
      refreshData();
    }
  }, [refreshTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter documents when search text changes
  useEffect(() => {
    console.log('Filtering documents with current filters...', allDocuments);
    let filtered = [...allDocuments];

    // Text search filter
    if (searchText.trim()) {
      const searchTerm = searchText.toLowerCase();
      filtered = filtered.filter(
        doc =>
          doc.file?.name.toLowerCase().includes(searchTerm) ||
          doc.document_remarks.toLowerCase().includes(searchTerm) ||
          doc.major_head.toLowerCase().includes(searchTerm) ||
          doc.minor_head.toLowerCase().includes(searchTerm),
      );
    }

    // Category filters
    if (majorHead) {
      filtered = filtered.filter(doc => doc.major_head === majorHead);
    }

    if (minorHead) {
      filtered = filtered.filter(doc => doc.minor_head === minorHead);
    }

    // Tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        doc =>
          doc.tags &&
          doc.tags.some(tag =>
            selectedTags.some(
              selectedTag => selectedTag.tag_name === tag.tag_name,
            ),
          ),
      );
    }

    // Date range filters
    if (fromDate) {
      const fromDateStr = fromDate.toISOString().split('T')[0];
      filtered = filtered.filter(doc => doc.document_date >= fromDateStr);
    }

    if (toDate) {
      const toDateStr = toDate.toISOString().split('T')[0];
      filtered = filtered.filter(doc => doc.document_date <= toDateStr);
    }

    setSearchResults(filtered);

    if (onSearchResults) {
      onSearchResults(filtered);
    }
  }, [
    searchText,
    majorHead,
    minorHead,
    selectedTags,
    fromDate,
    toDate,
    allDocuments,
    onSearchResults,
  ]);

  const loadAvailableTags = useCallback(async () => {
    try {
      const response = await apiSwitcher.getDocumentTags({ term: '' });
      console.log('Loaded tags:', response.data);
      if (response.data && Array.isArray(response.data?.data)) {
        setAvailableTags(response.data?.data);
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  }, []);

  // Load all documents on initial load
  const loadAllDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    try {
      // Search with empty filters to get all documents
      const response = await apiSwitcher.searchDocuments({});

      if (response.data && response.data.data) {
        const documents = response.data.data?.data as SearchResult[];
        console.log('Loaded documents:', documents);
        setAllDocuments(documents);
        setSearchResults(documents);

        if (onSearchResults) {
          onSearchResults(documents);
        }

        console.log(`Loaded ${documents.length} documents`);
      } else {
        setAllDocuments([]);
        setSearchResults([]);
        console.log('No documents found');
      }
    } catch (error: any) {
      console.error('Failed to load documents:', error);
      setAllDocuments([]);
      setSearchResults([]);
    } finally {
      setIsLoadingDocs(false);
    }
  }, [onSearchResults]);

  // Helper functions
  const hasFilters = (): boolean => {
    return Boolean(
      searchText ||
        majorHead ||
        minorHead ||
        selectedTags.length > 0 ||
        fromDate ||
        toDate,
    );
  };

  // Handle category selection
  const handleMajorHeadChange = (value: string) => {
    setMajorHead(value as 'Personal' | 'Professional' | '');
    setMinorHead(''); // Reset minor head when major head changes
  };

  // Handle tag selection from filter section (doesn't close modal)
  const handleFilterTagSelection = (tag: Tag) => {
    const isAlreadySelected = selectedTags.some(
      selectedTag => selectedTag.tag_name === tag.tag_name,
    );

    if (!isAlreadySelected) {
      setSelectedTags(prev => [...(prev || []), tag]);
    }
  };

  // Remove selected tag
  const removeTag = (tagToRemove: Tag) => {
    setSelectedTags(
      selectedTags.filter(tag => tag.tag_name !== tagToRemove.tag_name),
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setMajorHead('');
    setMinorHead('');
    setSearchText('');
    setSelectedTags([]);
    setFromDate(null);
    setToDate(null);
    // Reset to show all documents
    setSearchResults(allDocuments);
  };

  const clearDateRange = () => {
    setFromDate(null);
    setToDate(null);
  };

  // Check if file type is previewable
  const isPreviewable = (fileType: string): boolean => {
    const previewableTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'application/pdf',
      'text/plain',
      'text/html',
    ];
    return previewableTypes.includes(fileType.toLowerCase());
  };

  // Handle document preview
  const handlePreview = async (document: SearchResult) => {
    if (!document.file) {
      Alert.alert('Preview Error', 'No file attached to this document.');
      return;
    }

    if (!isPreviewable(document.file.type)) {
      Alert.alert(
        'Preview Not Available',
        `Preview is not supported for ${document.file.type} files. You can download the file to view it.`,
      );
      return;
    }

    setPreviewDocument(document);
    setShowPreviewModal(true);
  };

  // Handle individual file download
  const handleDownload = async (document: SearchResult) => {
    if (!document.file) {
      Alert.alert('Download Error', 'No file attached to this document.');
      return;
    }

    try {
      setIsDownloading(prev => ({ ...prev, [document.id]: true }));
      setDownloadProgress(prev => ({ ...prev, [document.id]: 0 }));

      // Download using API service
      const localPath = await apiSwitcher.downloadDocument(
        document.id,
        document.file.name,
      );

      Alert.alert('Download Complete', `File saved to: ${localPath}`, [
        {
          text: 'Open',
          onPress: () => Linking.openURL(`file://${localPath}`),
        },
        { text: 'OK' },
      ]);
    } catch (error: any) {
      console.error('Download failed:', error);
      Alert.alert(
        'Download Failed',
        error.message || 'Failed to download file. Please try again.',
      );
    } finally {
      setIsDownloading(prev => ({ ...prev, [document.id]: false }));
      setDownloadProgress(prev => ({ ...prev, [document.id]: 0 }));
    }
  };

  // Handle download all as ZIP
  const handleDownloadAll = async () => {
    if (searchResults.length === 0) {
      Alert.alert('Download Error', 'No documents to download.');
      return;
    }

    Alert.alert(
      'Download All Files',
      `This will download ${searchResults.length} documents. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: async () => {
            try {
              setIsDownloadingAll(true);

              let successCount = 0;
              const downloadedPaths: string[] = [];

              // Download all files
              for (let i = 0; i < searchResults.length; i++) {
                const document = searchResults[i];
                if (document.file) {
                  try {
                    const localPath = await apiSwitcher.downloadDocument(
                      document.id,
                      document.file.name,
                    );
                    downloadedPaths.push(localPath);
                    successCount++;
                  } catch (error) {
                    console.warn(
                      `Failed to download ${document.file.name}:`,
                      error,
                    );
                  }
                }
              }

              Alert.alert(
                'Download Complete',
                `Successfully downloaded ${successCount} out of ${searchResults.length} files.`,
                [
                  {
                    text: 'Open Downloads Folder',
                    onPress: () =>
                      Linking.openURL(
                        `file://${RNFS.DocumentDirectoryPath}/Downloads`,
                      ),
                  },
                  { text: 'OK' },
                ],
              );
            } catch (error: any) {
              console.error('Bulk download failed:', error);
              Alert.alert(
                'Download Failed',
                error.message || 'Failed to download files. Please try again.',
              );
            } finally {
              setIsDownloadingAll(false);
            }
          },
        },
      ],
    );
  };

  return (
    <>
      <View style={styles.scrollView}>
        <SearchHeader
          searchText={searchText}
          onSearchTextChange={setSearchText}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          resultsCount={searchResults.length}
        />

        {showFilters && (
          <SearchFilters
            majorHead={majorHead}
            minorHead={minorHead}
            fromDate={fromDate}
            toDate={toDate}
            selectedTags={selectedTags}
            availableTags={availableTags}
            showFromDatePicker={showFromDatePicker}
            showToDatePicker={showToDatePicker}
            onMajorHeadChange={handleMajorHeadChange}
            onMinorHeadChange={setMinorHead}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onShowFromDatePicker={setShowFromDatePicker}
            onShowToDatePicker={setShowToDatePicker}
            onClearDateRange={clearDateRange}
            onTagSelect={handleFilterTagSelection}
            onTagRemove={removeTag}
            onClearFilters={clearFilters}
          />
        )}

        <DocumentList
          documents={searchResults}
          isLoading={isLoadingDocs}
          isDownloading={isDownloading}
          downloadProgress={downloadProgress}
          isDownloadingAll={isDownloadingAll}
          hasFilters={hasFilters()}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onDownloadAll={handleDownloadAll}
          isPreviewable={isPreviewable}
        />
      </View>

      <DocumentPreviewModal
        visible={showPreviewModal}
        document={previewDocument}
        onClose={() => setShowPreviewModal(false)}
        onDownload={handleDownload}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: spacing.md,
  },
});

export default FileSearchComponent;
