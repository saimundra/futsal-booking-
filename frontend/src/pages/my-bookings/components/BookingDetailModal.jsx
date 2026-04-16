import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedModal } from '../../../components/animations/AnimatedCard';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';

const BookingDetailModal = ({ booking, onClose, onCancel, onRebook }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const canCancel = booking?.status === 'confirmed';
  const canRebook = booking?.status === 'completed' || booking?.status === 'cancelled';
  
  if (!booking) return null;

  return (
    <AnimatePresence>
      <AnimatedModal isOpen={!!booking} onClose={onClose}>
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <AppImage
              src={booking?.courtImage}
              alt={booking?.courtImageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{booking?.courtName}</h3>
            <p className="text-muted-foreground">{booking?.facilityName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Booking ID</p>
              <p className="text-sm font-semibold text-foreground">{booking?.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-sm font-semibold text-foreground capitalize">{booking?.status}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Payment Status</p>
              <p className="text-sm font-semibold text-foreground capitalize">{booking?.paymentStatus}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
              <p className="text-sm font-semibold text-foreground">${booking?.price?.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Booking Information</h4>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Calendar" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-foreground">{formatDate(booking?.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Clock" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-medium text-foreground">{booking?.startTime} - {booking?.endTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Timer" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium text-foreground">{booking?.duration} hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Users" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Number of Players</p>
                <p className="text-sm font-medium text-foreground">{booking?.players} players</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="MapPin" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Court Type</p>
                <p className="text-sm font-medium text-foreground capitalize">{booking?.courtType}</p>
              </div>
            </div>
          </div>

          {booking?.cancellationReason && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-error mb-1">Cancellation Reason</p>
                  <p className="text-sm text-muted-foreground">{booking?.cancellationReason}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            {canCancel && (
              <Button
                variant="danger"
                iconName="XCircle"
                iconPosition="left"
                onClick={() => {
                  onCancel?.(booking?.id);
                  onClose();
                }}
              >
                Cancel Booking
              </Button>
            )}

            {canRebook && (
              <Button
                variant="default"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => {
                  onRebook?.(booking);
                  onClose();
                }}
              >
                Rebook Court
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </AnimatedModal>
    </AnimatePresence>
  );
};

export default BookingDetailModal;