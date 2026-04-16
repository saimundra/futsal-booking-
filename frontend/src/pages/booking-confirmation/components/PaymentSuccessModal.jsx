import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentSuccessModal = ({ isOpen, bookingReference, onClose, onViewBooking }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-2xl shadow-athletic-2xl max-w-md w-full p-6 md:p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-4 md:space-y-6">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-success flex items-center justify-center">
            <Icon name="CheckCircle" size={40} color="white" />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Payment Successful!
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Your court booking has been confirmed
            </p>
          </div>

          <div className="bg-muted rounded-xl p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-2">
              Booking Reference
            </p>
            <p className="text-lg md:text-xl lg:text-2xl font-bold text-primary">
              {bookingReference}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm md:text-base text-muted-foreground">
              <Icon name="Mail" size={20} color="var(--color-success)" />
              <span>Confirmation email sent</span>
            </div>
            <div className="flex items-center gap-3 text-sm md:text-base text-muted-foreground">
              <Icon name="MessageSquare" size={20} color="var(--color-success)" />
              <span>SMS notification sent</span>
            </div>
            <div className="flex items-center gap-3 text-sm md:text-base text-muted-foreground">
              <Icon name="Calendar" size={20} color="var(--color-success)" />
              <span>Added to your bookings</span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={onViewBooking}
              iconName="Eye"
              iconPosition="left"
            >
              View Booking Details
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;