// Jest setup file
/* eslint-env jest */

// Mock react-native modules
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock react-native-pixel-perfect
jest.mock('react-native-pixel-perfect', () => ({
  create: jest.fn(() => jest.fn(value => value)),
}));

// Mock react-native-fs
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/test/documents',
  DownloadDirectoryPath: '/test/downloads',
  writeFile: jest.fn(),
  readFile: jest.fn(),
  exists: jest.fn(),
  mkdir: jest.fn(),
  unlink: jest.fn(),
}));

// Mock react-native-blob-util
jest.mock('react-native-blob-util', () => ({
  fs: {
    dirs: {
      DocumentDir: '/test/documents',
      DownloadDir: '/test/downloads',
    },
    writeFile: jest.fn(),
    readFile: jest.fn(),
    exists: jest.fn(),
    mkdir: jest.fn(),
    unlink: jest.fn(),
  },
  config: jest.fn(() => ({
    fetch: jest.fn(),
  })),
  fetch: jest.fn(),
}));

// Mock react-native-pdf
jest.mock('react-native-pdf', () => 'PDF');

// Mock react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

// Mock @react-native-documents/picker
jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  isInProgress: jest.fn(),
  types: {
    allFiles: 'allFiles',
    images: 'images',
    pdf: 'pdf',
  },
}));
