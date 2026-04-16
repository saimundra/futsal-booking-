import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const MaintenanceModal = ({ isOpen, onClose, courts }) => {
  const [formData, setFormData] = useState({
    court: '',
    startDate: '',
    endDate: '',
    startTime: '08:00',
    endTime: '12:00',
    reason: '',
    notifyCustomers: true
  });

  if (!isOpen) return null;

  const courtOptions = courts?.map(court => ({
    value: court?.id,
    label: court?.name
  }));

  const handleSubmit = (e) => {
    e?.preventDefault();
    console.log('Maintenance scheduled:', formData);
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
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Schedule Maintenance</h2>
            <p className="text-sm text-muted-foreground mt-1">Plan maintenance periods and notify affected customers</p>
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

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Maintenance Reason</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Describe the maintenance work..."
              value={formData?.reason}
              onChange={(e) => handleChange('reason', e?.target?.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning rounded-lg">
            <Input
              type="checkbox"
              id="notifyCustomers"
              checked={formData?.notifyCustomers}
              onChange={(e) => handleChange('notifyCustomers', e?.target?.checked)}
            />
            <label htmlFor="notifyCustomers" className="text-sm font-medium text-foreground cursor-pointer">
              Notify customers with affected bookings
            </label>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Scheduling maintenance will automatically check for booking conflicts. Affected customers will be notified if the option is enabled.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="warning" fullWidth iconName="Settings" iconPosition="left">
              Schedule Maintenance
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;