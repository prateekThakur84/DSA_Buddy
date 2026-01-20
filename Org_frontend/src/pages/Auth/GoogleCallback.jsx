import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../../store/slices/authSlice';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store token from Google OAuth callback
      localStorage.setItem('authToken', token);
      
      // Verify authentication
      dispatch(checkAuth()).then(() => {
        navigate('/');
      });
    } else {
      // No token, redirect to login with error
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
