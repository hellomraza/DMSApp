import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import { fontSize, scale, spacing } from '../../utils/scale';

interface Tag {
  tag_name: string;
}

interface SearchFiltersProps {
  majorHead: 'Personal' | 'Professional' | '';
  minorHead: string;
  fromDate: Date | null;
  toDate: Date | null;
  selectedTags: Tag[];
  availableTags: Tag[];
  showFromDatePicker: boolean;
  showToDatePicker: boolean;
  onMajorHeadChange: (value: string) => void;
  onMinorHeadChange: (value: string) => void;
  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;
  onShowFromDatePicker: (show: boolean) => void;
  onShowToDatePicker: (show: boolean) => void;
  onClearDateRange: () => void;
  onTagSelect: (tag: Tag) => void;
  onTagRemove: (tag: Tag) => void;
  onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  majorHead,
  minorHead,
  fromDate,
  toDate,
  selectedTags,
  availableTags,
  showFromDatePicker,
  showToDatePicker,
  onMajorHeadChange,
  onMinorHeadChange,
  onFromDateChange,
  onToDateChange,
  onShowFromDatePicker,
  onShowToDatePicker,
  onClearDateRange,
  onTagSelect,
  onTagRemove,
  onClearFilters,
}) => {
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

  // Get minor head options based on major head selection
  const getMinorHeadOptions = () => {
    if (majorHead === 'Personal') {
      return personalOptions;
    } else if (majorHead === 'Professional') {
      return professionalOptions;
    }
    return [];
  };

  return (
    <View style={styles.filtersSection}>
      {/* Category Dropdowns */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={majorHead}
            onValueChange={onMajorHeadChange}
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
              onValueChange={onMinorHeadChange}
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
            onPress={() => onShowFromDatePicker(true)}
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
            onPress={() => onShowToDatePicker(true)}
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
          onPress={onClearDateRange}
        >
          <Text style={styles.clearDatesText}>Clear Date Range</Text>
        </TouchableOpacity>
      )}

      {/* Tags Section */}
      <View style={styles.inputGroup}>
        {availableTags.length > 0 && (
          <View>
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
                        onTagRemove(tag);
                      } else {
                        onTagSelect(tag);
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
        onPress={onClearFilters}
      >
        <Text style={styles.clearButtonText}>Clear All Filters</Text>
      </TouchableOpacity>

      {/* Date Pickers */}
      <DatePicker
        modal
        open={showFromDatePicker}
        date={fromDate || new Date()}
        mode="date"
        onConfirm={date => {
          onShowFromDatePicker(false);
          onFromDateChange(date);
        }}
        onCancel={() => onShowFromDatePicker(false)}
      />

      <DatePicker
        modal
        open={showToDatePicker}
        date={toDate || new Date()}
        mode="date"
        onConfirm={date => {
          onShowToDatePicker(false);
          onToDateChange(date);
        }}
        onCancel={() => onShowToDatePicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filtersSection: {
    backgroundColor: '#f8f9fa',
    padding: spacing.md,
    borderRadius: scale(8),
    marginTop: spacing.sm,
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
  button: {
    padding: spacing.md,
    borderRadius: scale(8),
    alignItems: 'center',
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
});

export default SearchFilters;
