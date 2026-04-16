import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PrivacySettings = () => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showBookingHistory: false,
    allowMessages: true,
    shareActivityStatus: false,
    dataCollection: true,
    marketingEmails: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (setting) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: !prev?.[setting] }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const privacyOptions = [
    {
      id: 'profileVisibility',
      title: 'Profile Visibility',
      description: 'Allow other users to view your profile information',
      icon: 'Eye'
    },
    {
      id: 'showBookingHistory',
      title: 'Show Booking History',
      description: 'Display your booking history on your public profile',
      icon: 'Calendar'
    },
    {
      id: 'allowMessages',
      title: 'Allow Messages',
      description: 'Let other users send you messages about bookings',
      icon: 'MessageSquare'
    },
    {
      id: 'shareActivityStatus',
      title: 'Share Activity Status',
      description: 'Show when you are actively using the platform',
      icon: 'Activity'
    },
    {
      id: 'dataCollection',
      title: 'Analytics & Performance',
      description: 'Help us improve by sharing usage data',
      icon: 'BarChart'
    },
    {
      id: 'marketingEmails',
      title: 'Marketing Communications',
      description: 'Receive promotional offers and updates',
      icon: 'Mail'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Privacy Controls</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Manage your privacy settings and control what information you share
        </p>

        <div className="space-y-4">
          {privacyOptions?.map((option) => (
            <div
              key={option?.id}
              className="flex items-start justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name={option?.icon} size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">{option?.title}</p>
                  <p className="text-xs text-muted-foreground">{option?.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(option?.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  privacySettings?.[option?.id] ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings?.[option?.id] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            className="w-full justify-start"
          >
            Download Your Data
          </Button>
          <Button
            variant="outline"
            iconName="FileText"
            iconPosition="left"
            className="w-full justify-start"
          >
            View Privacy Policy
          </Button>
          <Button
            variant="danger"
            iconName="Trash2"
            iconPosition="left"
            className="w-full justify-start"
          >
            Delete Account
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Deleting your account will permanently remove all your data and cannot be undone.
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          variant="default"
          onClick={handleSaveSettings}
          loading={isSaving}
          iconName="Save"
          iconPosition="left"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default PrivacySettings;