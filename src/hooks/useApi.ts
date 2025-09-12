import { useMutation, useQuery } from '@tanstack/react-query';
import { apiSwitcher } from '../services/apiSwitcher';
import { loginSuccess } from '../store/slices/authSlice';
import { useAuth } from './redux';

// Auth Hooks
export const useGenerateOTP = () => {
  return useMutation({
    mutationFn: (data: OTPGenerateRequest) => apiSwitcher.generateOTP(data),
  });
};

export const useValidateOTP = () => {
  const { dispatch } = useAuth();
  return useMutation({
    mutationFn: (data: OTPValidateRequest) => apiSwitcher.validateOTP(data),
    onSuccess: (response: any) => {
      if (response.data.token) {
        dispatch(loginSuccess({ token: response.data.token }));
      }
    },
    onError: (error: any) => {
      console.error('OTP validation error:', error);
    },
  });
};

// Document Management Hooks
export const useUploadDocument = () => {
  return useMutation({
    mutationFn: ({ file, data }: { file: any; data: DocumentUploadData }) =>
      apiSwitcher.uploadDocument(file, data),
    onSuccess: (response: any) => {
      console.log('Document uploaded successfully:', response.data);
    },
    onError: (error: any) => {
      console.error('Document upload error:', error);
    },
  });
};

export const useSearchDocuments = () => {
  return useMutation({
    mutationFn: (data: DocumentSearchRequest) =>
      apiSwitcher.searchDocuments(data),
    onSuccess: (response: any) => {
      console.log('Documents searched successfully:', response.data);
    },
    onError: (error: any) => {
      console.error('Document search error:', error);
    },
  });
};

export const useDocumentTags = (
  data: DocumentTagsRequest,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['documentTags', data],
    queryFn: () => apiSwitcher.getDocumentTags(data),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
