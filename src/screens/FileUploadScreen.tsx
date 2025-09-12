import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileUploadComponent } from '../components/ui';

const FileUploadScreen: React.FC = ({ navigation }: any) => {
  const handleFileUpload = (_formData: FormData) => {
    console.log('=== FILE UPLOAD FORM DATA ===');

    // Log form data contents
    console.log('FormData received with the following fields:');
    console.log('- major_head');
    console.log('- minor_head');
    console.log('- document_date');
    console.log('- document_remarks');
    console.log('- tags');
    console.log('- files');

    Alert.alert(
      'Upload Successful!',
      'Your document has been uploaded successfully. Check the console for form data details.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to dashboard or wherever needed
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Upload Document</Text>
      </View>

      <View style={styles.content}>
        <FileUploadComponent onFileUpload={handleFileUpload} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3498db',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default FileUploadScreen;
