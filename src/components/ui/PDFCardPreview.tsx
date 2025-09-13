import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Pdf, { Source } from 'react-native-pdf';
import { scale, spacing } from '../../utils/scale';

interface PDFCardPreviewProps {
  source: Source;
  style?: any;
}

const PDFCardPreview: React.FC<PDFCardPreviewProps> = ({ source, style }) => {
  const [error, setError] = useState<string | null>(null);

  const handleLoadComplete = () => {
    setError(null);
  };

  const handleError = (err: any) => {
    console.log('PDF Card Preview error:', err);
    setError('PDF preview failed');
  };

  return (
    <View style={[styles.container, style]}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>📕</Text>
          <Text style={styles.errorText}>PDF</Text>
        </View>
      )}

      {!error && (
        <Pdf
          source={source}
          onLoadComplete={handleLoadComplete}
          onError={handleError}
          style={styles.pdf}
          trustAllCerts={true}
          enablePaging={false}
          enableRTL={false}
          enableAnnotationRendering={false}
          enableAntialiasing={true}
          fitPolicy={0} // fit width
          spacing={0}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          page={1} // Always show first page
          scale={1.0}
          minScale={1.0}
          maxScale={1.0}
          renderActivityIndicator={() => <View />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pdf: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: scale(30),
    marginBottom: spacing.xs,
  },
  errorText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default PDFCardPreview;
