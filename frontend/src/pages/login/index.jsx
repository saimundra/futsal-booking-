
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationLayout from '../../components/ui/AuthenticationLayout';
import LoginForm from './components/LoginForm';
import { loginUser } from '../../services/api';
import { useToast } from '../../components/animations/Toast';


const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const toast = useToast();
  
  const handleLogin = async (credentials) => {
    setError('');
    try {
      // Backend expects email and password
      const response = await loginUser({
        email: credentials.email,
        password: credentials.password
      });
      // Store JWT and user info in localStorage
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('userEmail', response.user.email);
      localStorage.setItem('userName', response.user.first_name + ' ' + response.user.last_name);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Show success toast
      toast.success(`Welcome back, ${response.user.first_name}!`);
      
      // Redirect by role
      setTimeout(() => {
        if (response.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (response.user.role === 'futsal_owner') {
          navigate('/futsal-owner-dashboard');
        } else {
          navigate('/futsal-venues');
        }
      }, 500);
    } catch (err) {
      setError('Invalid email or password');
      toast.error('Invalid email or password. Please try again.');
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
        <LoginForm onSubmit={handleLogin} error={error} />
        <div className="text-center pt-4">
          <button
            className="text-primary underline hover:text-primary/80 transition-colors text-sm"
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