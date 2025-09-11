import axios, { AxiosResponse } from 'axios';
import Config from 'react-native-config';
import type {
  DocumentSearchRequest,
  DocumentTagsRequest,
  DocumentUploadData,
  OTPGenerateRequest,
  OTPValidateRequest,
  OTPValidateResponse,
} from '../types/global';
import { getCurrentToken } from '../utils/auth';

const API_BASE_URL = Config.API_BASE_URL || '';
// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token from Redux store
apiClient.interceptors.request.use(
  config => {
    const token = getCurrentToken();
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

class ApiService {
  // Generate OTP
  async generateOTP(data: OTPGenerateRequest): Promise<AxiosResponse> {
    const response = await apiClient.post('/generateOTP', data);
    if (!response.data || !response.data.status) {
      throw new Error(
        'Failed to generate OTP: ' +
          (response.data?.message || 'Unknown error'),
      );
    }
    return response;
  }

  // Validate OTP
  async validateOTP(
    data: OTPValidateRequest,
  ): Promise<AxiosResponse<OTPValidateResponse>> {
    const response = await apiClient.post('/validateOTP', data);
    if (!response.data || !response.data.status) {
      throw new Error(
        'Failed to validate OTP: ' +
          (response.data?.message || 'Unknown error'),
      );
    }
    return response;
  }

  // Upload Document
  async uploadDocument(
    file: any,
    data: DocumentUploadData,
  ): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify(data));

    const response = await apiClient.post('/saveDocumentEntry', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (!response.data || !response.data.status) {
      throw new Error(
        'Failed to upload document: ' +
          (response.data?.message || 'Unknown error'),
      );
    }
    return response;
  }

  // Search Documents
  async searchDocuments(data: DocumentSearchRequest): Promise<AxiosResponse> {
    const response = await apiClient.post('/searchDocumentEntry', data);
    if (!response.data || !response.data.status) {
      throw new Error(
        'Failed to search documents: ' +
          (response.data?.message || 'Unknown error'),
      );
    }
    return response;
  }

  // Get Document Tags
  async getDocumentTags(data: DocumentTagsRequest): Promise<AxiosResponse> {
    const response = await apiClient.post('/documentTags', data);
    if (!response.data || !response.data.status) {
      throw new Error(
        'Failed to get document tags: ' +
          (response.data?.message || 'Unknown error'),
      );
    }
    return response;
  }
}

export const apiService = new ApiService();
export default apiService;
