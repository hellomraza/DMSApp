module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs|@react-navigation|react-native-vector-icons|react-native-screens|react-native-safe-area-context|@react-native-async-storage|@react-native-community|@react-native-documents|@react-native-picker|@tanstack|react-native-blob-util|react-native-fs|react-native-pdf|react-native-image-picker|react-native-config|react-native-date-picker|react-native-datepicker|redux-persist|immer|react-native-pixel-perfect)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/android/',
    '<rootDir>/ios/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
