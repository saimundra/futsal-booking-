import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CancellationModal = ({ isOpen, onClose, booking, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (onConfirm) {
        onConfirm(booking?.id, reason);
      }
      setIsProcessing(false);
    }, 1500);
  };

  if (!isOpen) return null;

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-athletic-2xl w-full max-w-md">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
              <Icon name="AlertTriangle" size={32} className="text-error" />
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-foreground text-center mb-2">
            Cancel Booking?
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>

          {booking && (
            <div className="bg-muted rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="Dribbble" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{booking?.courtName}</h3>
                  <p className="text-xs text-muted-foreground">{formatDate(booking?.date)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span className="text-foreground">{booking?.startTime} - {booking?.endTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="DollarSign" size={14} className="text-muted-foreground" />
                  <span className="text-foreground font-medium">NPR {booking?.price}</span>
                </div>
              </div>
            </div>
          )}

          <Input
            label="Cancellation Reason (Optional)"
            type="text"
            placeholder="Please provide a reason for cancellation..."
            value={reason}
            onChange={(e) => setReason(e?.target?.value)}
            className="mb-6"
          />

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-warning flex-shrink-0 mt-0.5" />
              <div className="text-xs text-foreground">
                <p className="font-medium mb-1">Cancellation Policy</p>
                <p className="text-muted-foreground">
                  Cancellations made 24 hours before the booking time will receive a full refund. 
                  Cancellations within 24 hours may incur a 50% cancellation fee.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={onClose}
              disabled={isProcessing}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              fullWidth
              onClick={handleConfirm}
              loading={isProcessing}
              iconName="X"
              iconPosition="left"
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;