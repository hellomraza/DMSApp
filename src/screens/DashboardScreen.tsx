import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import { fontSize, scale, spacing } from '../utils/scale';

const DashboardScreen = ({ navigation }: any) => {
  const { userData, dispatch } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // Dispatch logout action (no async needed as it's just a synchronous action now)
          dispatch(logout());

          // Navigate to login screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const navigateToUpload = () => {
    navigation.navigate('FileUpload');
  };

  const navigateToSearch = () => {
    navigation.navigate('DocumentSearch');
  };

  const navigateToDocuments = () => {
    navigation.navigate('DocumentList');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Document Management</Text>
          <Text style={styles.subtitle}>Welcome back!</Text>
          {userData && (
            <Text style={styles.userInfo}>
              Mobile: {userData.mobile_number}
            </Text>
          )}
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToUpload}>
            <Text style={styles.menuIcon}>📄</Text>
            <Text style={styles.menuTitle}>Upload Document</Text>
            <Text style={styles.menuDescription}>
              Upload and tag new documents
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={navigateToSearch}>
            <Text style={styles.menuIcon}>🔍</Text>
            <Text style={styles.menuTitle}>Search Documents</Text>
            <Text style={styles.menuDescription}>
              Find documents by tags or content
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToDocuments}
          >
            <Text style={styles.menuIcon}>📋</Text>
            <Text style={styles.menuTitle}>My Documents</Text>
            <Text style={styles.menuDescription}>
              View and manage your documents
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuTitle, styles.logoutText]}>Logout</Text>
            <Text style={[styles.menuDescription, styles.logoutText]}>
              Sign out of your account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: '#ecf0f1',
    marginBottom: spacing.xs,
  },
  userInfo: {
    fontSize: fontSize.base,
    color: '#ecf0f1',
  },
  menuContainer: {
    padding: spacing.md,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderRadius: scale(12),
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: scale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: scale(3),
    elevation: 3,
  },
  logoutItem: {
    borderWidth: 1,
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  menuIcon: {
    fontSize: fontSize.huge,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  menuTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  menuDescription: {
    fontSize: fontSize.base,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  logoutText: {
    color: '#e74c3c',
  },
});

export default DashboardScreen;
