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

const LoginScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState<LoginFormData>({
    mobile_number: '',
  });
  const generateOTPMutation = useGenerateOTP();

  const validateMobileNumber = (mobile: string): boolean => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleGenerateOTP = async () => {
    if (!formData.mobile_number.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    if (!validateMobileNumber(formData.mobile_number)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
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
        console.log(error, 'sdfkljh');
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
              onChangeText={(text: string) =>
                setFormData({ ...formData, mobile_number: text })
              }
              keyboardType="numeric"
              maxLength={10}
              editable={!generateOTPMutation.isPending}
              labelStyle={styles.label}
              inputStyle={styles.input}
            />

            <CustomButton
              title="Send OTP"
              onPress={handleGenerateOTP}
              loading={generateOTPMutation.isPending}
              disabled={generateOTPMutation.isPending}
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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  input: {
    height: 50,
    fontSize: 16,
  },
});

export default LoginScreen;
