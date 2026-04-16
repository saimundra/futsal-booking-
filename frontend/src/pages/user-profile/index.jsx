import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { fetchUserProfile, updateUserProfile } from '../../services/api';

import Icon from '../../components/AppIcon';
import ProfilePhotoUpload from './components/ProfilePhotoUpload';
import AccountSecurity from './components/AccountSecurity';
import BookingPreferences from './components/BookingPreferences';


const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    avatarAlt: '',
    notificationEmail: true,
    notificationSms: false,
    notificationPush: true
  });

  const [userRole, setUserRole] = useState('player');

  const profileCompletion = 85;

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const userData = await fetchUserProfile(token);
        
        // Get user data from localStorage as backup for role
        const storedUser = localStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        
        setUserRole(userData.role || parsedUser?.role || 'player');
        
        setProfileData({
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          avatar: userData.profile_photo || '',
          avatarAlt: `${userData.first_name} ${userData.last_name}`,
          notificationEmail: userData.email_notifications !== undefined ? userData.email_notifications : true,
          notificationSms: userData.sms_notifications !== undefined ? userData.sms_notifications : false,
          notificationPush: userData.push_notifications !== undefined ? userData.push_notifications : true
        });
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load user profile. Please try again.');
        
        // If unauthorized, redirect to login
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      
      const updateData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        email_notifications: profileData.notificationEmail,
        sms_notifications: profileData.notificationSms,
        push_notifications: profileData.notificationPush
      };

      await updateUserProfile(updateData, token);
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: 'User' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole={userRole} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pt-24 md:pt-28">
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <p className="text-sm text-success font-medium">Profile updated successfully!</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
            <Icon name="AlertCircle" size={20} className="text-destructive" />
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-h3 font-heading text-foreground mb-2 mt-10">User Profile</h1>
              <p className="text-body text-muted-foreground">Manage your account information and preferences</p>
            </div>

        {profileCompletion < 100 && (
          <div className="mb-6 p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Profile Completion</p>
              <p className="text-sm font-semibold text-primary">{profileCompletion}%</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Complete your profile for better booking experience</p>
          </div>
        )}

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="border-b border-border overflow-x-auto">
            <div className="flex min-w-max">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors duration-250 border-b-2 ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <ProfilePhotoUpload 
                  avatar={profileData?.avatar}
                  avatarAlt={profileData?.avatarAlt}
                  onPhotoChange={(newAvatar) => setProfileData(prev => ({ ...prev, avatar: newAvatar }))}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={profileData?.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={profileData?.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileData?.email}
                  onChange={handleInputChange}
                  required
                  description="This email will be used for booking confirmations"
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={profileData?.phone}
                  onChange={handleInputChange}
                  description="For booking notifications and updates"
                />


                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/court-booking-dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleSaveProfile}
                    loading={isSaving}
                    iconName="Save"
                    iconPosition="left"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => alert('Delete profile functionality goes here')}
                    className="ml-3"
                  >
                    Delete Profile
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'security' && <AccountSecurity />}
            {activeTab === 'preferences' && <BookingPreferences />}

          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;