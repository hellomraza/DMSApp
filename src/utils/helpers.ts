export const formatMobileNumber = (mobile: string): string => {
  // Remove any non-numeric characters
  const cleaned = mobile.replace(/\D/g, '');

  // Return only the last 10 digits if longer
  return cleaned.slice(-10);
};

export const validateMobileNumber = (mobile: string): boolean => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile);
};

export const validateOTP = (otp: string): boolean => {
  const otpRegex = /^[0-9]{6}$/;
  return otpRegex.test(otp);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
