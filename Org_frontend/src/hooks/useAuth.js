import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, registerUser } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginUser(credentials));
  const logout = () => dispatch(logoutUser());
  const register = (userData) => dispatch(registerUser(userData));

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register,
  };
};
