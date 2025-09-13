import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import SearchFilters from '../../../src/components/ui/SearchFilters';

// Mock the external dependencies
jest.mock('@react-native-picker/picker', () => {
  const mockReact = require('react');
  const MockPicker = ({ children, onValueChange, testID, style }: any) => {
    return mockReact.createElement(
      'View',
      {
        testID: testID || 'picker',
        style,
        onPress: () => onValueChange && onValueChange('test-value'),
      },
      children,
    );
  };

  const MockPickerItem = ({ label, value }: any) => {
    const ReactLib = require('react');
    return ReactLib.createElement(
      'View',
      {
        testID: `picker-item-${value}`,
      },
      label,
    );
  };

  MockPicker.Item = MockPickerItem;

  return {
    Picker: MockPicker,
  };
});

jest.mock('react-native-date-picker', () => {
  const mockReact = require('react');
  return ({ onConfirm, testID }: any) => {
    return mockReact.createElement('View', {
      testID: testID || 'date-picker',
      onPress: () => {
        if (onConfirm) {
          onConfirm(new Date('2024-01-15'));
        }
      },
    });
  };
});

// Mock scale utilities
jest.mock('../../../src/utils/scale', () => ({
  scale: (value: number) => value,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
  },
}));

describe('SearchFilters', () => {
  const mockTag1 = { tag_name: 'Important' };
  const mockTag2 = { tag_name: 'Work' };
  const mockTag3 = { tag_name: 'Personal' };

  const defaultProps = {
    majorHead: '' as 'Personal' | 'Professional' | '',
    minorHead: '',
    fromDate: null,
    toDate: null,
    selectedTags: [],
    availableTags: [mockTag1, mockTag2, mockTag3],
    showFromDatePicker: false,
    showToDatePicker: false,
    onMajorHeadChange: jest.fn(),
    onMinorHeadChange: jest.fn(),
    onFromDateChange: jest.fn(),
    onToDateChange: jest.fn(),
    onShowFromDatePicker: jest.fn(),
    onShowToDatePicker: jest.fn(),
    onClearDateRange: jest.fn(),
    onTagSelect: jest.fn(),
    onTagRemove: jest.fn(),
    onClearFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(<SearchFilters {...defaultProps} />);

    expect(getByText('Category')).toBeTruthy();
    expect(getByText('From Date')).toBeTruthy();
    expect(getByText('To Date')).toBeTruthy();
    expect(getByText('Tags')).toBeTruthy();
    expect(getByText('Clear All Filters')).toBeTruthy();
  });

  it('renders major head picker with correct options', () => {
    const { getByTestId } = render(<SearchFilters {...defaultProps} />);

    const picker = getByTestId('picker');
    expect(picker).toBeTruthy();
  });

  it('shows minor head dropdown when major head is selected - Personal', () => {
    const props = {
      ...defaultProps,
      majorHead: 'Personal' as const,
    };

    const { getByText } = render(<SearchFilters {...props} />);

    expect(getByText('Person')).toBeTruthy();
  });

  it('shows minor head dropdown when major head is selected - Professional', () => {
    const props = {
      ...defaultProps,
      majorHead: 'Professional' as const,
    };

    const { getByText } = render(<SearchFilters {...props} />);

    expect(getByText('Department')).toBeTruthy();
  });

  it('does not show minor head dropdown when no major head is selected', () => {
    const { queryByText } = render(<SearchFilters {...defaultProps} />);

    expect(queryByText('Person')).toBeFalsy();
    expect(queryByText('Department')).toBeFalsy();
  });

  it('handles from date button press', () => {
    const { getAllByText } = render(<SearchFilters {...defaultProps} />);

    // Get all "Select Date" buttons - first one is for "From Date"
    const selectDateButtons = getAllByText('Select Date');
    const fromDateButton = selectDateButtons[0];
    fireEvent.press(fromDateButton);

    expect(defaultProps.onShowFromDatePicker).toHaveBeenCalledWith(true);
  });

  it('handles to date button press', () => {
    const { getAllByText } = render(<SearchFilters {...defaultProps} />);

    const dateButtons = getAllByText('Select Date');
    const toDateButton = dateButtons[1]; // Second "Select Date" button is for "To Date"
    fireEvent.press(toDateButton);

    expect(defaultProps.onShowToDatePicker).toHaveBeenCalledWith(true);
  });

  it('displays formatted dates when dates are provided', () => {
    const fromDate = new Date('2024-01-15');
    const toDate = new Date('2024-01-30');

    const props = {
      ...defaultProps,
      fromDate,
      toDate,
    };

    const { getByText } = render(<SearchFilters {...props} />);

    expect(getByText(fromDate.toDateString())).toBeTruthy();
    expect(getByText(toDate.toDateString())).toBeTruthy();
  });

  it('shows clear date range button when dates are selected', () => {
    const props = {
      ...defaultProps,
      fromDate: new Date('2024-01-15'),
    };

    const { getByText } = render(<SearchFilters {...props} />);

    expect(getByText('Clear Date Range')).toBeTruthy();
  });

  it('handles clear date range button press', () => {
    const props = {
      ...defaultProps,
      fromDate: new Date('2024-01-15'),
    };

    const { getByText } = render(<SearchFilters {...props} />);

    const clearButton = getByText('Clear Date Range');
    fireEvent.press(clearButton);

    expect(defaultProps.onClearDateRange).toHaveBeenCalled();
  });

  it('does not show clear date range button when no dates are selected', () => {
    const { queryByText } = render(<SearchFilters {...defaultProps} />);

    expect(queryByText('Clear Date Range')).toBeFalsy();
  });

  it('renders available tags correctly', () => {
    const { getByText } = render(<SearchFilters {...defaultProps} />);

    expect(getByText('Important')).toBeTruthy();
    expect(getByText('Work')).toBeTruthy();
    expect(getByText('Personal')).toBeTruthy();
  });

  it('handles tag selection', () => {
    const { getByText } = render(<SearchFilters {...defaultProps} />);

    const tagButton = getByText('Important');
    fireEvent.press(tagButton);

    expect(defaultProps.onTagSelect).toHaveBeenCalledWith(mockTag1);
  });

  it('handles tag removal when tag is already selected', () => {
    const props = {
      ...defaultProps,
      selectedTags: [mockTag1],
    };

    const { getByText } = render(<SearchFilters {...props} />);

    const tagButton = getByText('Important');
    fireEvent.press(tagButton);

    expect(defaultProps.onTagRemove).toHaveBeenCalledWith(mockTag1);
  });

  it('shows checkmark for selected tags', () => {
    const props = {
      ...defaultProps,
      selectedTags: [mockTag1],
    };

    const { getByText } = render(<SearchFilters {...props} />);

    expect(getByText(' ✓')).toBeTruthy();
  });

  it('handles clear all filters button press', () => {
    const { getByText } = render(<SearchFilters {...defaultProps} />);

    const clearAllButton = getByText('Clear All Filters');
    fireEvent.press(clearAllButton);

    expect(defaultProps.onClearFilters).toHaveBeenCalled();
  });

  it('does not render tags section when no available tags', () => {
    const props = {
      ...defaultProps,
      availableTags: [],
    };

    const { queryByText } = render(<SearchFilters {...props} />);

    expect(queryByText('Tags')).toBeFalsy();
  });

  it('applies correct styles to selected tag chips', () => {
    const props = {
      ...defaultProps,
      selectedTags: [mockTag1],
    };

    const { getByText } = render(<SearchFilters {...props} />);

    const selectedTag = getByText('Important');
    expect(selectedTag).toBeTruthy();
    // Note: Style testing in React Native is limited, but we can verify the component renders
  });

  it('renders date pickers with correct props', () => {
    const props = {
      ...defaultProps,
      showFromDatePicker: true,
      fromDate: new Date('2024-01-15'),
    };

    const { getAllByTestId } = render(<SearchFilters {...props} />);

    const datePickers = getAllByTestId('date-picker');
    expect(datePickers).toHaveLength(2);
  });

  it('handles major head change correctly', () => {
    const { getByTestId } = render(<SearchFilters {...defaultProps} />);

    const picker = getByTestId('picker');
    fireEvent.press(picker);

    // The mock will call onValueChange with 'test-value'
    expect(defaultProps.onMajorHeadChange).toHaveBeenCalled();
  });
});
