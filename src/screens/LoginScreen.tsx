import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CustomButton, CustomTextInput } from '../components/ui';
import { useGenerateOTP } from '../hooks/useApi';
import { fontSize, scale, spacing } from '../utils/scale';

const LoginScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState<LoginFormData>({
    mobile_number: '',
  });
  const [errors, setErrors] = useState<{
    mobile_number?: string;
  }>({});
  const [touched, setTouched] = useState<{
    mobile_number?: boolean;
  }>({});
  const generateOTPMutation = useGenerateOTP();

  const validateMobileNumber = (mobile: string): string | undefined => {
    if (!mobile.trim()) {
      return 'Mobile number is required';
    }
    if (mobile.length < 10) {
      return 'Mobile number must be at least 10 digits';
    }
    if (mobile.length > 10) {
      return 'Mobile number must be exactly 10 digits';
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return 'Please enter a valid 10-digit mobile number';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: { mobile_number?: string } = {};
    
    const mobileError = validateMobileNumber(formData.mobile_number);
    if (mobileError) {
      newErrors.mobile_number = mobileError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMobileNumberChange = (text: string) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    
    setFormData({ ...formData, mobile_number: numericText });
    
    // Real-time validation if field has been touched
    if (touched.mobile_number) {
      const error = validateMobileNumber(numericText);
      setErrors(prev => ({ ...prev, mobile_number: error }));
    }
  };

  const handleMobileNumberBlur = () => {
    setTouched(prev => ({ ...prev, mobile_number: true }));
    const error = validateMobileNumber(formData.mobile_number);
    setErrors(prev => ({ ...prev, mobile_number: error }));
  };

  const handleGenerateOTP = async () => {
    // Mark field as touched and validate
    setTouched({ mobile_number: true });
    
    if (!validateForm()) {
      return;
    }

    generateOTPMutation.mutate(formData, {
      onSuccess: _response => {
        Alert.alert(
          'OTP Sent',
          `OTP has been sent to ${formData.mobile_number}`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('OTPVerification', {
                  mobile_number: formData.mobile_number,
                });
              },
            },
          ],
        );
      },
      onError: (error: any) => {
        console.log(error, 'OTP generation error');
        Alert.alert(
          'Error',
          error?.message || 'Failed to send OTP. Please try again.',
        );
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Document Management System</Text>
            <Text style={styles.subtitle}>Login to your account</Text>
          </View>

          <View style={styles.form}>
            <CustomTextInput
              label="Mobile Number"
              placeholder="Enter your mobile number"
              value={formData.mobile_number}
              onChangeText={handleMobileNumberChange}
              onBlur={handleMobileNumberBlur}
              keyboardType="numeric"
              maxLength={10}
              editable={!generateOTPMutation.isPending}
              error={touched.mobile_number ? errors.mobile_number : undefined}
              labelStyle={styles.label}
              inputStyle={styles.input}
            />

            <CustomButton
              title="Send OTP"
              onPress={handleGenerateOTP}
              loading={generateOTPMutation.isPending}
              disabled={
                generateOTPMutation.isPending ||
                !!errors.mobile_number ||
                !formData.mobile_number.trim()
              }
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
  form: {
    width: '100%',
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#2c3e50',
  },
  input: {
    height: scale(50),
    fontSize: fontSize.md,
  },
});

export default LoginScreen;
