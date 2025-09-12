import { AxiosResponse } from 'axios';
import { apiService } from './api';
import { mockApiService } from './mockApiService';
import { MOCK_CONFIG } from './mockConfig';

class ApiSwitcher {
  private useMockApi(): boolean {
    return MOCK_CONFIG.ENABLED;
  }

  // Generate OTP
  async generateOTP(data: OTPGenerateRequest): Promise<AxiosResponse> {
    if (this.useMockApi()) {
      return mockApiService.generateOTP(data);
    }
    return apiService.generateOTP(data);
  }

  // Validate OTP
  async validateOTP(
    data: OTPValidateRequest,
  ): Promise<AxiosResponse<OTPValidateResponse>> {
    if (this.useMockApi()) {
      return mockApiService.validateOTP(data);
    }
    return apiService.validateOTP(data);
  }

  // Upload Document
  async uploadDocument(
    file: any,
    data: DocumentUploadData,
  ): Promise<AxiosResponse> {
    if (this.useMockApi()) {
      return mockApiService.uploadDocument(file, data);
    }
    return apiService.uploadDocument(file, data);
  }

  // Search Documents
  async searchDocuments(data: DocumentSearchRequest): Promise<AxiosResponse> {
    if (this.useMockApi()) {
      return mockApiService.searchDocuments(data);
    }
    return apiService.searchDocuments(data);
  }

  // Get Document Tags
  async getDocumentTags(data: DocumentTagsRequest): Promise<AxiosResponse> {
    if (this.useMockApi()) {
      return mockApiService.getDocumentTags(data);
    }
    return apiService.getDocumentTags(data);
  }

  // Download Document
  async downloadDocument(
    documentId: string,
    fileName: string,
  ): Promise<string> {
    if (this.useMockApi()) {
      // For mock API, return the local path if file exists
      throw new Error('Download not available in mock mode');
    }
    return apiService.downloadDocument(documentId, fileName);
  }

  // Delete Document
  async deleteDocument(documentId: string): Promise<AxiosResponse> {
    if (this.useMockApi()) {
      return mockApiService.deleteDocument(documentId);
    }
    return apiService.deleteDocument(documentId);
  }

  // Validate File
  validateFile(file: any): { isValid: boolean; error?: string } {
    if (this.useMockApi()) {
      // Use same validation for both mock and real API
      return apiService.validateFile(file);
    }
    return apiService.validateFile(file);
  }

  // Get Upload Status
  async getUploadStatus(uploadId: string): Promise<AxiosResponse> {
    if (this.useMockApi()) {
      throw new Error('Upload status not available in mock mode');
    }
    return apiService.getUploadStatus(uploadId);
  }

  // Mock-specific methods
  async saveTag(tagName: string): Promise<void> {
    if (this.useMockApi()) {
      return mockApiService.saveTag(tagName);
    }
    // For real API, this would be handled by the tags endpoint
    console.log('Save tag not implemented for real API');
  }

  async clearStorage(): Promise<void> {
    if (this.useMockApi()) {
      return mockApiService.clearStorage();
    }
    console.log('Clear storage not available for real API');
  }

  // Utility methods
  isMockMode(): boolean {
    return this.useMockApi();
  }

  toggleMockMode(): void {
    MOCK_CONFIG.ENABLED = !MOCK_CONFIG.ENABLED;
    console.log(
      `API Mode switched to: ${MOCK_CONFIG.ENABLED ? 'Mock' : 'Real'}`,
    );
  }

  getMockOTP(): string {
    return MOCK_CONFIG.STATIC_OTP;
  }
}

// Export singleton instance
export const apiSwitcher = new ApiSwitcher();
export default apiSwitcher;
