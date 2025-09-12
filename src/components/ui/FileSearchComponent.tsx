import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import RNFS from 'react-native-fs';

import { apiSwitcher } from '../../services/apiSwitcher';
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

interface FileSearchComponentProps {
  onSearchResults?: (results: SearchResult[]) => void;
}

const FileSearchComponent: React.FC<FileSearchComponentProps> = ({
  onSearchResults,
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

  // Tag selection state
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTagText, setNewTagText] = useState('');

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

  // Dropdown options
  const personalOptions = [
    'John',
    'Tom',
    'Emily',
    'Sarah',
    'Michael',
    'Jessica',
    'David',
    'Lisa',
  ];

  const professionalOptions = [
    'Engineering',
    'Marketing',
    'Sales',
    'Finance',
    'Human Resources',
    'Operations',
    'Legal',
    'IT Support',
  ];

  // Load available tags and all documents on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      await loadAvailableTags();
      await loadAllDocuments();
    };
    loadInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Handle category selection
  const handleMajorHeadChange = (value: string) => {
    setMajorHead(value as 'Personal' | 'Professional' | '');
    setMinorHead(''); // Reset minor head when major head changes
  };

  // Get minor head options based on major head selection
  const getMinorHeadOptions = () => {
    if (majorHead === 'Personal') {
      return personalOptions;
    } else if (majorHead === 'Professional') {
      return professionalOptions;
    }
    return [];
  };

  // Handle tag selection from modal
  const handleTagSelection = (tag: Tag) => {
    const isAlreadySelected = selectedTags.some(
      selectedTag => selectedTag.tag_name === tag.tag_name,
    );

    if (!isAlreadySelected) {
      setSelectedTags(prev => [...(prev || []), tag]);
    }
    setShowTagModal(false);
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

  // Add new tag
  const addNewTag = async () => {
    if (newTagText.trim()) {
      const newTag = { tag_name: newTagText.trim() };

      // Add to selected tags
      setSelectedTags(prev => [...(prev || []), newTag]);

      // Save to available tags
      try {
        await apiSwitcher.saveTag(newTagText.trim());
        await loadAvailableTags(); // Refresh available tags
      } catch (error) {
        console.error('Failed to save tag:', error);
      }

      setNewTagText('');
      setShowTagModal(false);
    }
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

  // Perform search (now just triggers filtering) - not used with real-time filtering
  // const handleSearch = async () => {
  //   filterDocuments();
  // };

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

  // Render search result item
  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>
          {item.major_head} - {item.minor_head}
        </Text>
        <Text style={styles.resultDate}>{formatDate(item.document_date)}</Text>
      </View>

      {item.file && (
        <View style={styles.fileInfo}>
          <View style={styles.fileDetails}>
            <Text style={styles.fileName}>📄 {item.file.name}</Text>
            <Text style={styles.fileSize}>
              {item.file.type} • {formatFileSize(item.file.size)}
            </Text>
          </View>

          {/* Preview and Download Actions */}
          <View style={styles.fileActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.previewButton,
                !isPreviewable(item.file.type) && styles.disabledButton,
              ]}
              onPress={() => handlePreview(item)}
              disabled={!isPreviewable(item.file.type)}
            >
              <Text
                style={[
                  styles.previewButtonText,
                  !isPreviewable(item.file.type) && styles.disabledButtonText,
                ]}
              >
                👁️ Preview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.downloadButton]}
              onPress={() => handleDownload(item)}
              disabled={isDownloading[item.id]}
            >
              <Text style={styles.actionButtonText}>
                {isDownloading[item.id] ? '⬇️ Downloading...' : 'Download'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Download Progress */}
          {isDownloading[item.id] && downloadProgress[item.id] > 0 && (
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${downloadProgress[item.id]}%` },
                ]}
              />
              <Text style={styles.progressText}>
                {downloadProgress[item.id]}%
              </Text>
            </View>
          )}
        </View>
      )}

      {item.document_remarks && (
        <Text style={styles.resultRemarks}>{item.document_remarks}</Text>
      )}

      {item.tags && item.tags.length > 0 && (
        <View style={styles.resultTags}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.resultTag}>
              <Text style={styles.resultTagText}>{tag.tag_name}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.uploadInfo}>
        Uploaded: {formatDate(item.uploadedAt)} by {item.uploadedBy}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Main Search Input at Top */}
        <View style={styles.searchHeader}>
          <Text style={styles.title}>All Documents</Text>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, remarks, category..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchText('')}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filters Toggle Button */}
          <TouchableOpacity
            style={styles.filtersToggle}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text style={styles.filtersToggleText}>
              {showFilters ? '📁 Hide Filters' : '📁 Show Filters'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Collapsible Filters Section */}
        {showFilters && (
          <View style={styles.filtersSection}>
            {/* Category Dropdowns */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={majorHead}
                  onValueChange={handleMajorHeadChange}
                  style={styles.picker}
                >
                  <Picker.Item label="All Categories" value="" />
                  <Picker.Item label="Personal" value="Personal" />
                  <Picker.Item label="Professional" value="Professional" />
                </Picker>
              </View>
            </View>

            {/* Minor Head Dropdown */}
            {majorHead && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {majorHead === 'Personal' ? 'Person' : 'Department'}
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={minorHead}
                    onValueChange={setMinorHead}
                    style={styles.picker}
                  >
                    <Picker.Item
                      label={`All ${
                        majorHead === 'Personal' ? 'People' : 'Departments'
                      }`}
                      value=""
                    />
                    {getMinorHeadOptions().map((option, index) => (
                      <Picker.Item key={index} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            {/* Date Range Pickers */}
            <View style={styles.dateRangeContainer}>
              <View style={styles.dateInputGroup}>
                <Text style={styles.label}>From Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowFromDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {fromDate ? fromDate.toDateString() : 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateInputGroup}>
                <Text style={styles.label}>To Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowToDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {toDate ? toDate.toDateString() : 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Clear Date Range */}
            {(fromDate || toDate) && (
              <TouchableOpacity
                style={styles.clearDatesButton}
                onPress={() => {
                  setFromDate(null);
                  setToDate(null);
                }}
              >
                <Text style={styles.clearDatesText}>Clear Date Range</Text>
              </TouchableOpacity>
            )}

            {/* Tags Section */}
            <View style={styles.inputGroup}>
              {availableTags.length > 0 && (
                <View style={styles.availableTagsContainer}>
                  <Text style={styles.label}>Tags</Text>
                  <View style={styles.availableTagsGrid}>
                    {availableTags.map((tag, index) => {
                      const isSelected = selectedTags.some(
                        selectedTag => selectedTag.tag_name === tag.tag_name,
                      );
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.availableTagChip,
                            isSelected && styles.availableTagChipSelected,
                          ]}
                          onPress={() => {
                            if (isSelected) {
                              removeTag(tag);
                            } else {
                              handleFilterTagSelection(tag);
                            }
                          }}
                        >
                          <Text
                            style={[
                              styles.availableTagChipText,
                              isSelected && styles.availableTagChipTextSelected,
                            ]}
                          >
                            {tag.tag_name}
                          </Text>
                          {isSelected && (
                            <Text style={styles.availableTagChipCheck}> ✓</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            {/* Clear All Filters Button */}
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Documents List */}
        {isLoadingDocs ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading documents...</Text>
          </View>
        ) : (
          <View style={styles.documentsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {searchText ||
                majorHead ||
                minorHead ||
                selectedTags.length > 0 ||
                fromDate ||
                toDate
                  ? `Filtered Results (${searchResults.length})`
                  : `All Documents (${searchResults.length})`}
              </Text>

              {/* Download All Button */}
              {searchResults.length > 0 && (
                <TouchableOpacity
                  style={[styles.button, styles.downloadAllButton]}
                  onPress={handleDownloadAll}
                  disabled={isDownloadingAll}
                >
                  <Text style={styles.downloadAllButtonText}>
                    {isDownloadingAll
                      ? '⬇️ Downloading All...'
                      : 'Download All'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>
                  {searchText ||
                  majorHead ||
                  minorHead ||
                  selectedTags.length > 0 ||
                  fromDate ||
                  toDate
                    ? 'No documents found matching your criteria.'
                    : 'No documents available.'}
                </Text>
                <Text style={styles.noResultsSubtext}>
                  {searchText ||
                  majorHead ||
                  minorHead ||
                  selectedTags.length > 0 ||
                  fromDate ||
                  toDate
                    ? 'Try adjusting your search terms or filters.'
                    : 'Upload some documents to get started.'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Date Pickers */}
      <DatePicker
        modal
        open={showFromDatePicker}
        date={fromDate || new Date()}
        mode="date"
        onConfirm={date => {
          setShowFromDatePicker(false);
          setFromDate(date);
        }}
        onCancel={() => setShowFromDatePicker(false)}
      />

      <DatePicker
        modal
        open={showToDatePicker}
        date={toDate || new Date()}
        mode="date"
        onConfirm={date => {
          setShowToDatePicker(false);
          setToDate(date);
        }}
        onCancel={() => setShowToDatePicker(false)}
      />

      {/* Tag Selection Modal */}
      <Modal
        visible={showTagModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTagModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Tags</Text>
              <TouchableOpacity
                onPress={() => setShowTagModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* New Tag Input */}
            <View style={styles.newTagSection}>
              <TextInput
                style={styles.newTagInput}
                placeholder="Create new tag..."
                value={newTagText}
                onChangeText={setNewTagText}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.addNewTagButton}
                onPress={addNewTag}
                disabled={!newTagText.trim()}
              >
                <Text style={styles.addNewTagText}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Available Tags */}
            <ScrollView style={styles.tagsList}>
              {availableTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.availableTag,
                    selectedTags.some(
                      selectedTag => selectedTag.tag_name === tag.tag_name,
                    ) && styles.selectedAvailableTag,
                  ]}
                  onPress={() => handleTagSelection(tag)}
                >
                  <Text
                    style={[
                      styles.availableTagText,
                      selectedTags.some(
                        selectedTag => selectedTag.tag_name === tag.tag_name,
                      ) && styles.selectedAvailableTagText,
                    ]}
                  >
                    {tag.tag_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal
        visible={showPreviewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPreviewModal(false)}
      >
        <View style={styles.previewModalOverlay}>
          <View style={styles.previewModalContent}>
            <View style={styles.previewModalHeader}>
              <Text style={styles.previewModalTitle}>
                {previewDocument?.file?.name || 'Document Preview'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowPreviewModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {previewDocument?.file && (
              <View style={styles.previewContent}>
                {previewDocument.file.type.startsWith('image/') ? (
                  <View style={styles.imagePreviewContainer}>
                    {previewDocument.file.localPath ? (
                      <Image
                        source={{
                          uri: `file://${previewDocument.file.localPath}`,
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
                ) : previewDocument.file.type === 'application/pdf' ? (
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
                        setShowPreviewModal(false);
                        handleDownload(previewDocument);
                      }}
                    >
                      <Text style={styles.downloadPreviewButtonText}>
                        Download PDF
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : previewDocument.file.type.startsWith('text/') ? (
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
                      setShowPreviewModal(false);
                      handleDownload(previewDocument);
                    }}
                  >
                    <Text style={styles.downloadButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  searchHeader: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    backgroundColor: '#f8f9fa',
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: scale(45),
    paddingHorizontal: spacing.md,
    fontSize: fontSize.base,
    color: '#333',
  },
  clearSearchButton: {
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  clearSearchText: {
    fontSize: fontSize.lg,
    color: '#666',
  },
  filtersToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: spacing.sm,
  },
  filtersToggleText: {
    fontSize: fontSize.base,
    color: '#007AFF',
    fontWeight: '600',
  },
  filtersSection: {
    backgroundColor: '#f8f9fa',
    padding: spacing.md,
    borderRadius: scale(8),
    marginTop: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    fontSize: fontSize.base,
    color: '#666',
  },
  documentsSection: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    padding: spacing.md,
    fontSize: fontSize.base,
    backgroundColor: '#fff',
    color: '#2c3e50',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: scale(50),
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dateInputGroup: {
    flex: 0.48,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    padding: spacing.md,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  dateText: {
    fontSize: fontSize.base,
    color: '#2c3e50',
  },
  clearDatesButton: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  clearDatesText: {
    fontSize: fontSize.sm,
    color: '#e74c3c',
    textDecorationLine: 'underline',
  },
  addTagButton: {
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: scale(8),
    padding: spacing.sm,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addTagText: {
    fontSize: fontSize.base,
    color: '#3498db',
    fontWeight: '600',
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    borderRadius: scale(20),
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectedTagText: {
    fontSize: fontSize.sm,
    color: '#fff',
    fontWeight: '500',
  },
  removeTagText: {
    fontSize: fontSize.sm,
    color: '#fff',
    fontWeight: 'bold',
  },
  availableTagsContainer: {
    marginTop: spacing.md,
  },
  availableTagsLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: spacing.sm,
  },
  availableTagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  availableTagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: scale(16),
    paddingHorizontal: spacing.sm,
    paddingVertical: scale(6),
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  availableTagChipSelected: {
    backgroundColor: '#e8f5e8',
    borderColor: '#27ae60',
  },
  availableTagChipText: {
    fontSize: fontSize.xs,
    color: '#2c3e50',
    fontWeight: '500',
  },
  availableTagChipTextSelected: {
    color: '#27ae60',
    fontWeight: '600',
  },
  availableTagChipCheck: {
    fontSize: fontSize.xs,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  button: {
    flex: 0.48,
    padding: spacing.md,
    borderRadius: scale(8),
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#3498db',
  },
  searchButtonText: {
    fontSize: fontSize.base,
    color: '#fff',
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  clearButtonText: {
    fontSize: fontSize.base,
    color: '#2c3e50',
    fontWeight: '600',
  },
  resultsSection: {
    marginTop: spacing.md,
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
  downloadButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#fff',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: spacing.lg,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalCloseButton: {
    padding: spacing.sm,
  },
  modalCloseText: {
    fontSize: fontSize.lg,
    color: '#7f8c8d',
  },
  newTagSection: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  newTagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    padding: spacing.sm,
    fontSize: fontSize.base,
    marginRight: spacing.sm,
  },
  addNewTagButton: {
    backgroundColor: '#3498db',
    borderRadius: scale(8),
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  addNewTagText: {
    fontSize: fontSize.base,
    color: '#fff',
    fontWeight: '600',
  },
  tagsList: {
    maxHeight: scale(300),
  },
  availableTag: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  selectedAvailableTag: {
    backgroundColor: '#e8f5e8',
  },
  availableTagText: {
    fontSize: fontSize.base,
    color: '#2c3e50',
  },
  selectedAvailableTagText: {
    color: '#27ae60',
    fontWeight: '600',
  },
  // Preview Modal Styles
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
});

export default FileSearchComponent;
