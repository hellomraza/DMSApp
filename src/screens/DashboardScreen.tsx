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
import FileSearchComponent from '../components/ui/FileSearchComponent';
import { useAuth } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import { fontSize, scale, spacing } from '../utils/scale';

const DashboardScreen = ({ navigation }: any) => {
  const { dispatch } = useAuth();

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

  const handleSearchResults = (results: any[]) => {
    console.log('Search results received:', results);
    // Handle search results if needed
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>File Search</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* File Search Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: scale(80) }}
      >
        <FileSearchComponent onSearchResults={handleSearchResults} />
      </ScrollView>

      {/* Floating Upload Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={navigateToUpload}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: scale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: scale(3),
    elevation: 3,
  },
  navbarTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: scale(6),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButtonText: {
    fontSize: fontSize.sm,
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: scale(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: scale(6),
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: fontSize.xxl,
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: fontSize.xxl,
  },
});

export default DashboardScreen;
