import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { fetchUserProfile, updateUserProfile } from '../../../services/api';


const BookingPreferences = () => {
  const [preferences, setPreferences] = useState({
    defaultCourtType: 'indoor',
    preferredTimeSlot: 'evening',
    defaultPlayers: '10'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        const userData = await fetchUserProfile(token);
        
        setPreferences({
          defaultCourtType: userData.preferred_court_type || 'indoor',
          preferredTimeSlot: userData.preferred_time_slot || 'evening',
          defaultPlayers: userData.default_players?.toString() || '10'
        });
      } catch (err) {
        console.error('Error loading preferences:', err);
        setErrorMessage('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const courtTypeOptions = [
    { value: 'indoor', label: 'Indoor Courts' },
    { value: 'outdoor', label: 'Outdoor Courts' },
    { value: 'any', label: 'No Preference' }
  ];

  const timeSlotOptions = [
    { value: 'morning', label: 'Morning (6AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
    { value: 'evening', label: 'Evening (6PM - 12AM)' },
    { value: 'any', label: 'Any Time' }
  ];

  const playerCountOptions = [
    { value: '5', label: '5 players' },
    { value: '6', label: '6 players' },
    { value: '7', label: '7 players' },
    { value: '8', label: '8 players' },
    { value: '10', label: '10 players' }
  ];

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');
      const token = localStorage.getItem('accessToken');
      
      const updateData = {
        preferred_court_type: preferences.defaultCourtType,
        preferred_time_slot: preferences.preferredTimeSlot,
        default_players: parseInt(preferences.defaultPlayers)
      };

      await updateUserProfile(updateData, token);
      
      setSuccessMessage('Preferences saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setErrorMessage('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
        <h3 className="text-lg font-semibold text-foreground mb-4">Default Booking Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Set your preferred defaults to speed up the booking process
        </p>

        <div className="space-y-6">
          <Select
            label="Preferred Court Type"
            options={courtTypeOptions}
            value={preferences?.defaultCourtType}
            onChange={(value) => setPreferences(prev => ({ ...prev, defaultCourtType: value }))}
            description="Your default court type preference for new bookings"
          />

          <Select
            label="Preferred Time Slot"
            options={timeSlotOptions}
            value={preferences?.preferredTimeSlot}
            onChange={(value) => setPreferences(prev => ({ ...prev, preferredTimeSlot: value }))}
            description="When you typically prefer to play"
          />

          <Select
            label="Default Number of Players"
            options={playerCountOptions}
            value={preferences?.defaultPlayers}
            onChange={(value) => setPreferences(prev => ({ ...prev, defaultPlayers: value }))}
            description="Your usual team size"
          />
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            iconName="CreditCard"
            iconPosition="left"
            className="justify-start"
          >
            Manage Payment Methods
          </Button>
          <Button
            variant="outline"
            iconName="Users"
            iconPosition="left"
            className="justify-start"
          >
            Manage Team Members
          </Button>
          <Button
            variant="outline"
            iconName="MapPin"
            iconPosition="left"
            className="justify-start"
          >
            Favorite Locations
          </Button>
          <Button
            variant="outline"
            iconName="Clock"
            iconPosition="left"
            className="justify-start"
          >
            Booking History
          </Button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          variant="default"
          onClick={handleSavePreferences}
          loading={isSaving}
          iconName="Save"
          iconPosition="left"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default BookingPreferences;