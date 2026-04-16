import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import { registerUser } from '../../../services/api';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '', // NEW
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'player',
    emailNotifications: true,
    smsNotifications: false,
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const mockCredentials = {
    existingEmail: 'player@futsalbooker.com',
    validationRules: {
      minPasswordLength: 8,
      requireUppercase: true,
      requireNumber: true,
      requireSpecialChar: true
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (password?.length >= 12) strength += 25;
    if (/[A-Z]/?.test(password)) strength += 15;
    if (/[a-z]/?.test(password)) strength += 10;
    if (/[0-9]/?.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/?.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-error';
    if (passwordStrength < 70) return 'bg-warning';
    return 'bg-success';
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      // Check if email already exists in registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (registeredUsers.some(user => user.email === formData?.email)) {
        newErrors.email = 'This email is already registered. Please login instead.';
      }
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else {
      if (formData?.password?.length < mockCredentials?.validationRules?.minPasswordLength) {
        newErrors.password = `Password must be at least ${mockCredentials?.validationRules?.minPasswordLength} characters`;
      }
      if (mockCredentials?.validationRules?.requireUppercase && !/[A-Z]/?.test(formData?.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      }
      if (mockCredentials?.validationRules?.requireNumber && !/[0-9]/?.test(formData?.password)) {
        newErrors.password = 'Password must contain at least one number';
      }
      if (mockCredentials?.validationRules?.requireSpecialChar && !/[^A-Za-z0-9]/?.test(formData?.password)) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateStep2()) return;
    setIsLoading(true);
    try {
      await registerUser({
        full_name: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password2: formData.confirmPassword,
        role: formData.role,
      });
      setIsLoading(false);
      navigate('/login', {
        state: {
          message: 'Registration successful! Please login with your credentials.',
          email: formData.email
        }
      });
    } catch (err) {
      setIsLoading(false);
      setErrors({ api: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
      {currentStep === 1 && (
        <div className="space-y-4 md:space-y-5">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              Personal Info
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Enter your personal information to get started
            </p>
          </div>

          <Input
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData?.fullName}
            onChange={handleInputChange}
            error={errors?.fullName}
            required
          />

          <Input
            label="Username"
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData?.username}
            onChange={handleInputChange}
            error={errors?.username}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="youremail@gmail.com"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="+977 (1234567890)"
            value={formData?.phone}
            onChange={handleInputChange}
            error={errors?.phone}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Register as</label>
            <div className="flex gap-4">
              <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${formData.role === 'player' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                <input
                  type="radio"
                  name="role"
                  value="player"
                  checked={formData.role === 'player'}
                  onChange={handleInputChange}
                  className="accent-primary"
                />
                Player
              </label>
              <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${formData.role === 'futsal_owner' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                <input
                  type="radio"
                  name="role"
                  value="futsal_owner"
                  checked={formData.role === 'futsal_owner'}
                  onChange={handleInputChange}
                  className="accent-primary"
                />
                Futsal Owner
              </label>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleNextStep}
            iconName="ArrowRight"
            iconPosition="right"
            className="mt-6 md:mt-8 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-primary/90 focus:bg-primary/90 focus:ring-2 focus:ring-primary hover:text-white text-black"
            style={{ boxShadow: '0 4px 24px 0 rgba(45, 90, 39, 0.25)' }}
          >
            Continue
          </Button>
        </div>
      )}
      {currentStep === 2 && (
        <div className="space-y-4 md:space-y-5">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              Secure Your Account
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Create a strong password to protect your account
            </p>
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData?.password}
              onChange={handleInputChange}
              error={errors?.password}
              required
            />
            {formData?.password && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Password Strength
                  </span>
                  <span className={`text-xs md:text-sm font-medium ${
                    passwordStrength < 40 ? 'text-error' :
                    passwordStrength < 70 ? 'text-warning' : 'text-success'
                  }`}>
                    {getPasswordStrengthLabel()}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-250 ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            error={errors?.confirmPassword}
            required
          />

          <div className="space-y-3 pt-2">
            <Checkbox
              label={
                <span>
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-primary hover:text-secondary transition-colors duration-250"
                    onClick={(e) => {
                      e?.preventDefault();
                    }}
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    className="text-primary hover:text-secondary transition-colors duration-250"
                    onClick={(e) => {
                      e?.preventDefault();
                    }}
                  >
                    Privacy Policy
                  </button>
                </span>
              }
              checked={formData?.termsAccepted}
              onChange={(e) => handleInputChange({
                target: { name: 'termsAccepted', type: 'checkbox', checked: e?.target?.checked }
              })}
              error={errors?.termsAccepted}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handlePreviousStep}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              iconName="CheckCircle"
              iconPosition="right"
              className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-primary/90 focus:bg-primary/90 focus:ring-2 focus:ring-primary hover:text-white text-black"
              style={{ boxShadow: '0 4px 24px 0 rgba(45, 90, 39, 0.25)' }}
            >
              Create Account
            </Button>
          </div>
        </div>
      )}
      {errors.api && (
        <div className="text-error text-center text-sm mb-2">{errors.api}</div>
      )}
      <div className="text-center mt-6">
        <p className="text-sm md:text-base text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-medium text-primary hover:text-secondary transition-colors duration-250"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;