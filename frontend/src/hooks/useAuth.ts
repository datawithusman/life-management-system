import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth, logout } from '../store/authSlice';
import { authAPI } from '../services/api';
import { RootState } from '../store/store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      dispatch(setAuth({ token: response.data.token, user: response.data.user }));
      navigate('/dashboard');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (username: string, email: string, password: string, fullName: string) => {
    try {
      const response = await authAPI.register({ username, email, password, fullName });
      dispatch(setAuth({ token: response.data.token, user: response.data.user }));
      navigate('/dashboard');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return { token, user, isAuthenticated, login, register, logout: handleLogout };
};
