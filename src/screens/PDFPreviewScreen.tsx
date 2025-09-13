import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PDFViewer from '../components/ui/PDFViewer';
import { fontSize, scale, spacing } from '../utils/scale';

const PDFPreviewScreen = ({ navigation, route }: any) => {
  const { source, title } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* PDF Viewer */}
      <PDFViewer
        source={source}
        style={styles.pdfViewer}
        pdfStyle={styles.pdf}
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  backButtonText: {
    fontSize: fontSize.base,
    color: '#3498db',
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  placeholder: {
    width: scale(60), // Same width as back button for centering
  },
  pdfViewer: {
    flex: 1,
  },
  pdf: {
    width: '100%',
  },
});

export default PDFPreviewScreen;
