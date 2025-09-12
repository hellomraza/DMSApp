// Global type definitions for DMS App

// ============================================================================
// Authentication Types
// ============================================================================

type UserData = {
  mobile_number: string;
  token: string;
};

type LoginFormData = {
  mobile_number: string;
};

type OTPFormData = {
  otp: string;
};

type OTPGenerateRequest = {
  mobile_number: string;
};

type OTPValidateRequest = {
  mobile_number: string;
  otp: string;
};

type OTPValidateResponse = {
  token: string;
  success: boolean;
  message: string;
};

// ============================================================================
// Document Types
// ============================================================================

type Tag = {
  tag_name: string;
};

type Document = {
  id: string;
  major_head: string;
  minor_head: string;
  document_date: string;
  document_remarks: string;
  tags: Tag[];
  uploaded_by: string;
  file_url: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
};

type DocumentUploadData = {
  major_head: string;
  minor_head: string;
  document_date: string;
  document_remarks: string;
  tags: Tag[];
  user_id: string;
};

type DocumentSearchRequest = {
  major_head?: string;
  minor_head?: string;
  from_date?: string;
  to_date?: string;
  tags?: Tag[];
  uploaded_by?: string;
  start?: number;
  length?: number;
  filterId?: string;
  search?: {
    value: string;
  };
};

type DocumentTagsRequest = {
  term: string;
};

type SearchFilters = {
  major_head?: string;
  minor_head?: string;
  from_date?: string;
  to_date?: string;
  tags?: Tag[];
  uploaded_by?: string;
  search_term?: string;
};

// ============================================================================
// API Types
// ============================================================================

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

type PaginationParams = {
  start: number;
  length: number;
};

// ============================================================================
// Navigation Types
// ============================================================================

type AuthStackParamList = {
  Login: undefined;
  OTPVerification: {
    mobile_number: string;
  };
};

type AppStackParamList = {
  Dashboard: undefined;
  DocumentUpload: undefined;
  DocumentSearch: undefined;
  DocumentList: undefined;
  DocumentPreview: {
    documentId: string;
  };
};

type RootStackParamList = AuthStackParamList & AppStackParamList;

// ============================================================================
// Component Props Types
// ============================================================================

type LoginScreenProps = {
  navigation: any;
};

type OTPVerificationScreenProps = {
  navigation: any;
  route: {
    params: {
      mobile_number: string;
    };
  };
};

type DashboardScreenProps = {
  navigation: any;
};

// ============================================================================
// Redux/State Management Types
// ============================================================================

type AuthState = {
  token: string | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

// ============================================================================
// Utility Types
// ============================================================================

type FileUpload = {
  uri: string;
  type: string;
  name: string;
  size?: number;
};

type ValidationResult = {
  isValid: boolean;
  message?: string;
};

type LoadingState = {
  isLoading: boolean;
  message?: string;
};

type ErrorState = {
  hasError: boolean;
  message?: string;
  code?: string;
};

// ============================================================================
// File Management Types
// ============================================================================

type FileInfo = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

type ManagedFile = {
  id: string;
  originalUri: string;
  localPath: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  isTemporary: boolean;
};

type FileCategory = 'documents' | 'images' | 'temp' | 'cache';

type StorageInfo = {
  documentsSize: number;
  tempSize: number;
  cacheSize: number;
  totalSize: number;
};

type FileOperationResult = {
  success: boolean;
  managedFile?: ManagedFile;
  error?: string;
};
