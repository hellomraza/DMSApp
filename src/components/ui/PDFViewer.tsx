import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Pdf, { Source } from 'react-native-pdf';
import { scale, spacing } from '../../utils/scale';

interface PDFViewerProps {
  source: Source;
  style?: any;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ source, style }) => {
  console.log('PDFViewer: Initializing with source:', source);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleLoadComplete = (numberOfPages: number) => {
    console.log(
      'PDFViewer: PDF loaded successfully with',
      numberOfPages,
      'pages',
    );
    setPageCount(numberOfPages);
    setLoading(false);
    setError(null);
  };

  const handlePageChanged = (page: number) => {
    console.log('PDFViewer: PDF page changed to:', page);
    setCurrentPage(page);
  };

  const handleError = (err: any) => {
    console.error('PDFViewer: PDF loading error:', err);
    console.error('PDFViewer: Error details:', JSON.stringify(err, null, 2));
    console.error('PDFViewer: Source was:', source);

    let errorMessage = 'Failed to load PDF. ';
    if (err && err.message) {
      if (err.message.includes('network')) {
        errorMessage += 'Please check your network connection.';
      } else if (
        err.message.includes('format') ||
        err.message.includes('invalid')
      ) {
        errorMessage += 'The PDF file appears to be corrupted or invalid.';
      } else {
        errorMessage += 'Please try downloading the file first.';
      }
    } else {
      errorMessage += 'Please try again later.';
    }

    setError(errorMessage);
    setLoading(false);
  };

  const handleLoadProgress = (percent: number) => {
    console.log('PDFViewer: PDF loading progress:', percent + '%');
  };

  return (
    <View style={[styles.container, style]}>
      {/* {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading PDF...</Text>
        </View>
      )} */}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>📄</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!error && (
        <>
          <Pdf
            source={source}
            onLoadComplete={handleLoadComplete}
            onPageChanged={handlePageChanged}
            onError={handleError}
            onLoadProgress={handleLoadProgress}
            style={styles.pdf}
            trustAllCerts={true}
            enablePaging={true}
            enableRTL={false}
            enableAnnotationRendering={false}
            enableAntialiasing={true}
            fitPolicy={0} // 0: fit width, 1: fit height, 2: fit both
            spacing={spacing.sm}
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={true}
            password=""
            scale={1.0}
            minScale={1.0}
            maxScale={3.0}
            renderActivityIndicator={() => <View />} // We handle loading ourselves
          />

          {!loading && !error && pageCount > 0 && (
            <View style={styles.pageInfo}>
              <Text style={styles.pageInfoText}>
                Page {currentPage} of {pageCount}
              </Text>
            </View>
          )}
        </>
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
    width: Dimensions.get('window').width - scale(40),
    height: Dimensions.get('window').height - scale(200),
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
    marginTop: spacing.sm,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorIcon: {
    fontSize: scale(50),
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  pageInfo: {
    position: 'absolute',
    bottom: spacing.md,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: scale(20),
  },
  pageInfoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PDFViewer;
