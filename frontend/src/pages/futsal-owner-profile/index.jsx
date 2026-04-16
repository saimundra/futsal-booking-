
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import ProfilePhotoUpload from '../user-profile/components/ProfilePhotoUpload';
import AccountSecurity from '../user-profile/components/AccountSecurity';
import BookingPreferences from '../user-profile/components/BookingPreferences';


const initialProfile = {
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  profile_photo: '',
  location: '',
  bio: '',
  notificationEmail: true,
  notificationSms: false,
  notificationPush: true
};

const FutsalOwnerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const profileCompletion = 85;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (photo) => {
    setProfile((prev) => ({ ...prev, profile_photo: photo }));
  };

  // Fetch profile on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    setLoading(true);
    fetch('http://localhost:8000/api/users/profile/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProfile({
          username: data.username || '',
          email: data.email || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          profile_photo: data.profile_photo || '',
          location: data.location || '',
          bio: data.bio || '',
          notificationEmail: data.notificationEmail ?? true,
          notificationSms: data.notificationSms ?? false,
          notificationPush: data.notificationPush ?? true
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch('http://localhost:8000/api/users/profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: 'User' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' }
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole="futsal_owner" onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pt-24 md:pt-28">
        {showSuccess && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <p className="text-sm text-success font-medium">Profile updated successfully!</p>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-h3 font-heading text-foreground mb-2">Futsal Owner Profile</h1>
          <p className="text-body text-muted-foreground">Manage your account information and preferences</p>
        </div>

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
                  avatar={profile?.profile_photo}
                  avatarAlt={profile?.first_name || profile?.username || 'Futsal Owner'}
                  onPhotoChange={handlePhotoChange}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    name="first_name"
                    value={profile?.first_name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="last_name"
                    value={profile?.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Input
                  label="Username"
                  name="username"
                  value={profile?.username}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profile?.email}
                  onChange={handleInputChange}
                  required
                  disabled
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={profile?.phone}
                  onChange={handleInputChange}
                />
                <Input
                  label="Location"
                  name="location"
                  value={profile?.location}
                  onChange={handleInputChange}
                />
                <Input
                  label="Bio"
                  name="bio"
                  value={profile?.bio}
                  onChange={handleInputChange}
                  multiline
                />
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/futsal-owner-dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleSave}
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
      </div>
    </div>
  );
};

export default FutsalOwnerProfile;
