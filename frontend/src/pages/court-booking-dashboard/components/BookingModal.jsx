import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedModal } from '../../../components/animations/AnimatedCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BookingModal = ({ isOpen, onClose, bookingDetails, onConfirm }) => {
  const [formData, setFormData] = useState({
    bookingDate: new Date().toISOString().split('T')[0],
    timeSlot: '',
    playerCount: '10',
    duration: '1',
    notes: ''
  });

  // Generate time slots from 6 AM to 8 PM with hour ranges
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 20; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      slots.push({
        value: startTime,
        label: `${startTime} - ${endTime}`
      });
    }
    return slots;
  };

  const timeSlotOptions = generateTimeSlots();

  const playerOptions = [
    { value: '5', label: '5 Players' },
    { value: '6', label: '6 Players' },
    { value: '7', label: '7 Players' },
    { value: '8', label: '8 Players' },
    { value: '9', label: '9 Players' },
    { value: '10', label: '10 Players' }
  ];

  const hourlyRate = parseFloat(bookingDetails?.hourlyRate || 0);
  
  const durationOptions = [
    { value: '1', label: `1 Hour - NPR ${hourlyRate.toFixed(2)}` },
    { value: '1.5', label: `1.5 Hours - NPR ${(hourlyRate * 1.5).toFixed(2)}` },
    { value: '2', label: `2 Hours - NPR ${(hourlyRate * 2).toFixed(2)}` }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    if (!formData.bookingDate) {
      alert('Please select a booking date');
      return;
    }
    if (!formData.timeSlot) {
      alert('Please select a time slot');
      return;
    }
    if (onConfirm) {
      onConfirm({ ...bookingDetails, ...formData });
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <AnimatedModal isOpen={isOpen} onClose={onClose}>
          <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">Confirm Booking</h2>
              <p className="text-sm text-muted-foreground mt-1">Review and complete your reservation</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-250"
              aria-label="Close modal"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

        <div className="p-4 md:p-6 space-y-6">
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="Dribbble" size={24} color="white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{bookingDetails?.courtName || 'Court'}</h3>
                <p className="text-sm text-muted-foreground">{bookingDetails?.futsalName || ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={16} className="text-primary" />
                <span className="text-sm text-foreground">{bookingDetails?.courtType || 'Court Type'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Layers" size={16} className="text-primary" />
                <span className="text-sm text-foreground">{bookingDetails?.surfaceType || 'Surface'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Booking Date"
              type="date"
              value={formData?.bookingDate}
              onChange={(e) => handleInputChange('bookingDate', e?.target?.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              description="Select your preferred date"
            />

            <Select
              label="Time Slot"
              options={timeSlotOptions}
              value={formData?.timeSlot}
              onChange={(value) => handleInputChange('timeSlot', value)}
              required
              placeholder="Select a time slot"
            />

            <Select
              label="Number of Players"
              options={playerOptions}
              value={formData?.playerCount}
              onChange={(value) => handleInputChange('playerCount', value)}
              required
            />

            <Select
              label="Booking Duration"
              options={durationOptions}
              value={formData?.duration}
              onChange={(value) => handleInputChange('duration', value)}
              required
            />

            <Input
              label="Additional Notes"
              type="text"
              placeholder="Any special requirements or requests..."
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              description="Optional: Add any special requests or requirements"
            />
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Court Fee (per hour)</span>
              <span className="text-foreground font-medium">NPR {hourlyRate.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="text-foreground font-medium">{formData?.duration} hour(s)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground font-medium">NPR {(hourlyRate * parseFloat(formData?.duration || 1)).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Service Fee (5%)</span>
              <span className="text-foreground font-medium">NPR {(hourlyRate * parseFloat(formData?.duration || 1) * 0.05).toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-foreground">Total Amount</span>
                <span className="text-xl font-bold text-primary">NPR {(hourlyRate * parseFloat(formData?.duration || 1) * 1.05).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleConfirm}
              iconName="CheckCircle"
              iconPosition="left"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
        </AnimatedModal>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;