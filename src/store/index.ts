import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import type { RootState } from '../types/global';
import authReducer from './slices/authSlice';

// Persist configuration
const persistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', 'userData', 'isAuthenticated'], // Only persist these fields
};

// Create persisted reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type { RootState };

export default store;
