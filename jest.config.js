module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs|@react-navigation|react-native-vector-icons|react-native-screens|react-native-safe-area-context|@react-native-async-storage|@react-native-community|@react-native-documents|@react-native-picker|@tanstack|react-native-blob-util|react-native-fs|react-native-pdf|react-native-image-picker|react-native-config|react-native-date-picker|react-native-datepicker|redux-persist|immer|react-native-pixel-perfect|@testing-library)/)',
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
  projects: [
    {
      displayName: 'utils-tests',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/__tests__/utils/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs|@react-navigation|react-native-vector-icons|react-native-screens|react-native-safe-area-context|@react-native-async-storage|@react-native-community|@react-native-documents|@react-native-picker|@tanstack|react-native-blob-util|react-native-fs|react-native-pdf|react-native-image-picker|react-native-config|react-native-date-picker|react-native-datepicker|redux-persist|immer|react-native-pixel-perfect)/)',
      ],
    },
    {
      displayName: 'hooks-tests',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/__tests__/hooks/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          'identity-obj-proxy',
      },
      transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs|@react-navigation|react-native-vector-icons|react-native-screens|react-native-safe-area-context|@react-native-async-storage|@react-native-community|@react-native-documents|@react-native-picker|@tanstack|react-native-blob-util|react-native-fs|react-native-pdf|react-native-image-picker|react-native-config|react-native-date-picker|react-native-datepicker|redux-persist|immer|react-native-pixel-perfect)/)',
      ],
    },
    {
      displayName: 'components-tests',
      preset: 'react-native',
      testMatch: ['<rootDir>/__tests__/components/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs|@react-navigation|react-native-vector-icons|react-native-screens|react-native-safe-area-context|@react-native-async-storage|@react-native-community|@react-native-documents|@react-native-picker|@tanstack|react-native-blob-util|react-native-fs|react-native-pdf|react-native-image-picker|react-native-config|react-native-date-picker|react-native-datepicker|redux-persist|immer|react-native-pixel-perfect|@testing-library)/)',
      ],
    },
    {
      displayName: 'app-tests',
      preset: 'react-native',
      testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],
      testPathIgnorePatterns: [
        '<rootDir>/__tests__/utils/',
        '<rootDir>/__tests__/hooks/',
        '<rootDir>/__tests__/components/',
      ],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs|@react-navigation|react-native-vector-icons|react-native-screens|react-native-safe-area-context|@react-native-async-storage|@react-native-community|@react-native-documents|@react-native-picker|@tanstack|react-native-blob-util|react-native-fs|react-native-pdf|react-native-image-picker|react-native-config|react-native-date-picker|react-native-datepicker|redux-persist|immer|react-native-pixel-perfect)/)',
      ],
    },
  ],
};
