import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import FileSearchComponent from '../components/ui/FileSearchComponent';

const FileSearchScreen: React.FC = () => {
  const handleSearchResults = (results: any[]) => {
    console.log('Search results received:', results);
    // Handle search results if needed
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.content}>
        <FileSearchComponent onSearchResults={handleSearchResults} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});

export default FileSearchScreen;
