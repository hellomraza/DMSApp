// Mock API Configuration
export const MOCK_CONFIG = {
  ENABLED: true, // Set to false to use real API
  STATIC_OTP: '123456',
  MOCK_TOKEN: 'mock_token_12345',
  DELAY: 1000, // Simulate network delay in ms
};

// Mock data storage
export const mockStorage = {
  uploadedDocuments: [] as any[],
  documentTags: [
    { tag_name: 'Important' },
    { tag_name: 'Work' },
    { tag_name: 'Personal' },
    { tag_name: 'Finance' },
    { tag_name: 'Health' },
    { tag_name: 'Legal' },
    { tag_name: 'Insurance' },
    { tag_name: 'Tax' },
    { tag_name: 'Contract' },
    { tag_name: 'Invoice' },
    { tag_name: 'Receipt' },
    { tag_name: 'Report' },
    { tag_name: 'Certificate' },
    { tag_name: 'License' },
    { tag_name: 'Passport' },
  ],
};

// Helper function to simulate network delay
export const mockDelay = (ms: number = MOCK_CONFIG.DELAY) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), ms));

// Mock response helper
export const createMockResponse = (data: any, status: boolean = true): any => ({
  data: {
    status,
    data,
    message: status ? 'Success' : 'Error',
  },
  status: status ? 200 : 400,
  statusText: status ? 'OK' : 'Bad Request',
  headers: {},
  config: {
    headers: {},
    method: 'post',
    url: '',
  },
});

// Mock error helper
export const createMockError = (message: string) => {
  const error = new Error(message);
  (error as any).response = createMockResponse(message, false);
  return error;
};
