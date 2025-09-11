import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, UserData } from '../../types/global';

// Initial state
const initialState: AuthState = {
  token: null,
  userData: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; userData: UserData }>,
    ) => {
      state.token = action.payload.token;
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: state => {
      state.token = null;
      state.userData = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { loginSuccess, logout, clearError, setError, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
