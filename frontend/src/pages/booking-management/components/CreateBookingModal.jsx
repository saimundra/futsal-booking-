import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateBookingModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    courtId: '',
    date: '',
    startTime: '',
    duration: '1',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isChecking, setIsChecking] = useState(false);

  const courtOptions = [
    { value: 'court-1', label: 'Court 1 - Main Arena' },
    { value: 'court-2', label: 'Court 2 - Training Ground' },
    { value: 'court-3', label: 'Court 3 - Competition Court' },
    { value: 'court-4', label: 'Court 4 - Practice Field' }
  ];

  const durationOptions = [
    { value: '1', label: '1 Hour' },
    { value: '2', label: '2 Hours' },
    { value: '3', label: '3 Hours' },
    { value: '4', label: '4 Hours' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.customerName?.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData?.customerEmail?.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }

    if (!formData?.customerPhone?.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    }

    if (!formData?.courtId) {
      newErrors.courtId = 'Please select a court';
    }

    if (!formData?.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData?.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const checkAvailability = async () => {
    if (!formData?.courtId || !formData?.date || !formData?.startTime) {
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-athletic-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Create New Booking</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors duration-250"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4">Customer Information</h3>
            <div className="space-y-4">
              <Input
                label="Customer Name"
                type="text"
                placeholder="Enter customer name"
                value={formData?.customerName}
                onChange={(e) => handleChange('customerName', e?.target?.value)}
                error={errors?.customerName}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="customer@example.com"
                  value={formData?.customerEmail}
                  onChange={(e) => handleChange('customerEmail', e?.target?.value)}
                  error={errors?.customerEmail}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData?.customerPhone}
                  onChange={(e) => handleChange('customerPhone', e?.target?.value)}
                  error={errors?.customerPhone}
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-4">Booking Details</h3>
            <div className="space-y-4">
              <Select
                label="Select Court"
                options={courtOptions}
                value={formData?.courtId}
                onChange={(value) => handleChange('courtId', value)}
                placeholder="Choose a court"
                error={errors?.courtId}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Date"
                  type="date"
                  value={formData?.date}
                  onChange={(e) => handleChange('date', e?.target?.value)}
                  error={errors?.date}
                  required
                  min={new Date()?.toISOString()?.split('T')?.[0]}
                />

                <Input
                  label="Start Time"
                  type="time"
                  value={formData?.startTime}
                  onChange={(e) => handleChange('startTime', e?.target?.value)}
                  error={errors?.startTime}
                  required
                />

                <Select
                  label="Duration"
                  options={durationOptions}
                  value={formData?.duration}
                  onChange={(value) => handleChange('duration', value)}
                  required
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={checkAvailability}
                loading={isChecking}
                iconName="Search"
                iconPosition="left"
                fullWidth
              >
                Check Availability
              </Button>

              <Input
                label="Admin Notes (Optional)"
                type="text"
                placeholder="Add any special notes or instructions"
                value={formData?.notes}
                onChange={(e) => handleChange('notes', e?.target?.value)}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              iconName="Plus"
              iconPosition="left"
              className="flex-1"
            >
              Create Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingModal;