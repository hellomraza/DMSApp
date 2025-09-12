import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { fontSize, scale, spacing } from '../../utils/scale';

interface SearchHeaderProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  resultsCount: number;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchText,
  onSearchTextChange,
  showFilters,
  onToggleFilters,
  resultsCount,
}) => {
  return (
    <View style={styles.searchHeader}>
      <Text style={styles.title}>All Documents</Text>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, remarks, category..."
          value={searchText}
          onChangeText={onSearchTextChange}
          placeholderTextColor="#999"
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            style={styles.clearSearchButton}
            onPress={() => onSearchTextChange('')}
          >
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      {searchText.length > 0 && (
        <Text style={styles.resultsCount}>
          {resultsCount} {resultsCount === 1 ? 'document' : 'documents'} found
        </Text>
      )}

      {/* Filters Toggle Button */}
      <TouchableOpacity style={styles.filtersToggle} onPress={onToggleFilters}>
        <Text style={styles.filtersToggleText}>
          {showFilters ? '📁 Hide Filters' : '📁 Show Filters'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.md,
    textAlign: 'center',
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
  resultsCount: {
    fontSize: fontSize.sm,
    color: '#666',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default SearchHeader;
