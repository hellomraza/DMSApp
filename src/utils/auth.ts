import { store } from '../store';

// Helper function to get current auth token from Redux store
export const getCurrentToken = (): string | null => {
  return store.getState().auth.token;
};

// Helper function to check if user is authenticated
export const isUserAuthenticated = (): boolean => {
  return store.getState().auth.isAuthenticated;
};
