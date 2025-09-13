import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { CustomButton, CustomTextInput } from '../components/ui';
import { useGenerateOTP, useTimer, useValidateOTP } from '../hooks';
import { loginSuccess } from '../store/slices/authSlice';
import { fontSize, scale, spacing } from '../utils/scale';

const OTPVerificationScreen = ({ navigation, route }: any) => {
  const { mobile_number } = route.params;
  const [formData, setFormData] = useState<OTPFormData>({
    otp: '',
  });
  const dispatch = useDispatch();
  const validateOTPMutation = useValidateOTP();
  const generateOTPMutation = useGenerateOTP();
  const otpInputRef = useRef<TextInput>(null);

  // Use custom timer hook
  const {
    time: timer,
    isCompleted: canResend,
    restart: restartTimer,
    formatTime,
  } = useTimer({
    initialTime: 60,
    autoStart: true,
  });

  useEffect(() => {
    // Focus on OTP input when screen loads
    if (otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, []);

  const validateOTP = (otp: string): boolean => {
    return otp.length === 6 && /^[0-9]+$/.test(otp);
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (!validateOTP(formData.otp)) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    validateOTPMutation.mutate(
      {
        mobile_number,
        otp: formData.otp,
      },
      {
        onSuccess: response => {
          const responseData = response.data;
          if (responseData.success && responseData.token) {
            // Create userData from the mobile number and token
            const userData: UserData = {
              mobile_number,
              token: responseData.token,
            };

            // Dispatch login success to Redux store
            dispatch(loginSuccess({ token: responseData.token, userData }));

            Alert.alert('Success', 'Login successful!', [
              {
                text: 'OK',
                onPress: () => {
                  // Navigate to main app screen
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Dashboard' }],
                  });
                },
              },
            ]);
          } else {
            Alert.alert(
              'Error',
              responseData.message || 'Invalid OTP. Please try again.',
            );
          }
        },
        onError: (error: any) => {
          Alert.alert(
            'Error',
            error?.message || 'Invalid OTP. Please try again.',
          );
        },
      },
    );
  };

  const handleResendOTP = () => {
    generateOTPMutation.mutate(
      { mobile_number },
      {
        onSuccess: _response => {
          Alert.alert('Success', 'OTP has been resent to your mobile number');

          // Restart timer with 60 seconds
          restartTimer(60);
        },
        onError: (error: any) => {
          Alert.alert(
            'Error',
            error?.message || 'Failed to resend OTP. Please try again.',
          );
        },
      },
    );
  };

  const handleChangeNumber = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
            <Text style={styles.mobileNumber}>{mobile_number}</Text>
          </View>

          <View style={styles.form}>
            <CustomTextInput
              ref={otpInputRef}
              label="Enter OTP"
              placeholder="000000"
              value={formData.otp}
              onChangeText={text => setFormData({ ...formData, otp: text })}
              keyboardType="numeric"
              maxLength={6}
              editable={!validateOTPMutation.isPending}
              textAlign="center"
              inputStyle={styles.input}
              labelStyle={styles.label}
            />

            <CustomButton
              title="Verify OTP"
              onPress={handleVerifyOTP}
              loading={validateOTPMutation.isPending}
              disabled={validateOTPMutation.isPending}
            />

            <View style={styles.resendContainer}>
              {!canResend ? (
                <Text style={styles.timerText}>
                  Resend OTP in {formatTime(timer)}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendOTP}
                  disabled={generateOTPMutation.isPending}
                >
                  {generateOTPMutation.isPending ? (
                    <ActivityIndicator color="#3498db" />
                  ) : (
                    <Text style={styles.resendText}>Resend OTP</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            <CustomButton
              title="Change Mobile Number"
              onPress={handleChangeNumber}
              variant="danger"
              size="small"
              buttonStyle={styles.changeNumberButton}
              textStyle={styles.changeNumberText}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  mobileNumber: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    height: scale(60),
    fontWeight: 'bold',
    fontSize: fontSize.lg,
    letterSpacing: scale(2),
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  timerText: {
    fontSize: fontSize.base,
    color: '#7f8c8d',
    width: '100%',
    textAlign: 'center',
  },
  resendText: {
    fontSize: fontSize.md,
    color: '#3498db',
    fontWeight: '600',
  },
  changeNumberButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignSelf: 'center',
  },
  changeNumberText: {
    fontSize: fontSize.base,
    color: '#e74c3c',
    textDecorationLine: 'underline',
  },
});

export default OTPVerificationScreen;
