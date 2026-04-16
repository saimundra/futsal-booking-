import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const EditBookingModal = ({ booking, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    courtId: '',
    date: '',
    startTime: '',
    duration: '1',
    status: '',
    paymentStatus: '',
    notes: '',
    notifyCustomer: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (booking) {
      setFormData({
        customerName: booking?.customerName,
        customerEmail: booking?.customerEmail,
        customerPhone: booking?.customerPhone,
        courtId: booking?.courtId,
        date: booking?.date,
        startTime: booking?.startTime,
        duration: booking?.duration?.toString(),
        status: booking?.status,
        paymentStatus: booking?.paymentStatus,
        notes: booking?.notes || '',
        notifyCustomer: false
      });
    }
  }, [booking]);

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

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'failed', label: 'Failed' }
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

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit({ ...booking, ...formData });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-athletic-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Edit Booking</h2>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Booking Status"
                  options={statusOptions}
                  value={formData?.status}
                  onChange={(value) => handleChange('status', value)}
                  required
                />

                <Select
                  label="Payment Status"
                  options={paymentStatusOptions}
                  value={formData?.paymentStatus}
                  onChange={(value) => handleChange('paymentStatus', value)}
                  required
                />
              </div>

              <Input
                label="Admin Notes"
                type="text"
                placeholder="Add any special notes or instructions"
                value={formData?.notes}
                onChange={(e) => handleChange('notes', e?.target?.value)}
              />

              <Checkbox
                label="Notify customer about changes via email"
                checked={formData?.notifyCustomer}
                onChange={(e) => handleChange('notifyCustomer', e?.target?.checked)}
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
              iconName="Save"
              iconPosition="left"
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;