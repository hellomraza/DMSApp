import store from '../store';
import { logout } from '../store/slices/authSlice';
import type {
  OTPGenerateRequest,
  OTPValidateRequest,
  UserData,
} from '../types/global';
import { apiService } from './api';

class AuthService {
  // Generate OTP
  async generateOTP(mobile_number: string): Promise<any> {
    try {
      const data: OTPGenerateRequest = { mobile_number };
      const response = await apiService.generateOTP(data);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'OTP generation failed');
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw error;
    }
  }

  // Validate OTP and login
  async validateOTPAndLogin(
    mobile_number: string,
    otp: string,
  ): Promise<UserData> {
    try {
      const data: OTPValidateRequest = { mobile_number, otp };
      const response = await apiService.validateOTP(data);

      if (response.data.success && response.data.token) {
        const userData: UserData = {
          mobile_number,
          token: response.data.token,
        };

        return userData;
      } else {
        throw new Error(response.data.message || 'OTP validation failed');
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      store.dispatch(logout());
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
