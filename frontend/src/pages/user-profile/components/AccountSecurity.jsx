import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { changePassword } from '../../../services/api';

const AccountSecurity = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      // Validation
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setErrorMessage('All fields are required');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setErrorMessage('New passwords do not match');
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setErrorMessage('Password must be at least 8 characters long');
        return;
      }

      setIsChangingPassword(true);
      const token = localStorage.getItem('accessToken');

      const response = await changePassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password2: passwordData.confirmPassword
      }, token);

      setSuccessMessage(response.message || 'Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Error changing password:', err);
      setErrorMessage(err.message || 'Failed to change password. Please check your current password and try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {successMessage && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <p className="text-sm text-success font-medium">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
          <Icon name="AlertCircle" size={20} className="text-destructive" />
          <p className="text-sm text-destructive font-medium">{errorMessage}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Change Password</h3>
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={passwordData?.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e?.target?.value }))}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={showCurrentPassword ? 'EyeOff' : 'Eye'} size={20} />
            </button>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData?.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e?.target?.value }))}
              description="Must be at least 8 characters with uppercase, lowercase, and numbers"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={showNewPassword ? 'EyeOff' : 'Eye'} size={20} />
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordData?.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e?.target?.value }))}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
            </button>
          </div>

          <Button
            variant="default"
            onClick={handlePasswordChange}
            loading={isChangingPassword}
            iconName="Lock"
            iconPosition="left"
          >
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;