import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationPreferences = ({ onPreferencesChange }) => {
  const [preferences, setPreferences] = useState({
    emailConfirmation: true,
    smsConfirmation: true,
    emailReminder: true,
    smsReminder: false,
    emailUpdates: false
  });

  const handleChange = (key, value) => {
    const newPreferences = {
      ...preferences,
      [key]: value
    };
    setPreferences(newPreferences);
    if (onPreferencesChange) {
      onPreferencesChange(newPreferences);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-athletic p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Bell" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
            Notification Preferences
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Choose how you want to receive booking updates
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm md:text-base font-medium text-foreground mb-3">
            Booking Confirmation
          </h4>
          <div className="space-y-3">
            <Checkbox
              label="Email confirmation"
              description="Receive booking details via email"
              checked={preferences?.emailConfirmation}
              onChange={(e) => handleChange('emailConfirmation', e?.target?.checked)}
            />
            <Checkbox
              label="SMS confirmation"
              description="Get instant SMS notification"
              checked={preferences?.smsConfirmation}
              onChange={(e) => handleChange('smsConfirmation', e?.target?.checked)}
            />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="text-sm md:text-base font-medium text-foreground mb-3">
            Booking Reminders
          </h4>
          <div className="space-y-3">
            <Checkbox
              label="Email reminder"
              description="Reminder 24 hours before booking"
              checked={preferences?.emailReminder}
              onChange={(e) => handleChange('emailReminder', e?.target?.checked)}
            />
            <Checkbox
              label="SMS reminder"
              description="Text reminder 2 hours before"
              checked={preferences?.smsReminder}
              onChange={(e) => handleChange('smsReminder', e?.target?.checked)}
            />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="text-sm md:text-base font-medium text-foreground mb-3">
            Marketing
          </h4>
          <Checkbox
            label="Promotional emails"
            description="Receive special offers and updates"
            checked={preferences?.emailUpdates}
            onChange={(e) => handleChange('emailUpdates', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="mt-4 bg-muted/50 rounded-lg p-3 flex items-start gap-2">
        <Icon name="Info" size={16} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-muted-foreground">
          You can update these preferences anytime in your account settings
        </p>
      </div>
    </div>
  );
};

export default NotificationPreferences;