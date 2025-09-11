import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Convenience hooks for auth
export const useAuth = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  return {
    ...auth,
    dispatch,
  };
};
