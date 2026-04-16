import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const OperatingHoursModal = ({ isOpen, onClose }) => {
  const [operatingHours, setOperatingHours] = useState({
    monday: { enabled: true, open: '08:00', close: '22:00' },
    tuesday: { enabled: true, open: '08:00', close: '22:00' },
    wednesday: { enabled: true, open: '08:00', close: '22:00' },
    thursday: { enabled: true, open: '08:00', close: '22:00' },
    friday: { enabled: true, open: '08:00', close: '23:00' },
    saturday: { enabled: true, open: '07:00', close: '23:00' },
    sunday: { enabled: true, open: '07:00', close: '21:00' }
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    console.log('Operating hours updated:', operatingHours);
    onClose();
  };

  const handleDayChange = (day, field, value) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: { ...prev?.[day], [field]: value }
    }));
  };

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-xl shadow-athletic-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Operating Hours</h2>
            <p className="text-sm text-muted-foreground mt-1">Configure daily operating hours for all courts</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          {days?.map((day) => (
            <div key={day?.key} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3 w-full sm:w-32">
                <Input
                  type="checkbox"
                  id={`${day?.key}-enabled`}
                  checked={operatingHours?.[day?.key]?.enabled}
                  onChange={(e) => handleDayChange(day?.key, 'enabled', e?.target?.checked)}
                />
                <label htmlFor={`${day?.key}-enabled`} className="text-sm font-semibold text-foreground cursor-pointer">
                  {day?.label}
                </label>
              </div>

              {operatingHours?.[day?.key]?.enabled ? (
                <div className="flex items-center gap-3 flex-1">
                  <Input
                    type="time"
                    value={operatingHours?.[day?.key]?.open}
                    onChange={(e) => handleDayChange(day?.key, 'open', e?.target?.value)}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={operatingHours?.[day?.key]?.close}
                    onChange={(e) => handleDayChange(day?.key, 'close', e?.target?.value)}
                    className="flex-1"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground italic">Closed</span>
              )}
            </div>
          ))}

          <div className="p-4 bg-secondary/10 border border-secondary rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-secondary mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Changes to operating hours will take effect immediately and update court availability across all booking interfaces.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth iconName="Clock" iconPosition="left">
              Save Operating Hours
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OperatingHoursModal;