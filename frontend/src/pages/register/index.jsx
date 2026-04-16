import React from 'react';
import AuthenticationLayout from '../../components/ui/AuthenticationLayout';
import RegistrationForm from './components/RegistrationForm';

const Register = () => {
  return (
    <AuthenticationLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">
            Join FutsalBooker
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Start booking your favorite futsal courts today
          </p>
        </div>

        <RegistrationForm />
        <div className="text-center pt-4">
          <button
            className="text-primary underline hover:text-primary/80 transition-colors text-sm"
            onClick={() => window.location.href = '/'}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </AuthenticationLayout>
  );
};

export default Register;