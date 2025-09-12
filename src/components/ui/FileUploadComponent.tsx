import { pick, types } from '@react-native-documents/picker';
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import { apiService } from '../../services/api';
import { fontSize, scale, spacing } from '../../utils/scale';

interface Tag {
  tag_name: string;
}

interface UploadedFile {
  uri: string;
  type: string;
  name: string;
  size?: number;
}

interface FileUploadProps {
  onFileUpload?: (data: FormData) => void;
}

const FileUploadComponent: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [majorHead, setMajorHead] = useState<'Personal' | 'Professional' | ''>(
    '',
  );
  const [minorHead, setMinorHead] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagText, setNewTagText] = useState('');
  const [showTagModal, setShowTagModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Options for dropdown menus
  const personalOptions = [
    'John',
    'Tom',
    'Emily',
    'Sarah',
    'Michael',
    'Jessica',
  ];
  const professionalOptions = [
    'Accounts',
    'HR',
    'IT',
    'Finance',
    'Marketing',
    'Operations',
  ];

  const minorHeadOptions =
    majorHead === 'Personal' ? personalOptions : professionalOptions;

  // Fetch available tags
  const fetchTags = useCallback(async () => {
    try {
      const response = await apiService.getDocumentTags({ term: '' });
      if (response && response.data) {
        setAvailableTags(response.data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Handle major head selection
  const handleMajorHeadChange = (value: 'Personal' | 'Professional' | '') => {
    setMajorHead(value);
    setMinorHead(''); // Reset minor head when major head changes
  };

  // Handle tag selection
  const addTag = (tag: Tag) => {
    if (!selectedTags.find(t => t.tag_name === tag.tag_name)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setShowTagModal(false);
  };

  // Handle new tag creation
  const createNewTag = async () => {
    if (newTagText.trim()) {
      const newTag: Tag = { tag_name: newTagText.trim() };

      // Add to selected tags
      if (!selectedTags.find(t => t.tag_name === newTag.tag_name)) {
        setSelectedTags([...selectedTags, newTag]);
      }

      // Add to available tags
      if (!availableTags.find(t => t.tag_name === newTag.tag_name)) {
        setAvailableTags([...availableTags, newTag]);
      }

      setNewTagText('');
      setShowTagModal(false);
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: Tag) => {
    setSelectedTags(
      selectedTags.filter(tag => tag.tag_name !== tagToRemove.tag_name),
    );
  };

  // Handle file selection
  const handleFileSelection = () => {
    Alert.alert('Select File Source', 'Choose how you want to add a file', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openImageLibrary },
      { text: 'Document', onPress: openDocumentPicker },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Open camera
  const openCamera = () => {
    const options = {
      mediaType: 'mixed' as MediaType,
      quality: 0.8 as any,
    };
    console.log('Camera options:', options);

    launchCamera(options, response => {
      console.log('Camera response:', response);
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const file: UploadedFile = {
          uri: asset.uri!,
          type: asset.type!,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          size: asset.fileSize,
        };
        setUploadedFiles([...uploadedFiles, file]);
      }
    });
  };

  // Open image library
  const openImageLibrary = () => {
    const options = {
      mediaType: 'mixed' as MediaType,
      quality: 0.8 as any,
      selectionLimit: 5,
    };

    launchImageLibrary(options, response => {
      if (response.assets) {
        const newFiles: UploadedFile[] = response.assets.map(asset => ({
          uri: asset.uri!,
          type: asset.type!,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          size: asset.fileSize,
        }));
        setUploadedFiles([...uploadedFiles, ...newFiles]);
      }
    });
  };

  // Open document picker
  const openDocumentPicker = async () => {
    try {
      const results = await pick({
        type: [types.pdf, types.images],
        allowMultiSelection: true,
      });

      const newFiles: UploadedFile[] = results.map(result => ({
        uri: result.uri,
        type: result.type || 'application/pdf',
        name: result.name || `document_${Date.now()}.pdf`,
        size: result.size || undefined,
      }));

      setUploadedFiles([...uploadedFiles, ...newFiles]);
    } catch (error: any) {
      if (!error.message.includes('User canceled')) {
        console.error('Error picking document:', error);
      }
    }
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!majorHead || !minorHead || uploadedFiles.length === 0) {
      Alert.alert(
        'Error',
        'Please fill all required fields and upload at least one file',
      );
      return;
    }

    const formData = new FormData();

    // Add form fields
    formData.append('major_head', majorHead);
    formData.append('minor_head', minorHead);
    formData.append('document_date', selectedDate.toISOString().split('T')[0]);
    formData.append('document_remarks', remarks);
    formData.append('tags', JSON.stringify(selectedTags));

    // Add files
    uploadedFiles.forEach(file => {
      formData.append('files', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);
    });

    if (onFileUpload) {
      onFileUpload(formData);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>File Upload</Text>

      {/* Date Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Document Date *</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
        </TouchableOpacity>

        <DatePicker
          modal
          open={showDatePicker}
          date={selectedDate}
          mode="date"
          onConfirm={date => {
            setShowDatePicker(false);
            setSelectedDate(date);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      </View>

      {/* Major Head Dropdown */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={majorHead}
            onValueChange={handleMajorHeadChange}
            style={styles.picker}
            itemStyle={{ color: '#333' }}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Personal" value="Personal" />
            <Picker.Item label="Professional" value="Professional" />
          </Picker>
        </View>
      </View>

      {/* Minor Head Dropdown */}
      {majorHead && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {majorHead === 'Personal' ? 'Person *' : 'Department *'}
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={minorHead}
              onValueChange={setMinorHead}
              style={styles.picker}
            >
              <Picker.Item
                label={`Select ${
                  majorHead === 'Personal' ? 'Person' : 'Department'
                }`}
                value=""
              />
              {minorHeadOptions.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* Tags Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tags</Text>
        <View style={styles.tagsContainer}>
          {selectedTags.map((tag, index) => (
            <View key={index} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag.tag_name}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <Text style={styles.tagRemove}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addTagButton}
            onPress={() => setShowTagModal(true)}
          >
            <Text style={styles.addTagText}>+ Add Tag</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Remarks */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={styles.remarksInput}
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Enter remarks..."
          multiline
          numberOfLines={3}
        />
      </View>

      {/* File Upload */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Files * (Images & PDFs only)</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleFileSelection}
        >
          <Text style={styles.uploadButtonText}>+ Add Files</Text>
        </TouchableOpacity>

        {/* Display uploaded files */}
        {uploadedFiles.map((file, index) => (
          <View key={index} style={styles.fileItem}>
            {file.type.startsWith('image/') && (
              <Image source={{ uri: file.uri }} style={styles.filePreview} />
            )}
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.fileSize}>
                {file.size
                  ? `${(file.size / 1024).toFixed(1)} KB`
                  : 'Unknown size'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeFile(index)}>
              <Text style={styles.fileRemove}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Upload Document</Text>
      </TouchableOpacity>

      {/* Tag Modal */}
      <Modal
        visible={showTagModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTagModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select or Create Tag</Text>

            <TextInput
              style={styles.newTagInput}
              value={newTagText}
              onChangeText={setNewTagText}
              placeholder="Create new tag..."
            />

            {newTagText.trim() && (
              <TouchableOpacity
                style={styles.createTagButton}
                onPress={createNewTag}
              >
                <Text style={styles.createTagText}>Create "{newTagText}"</Text>
              </TouchableOpacity>
            )}

            <FlatList
              data={availableTags}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.tagOption}
                  onPress={() => addTag(item)}
                >
                  <Text style={styles.tagOptionText}>{item.tag_name}</Text>
                </TouchableOpacity>
              )}
              style={styles.tagsList}
            />

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTagModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: '#333',
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: scale(12),
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: fontSize.md,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: '#ddd',
    alignItems: 'center',
    height: scale(50),
  },
  picker: {
    height: '100%',
    width: '100%',
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagChip: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
  },
  tagText: {
    color: '#fff',
    marginRight: scale(4),
  },
  tagRemove: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  addTagButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    borderWidth: scale(1),
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addTagText: {
    color: '#666',
  },
  remarksInput: {
    backgroundColor: '#fff',
    padding: scale(12),
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: '#ddd',
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: spacing.sm,
    borderRadius: scale(8),
    marginBottom: spacing.sm,
    borderWidth: scale(1),
    borderColor: '#ddd',
  },
  filePreview: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(4),
    marginRight: spacing.sm,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#333',
  },
  fileSize: {
    fontSize: fontSize.sm,
    color: '#666',
  },
  fileRemove: {
    fontSize: fontSize.xl,
    color: '#ff3333',
    fontWeight: 'bold',
    padding: scale(4),
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: spacing.md,
    borderRadius: scale(8),
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: scale(40),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '80%',
    borderRadius: scale(8),
    padding: spacing.md,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  newTagInput: {
    borderWidth: scale(1),
    borderColor: '#ddd',
    borderRadius: scale(8),
    padding: scale(12),
    marginBottom: spacing.sm,
  },
  createTagButton: {
    backgroundColor: '#007AFF',
    padding: spacing.sm,
    borderRadius: scale(8),
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  createTagText: {
    color: '#fff',
    fontWeight: '600',
  },
  tagsList: {
    maxHeight: scale(200),
  },
  tagOption: {
    padding: scale(12),
    borderBottomWidth: scale(1),
    borderBottomColor: '#eee',
  },
  tagOptionText: {
    fontSize: fontSize.md,
  },
  modalCloseButton: {
    backgroundColor: '#6c757d',
    padding: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
    marginTop: spacing.md,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default FileUploadComponent;
