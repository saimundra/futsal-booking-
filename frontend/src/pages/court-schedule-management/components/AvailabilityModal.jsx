import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AvailabilityModal = ({ isOpen, onClose, courts }) => {
  const [formData, setFormData] = useState({
    court: '',
    startDate: '',
    endDate: '',
    startTime: '08:00',
    endTime: '20:00',
    recurring: false,
    recurringPattern: 'daily'
  });

  if (!isOpen) return null;

  const courtOptions = courts?.map(court => ({
    value: court?.id,
    label: court?.name
  }));

  const recurringOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekdays', label: 'Weekdays' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'weekly', label: 'Weekly' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    console.log('Availability settings:', formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-xl shadow-athletic-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Set Court Availability</h2>
            <p className="text-sm text-muted-foreground mt-1">Configure available time blocks for court bookings</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          <Select
            label="Court"
            options={courtOptions}
            value={formData?.court}
            onChange={(value) => handleChange('court', value)}
            placeholder="Select court"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={formData?.startDate}
              onChange={(e) => handleChange('startDate', e?.target?.value)}
              required
            />
            <Input
              type="date"
              label="End Date"
              value={formData?.endDate}
              onChange={(e) => handleChange('endDate', e?.target?.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="time"
              label="Start Time"
              value={formData?.startTime}
              onChange={(e) => handleChange('startTime', e?.target?.value)}
              required
            />
            <Input
              type="time"
              label="End Time"
              value={formData?.endTime}
              onChange={(e) => handleChange('endTime', e?.target?.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Input
              type="checkbox"
              id="recurring"
              checked={formData?.recurring}
              onChange={(e) => handleChange('recurring', e?.target?.checked)}
            />
            <label htmlFor="recurring" className="text-sm font-medium text-foreground cursor-pointer">
              Make this a recurring availability block
            </label>
          </div>

          {formData?.recurring && (
            <Select
              label="Recurring Pattern"
              options={recurringOptions}
              value={formData?.recurringPattern}
              onChange={(value) => handleChange('recurringPattern', value)}
            />
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth iconName="Check" iconPosition="left">
              Save Availability
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvailabilityModal;