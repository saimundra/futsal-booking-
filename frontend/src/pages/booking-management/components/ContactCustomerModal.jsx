import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ContactCustomerModal = ({ booking, onClose, onSend }) => {
  const [formData, setFormData] = useState({
    method: 'email',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const methodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' }
  ];

  const templateOptions = [
    { value: '', label: 'Select a template (optional)' },
    { value: 'confirmation', label: 'Booking Confirmation' },
    { value: 'reminder', label: 'Booking Reminder' },
    { value: 'cancellation', label: 'Booking Cancellation' },
    { value: 'modification', label: 'Booking Modification' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTemplateSelect = (template) => {
    const templates = {
      confirmation: {
        subject: 'Booking Confirmation - FutsalBooker',
        message: `Dear ${booking?.customerName},\n\nYour booking has been confirmed!\n\nBooking Details:\nCourt: ${booking?.courtName}\nDate: ${booking?.date}\nTime: ${booking?.startTime}\n\nThank you for choosing FutsalBooker!`
      },
      reminder: {
        subject: 'Booking Reminder - FutsalBooker',
        message: `Dear ${booking?.customerName},\n\nThis is a reminder about your upcoming booking:\n\nCourt: ${booking?.courtName}\nDate: ${booking?.date}\nTime: ${booking?.startTime}\n\nWe look forward to seeing you!`
      },
      cancellation: {
        subject: 'Booking Cancellation - FutsalBooker',
        message: `Dear ${booking?.customerName},\n\nWe regret to inform you that your booking has been cancelled.\n\nBooking Details:\nCourt: ${booking?.courtName}\nDate: ${booking?.date}\nTime: ${booking?.startTime}\n\nPlease contact us if you have any questions.`
      },
      modification: {
        subject: 'Booking Modification - FutsalBooker',
        message: `Dear ${booking?.customerName},\n\nYour booking has been modified.\n\nUpdated Details:\nCourt: ${booking?.courtName}\nDate: ${booking?.date}\nTime: ${booking?.startTime}\n\nPlease review the changes.`
      }
    };

    if (template && templates?.[template]) {
      setFormData(prev => ({
        ...prev,
        subject: templates?.[template]?.subject,
        message: templates?.[template]?.message
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData?.method === 'email' && !formData?.subject?.trim()) {
      newErrors.subject = 'Subject is required for email';
    }

    if (!formData?.message?.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSend(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-athletic-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Contact Customer</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors duration-250"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="User" size={20} className="text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">{booking?.customerName}</p>
                <p className="text-sm text-muted-foreground">{booking?.customerEmail}</p>
                <p className="text-sm text-muted-foreground">{booking?.customerPhone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Select
              label="Contact Method"
              options={methodOptions}
              value={formData?.method}
              onChange={(value) => handleChange('method', value)}
              required
            />

            <Select
              label="Use Template"
              options={templateOptions}
              value=""
              onChange={handleTemplateSelect}
            />

            {formData?.method === 'email' && (
              <Input
                label="Subject"
                type="text"
                placeholder="Enter email subject"
                value={formData?.subject}
                onChange={(e) => handleChange('subject', e?.target?.value)}
                error={errors?.subject}
                required
              />
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData?.message}
                onChange={(e) => handleChange('message', e?.target?.value)}
                placeholder={formData?.method === 'email' ? 'Enter your message' : 'Enter SMS message (max 160 characters)'}
                rows={8}
                maxLength={formData?.method === 'sms' ? 160 : undefined}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
              />
              {errors?.message && (
                <p className="mt-1 text-sm text-destructive">{errors?.message}</p>
              )}
              {formData?.method === 'sms' && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {formData?.message?.length}/160 characters
                </p>
              )}
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
              iconName="Send"
              iconPosition="left"
              className="flex-1"
            >
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactCustomerModal;