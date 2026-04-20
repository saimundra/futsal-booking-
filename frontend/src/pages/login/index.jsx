
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationLayout from '../../components/ui/AuthenticationLayout';
import LoginForm from './components/LoginForm';
import { loginUser, googleAuthUser } from '../../services/api';
import { useToast } from '../../components/animations/Toast';


const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const toast = useToast();

  const completeAuth = (response) => {
    localStorage.setItem('accessToken', response.access);
    localStorage.setItem('refreshToken', response.refresh);
    localStorage.setItem('userRole', response.user.role);
    localStorage.setItem('userEmail', response.user.email);
    localStorage.setItem('userName', response.user.first_name + ' ' + response.user.last_name);
    localStorage.setItem('user', JSON.stringify(response.user));

    if (response.user.role === 'admin') {
      localStorage.setItem('adminAccessToken', response.access);
      localStorage.setItem('adminRefreshToken', response.refresh);
    } else {
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');
    }

    setTimeout(() => {
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else if (response.user.role === 'futsal_owner') {
        navigate('/futsal-owner-dashboard');
      } else {
        navigate('/futsal-venues');
      }
    }, 500);
  };
  
  const handleLogin = async (credentials) => {
    setError('');
    try {
      // Backend expects email and password
      const response = await loginUser({
        email: credentials.email,
        password: credentials.password
      });
      completeAuth(response);
      
      // Show success toast
      toast.success(`Welcome back, ${response.user.first_name}!`);
    } catch (err) {
      try {
        const parsed = JSON.parse(err?.message || '{}');
        const errorMessage = parsed.error || 'Invalid email or password';
        setError(errorMessage);
        toast.error(errorMessage);
      } catch {
        setError('Invalid email or password');
        toast.error('Invalid email or password. Please try again.');
      }
    }
  };

  const handleGoogleAuth = async (credential) => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const response = await googleAuthUser(credential);
      completeAuth(response);
      toast.success(`Welcome, ${response.user.first_name || 'Player'}!`);
    } catch (err) {
      setError('Google login failed. Please try again.');
      toast.error('Google login failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthenticationLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Sign in to access your futsal booking dashboard
          </p>
        </div>
        <LoginForm
          onSubmit={handleLogin}
          onGoogleAuth={handleGoogleAuth}
          isGoogleLoading={isGoogleLoading}
          error={error}
        />
        <div className="text-center pt-4">
          <button
            className="text-primary hover:text-primary/80 transition-colors text-sm"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </AuthenticationLayout>
  );
};

export default Login;