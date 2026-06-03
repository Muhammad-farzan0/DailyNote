import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export default function OAuthRedirect() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  const { setUser } = useAuth(); // we need to expose setUser in AuthContext

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      toast.error('OAuth login failed');
      navigate('/login');
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data); // update auth context immediately
          toast.success('Logged in successfully');
          navigate('/');
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          toast.error('Authentication failed');
          navigate('/login');
        });
    } else {
      toast.error('No token received');
      navigate('/login');
    }
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing login...</p>
      </div>
    </div>
  );
}