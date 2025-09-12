import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FileUploadComponent from '../components/ui/FileUploadComponent';
import { fontSize, spacing } from '../utils/scale';

interface Props {}

const FileUploadScreen: React.FC<Props> = () => {
  const handleFileUpload = (_formData: FormData) => {
    // Handle file upload logic here
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.componentContainer}>
          <FileUploadComponent onFileUpload={handleFileUpload} />
        </View>
      </ScrollView>
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
  },
  header: {
    padding: spacing.lg,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: '#ecf0f1',
    textAlign: 'center',
  },
  componentContainer: {
    padding: spacing.md,
  },
});

export default FileUploadScreen;
