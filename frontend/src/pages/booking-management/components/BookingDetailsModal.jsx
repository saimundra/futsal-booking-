import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingDetailsModal = ({ booking, onClose, onEdit, onContact }) => {
  if (!booking) return null;

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors?.[status] || colors?.pending;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors?.[status] || colors?.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString?.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-athletic-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors duration-250"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4 pb-6 border-b border-border">
            <Image
              src={booking?.customerAvatar}
              alt={booking?.customerAvatarAlt}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">{booking?.customerName}</h3>
              <p className="text-sm text-muted-foreground mb-2">{booking?.customerEmail}</p>
              <p className="text-sm text-muted-foreground">{booking?.customerPhone}</p>
            </div>
            <div className="flex gap-2">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(booking?.status)}`}>
                {booking?.status?.charAt(0)?.toUpperCase() + booking?.status?.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Booking Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Booking ID</p>
                  <p className="text-sm font-medium text-foreground">{booking?.bookingId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Court</p>
                  <p className="text-sm font-medium text-foreground">{booking?.courtName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(booking?.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Time</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="text-sm font-medium text-foreground">{booking?.duration} hour(s)</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Payment Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Amount</p>
                  <p className="text-lg font-semibold text-foreground">${booking?.amount?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Payment Status</p>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getPaymentStatusColor(booking?.paymentStatus)}`}>
                    {booking?.paymentStatus?.charAt(0)?.toUpperCase() + booking?.paymentStatus?.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                  <p className="text-sm font-medium text-foreground">{booking?.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                  <p className="text-sm font-medium text-foreground font-mono">{booking?.transactionId}</p>
                </div>
              </div>
            </div>
          </div>

          {booking?.notes && (
            <div className="pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Admin Notes</h4>
              <p className="text-sm text-foreground bg-muted rounded-lg p-4">{booking?.notes}</p>
            </div>
          )}

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Booking Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="text-sm font-medium text-foreground">Booking Created</p>
                  <p className="text-xs text-muted-foreground">{booking?.createdAt}</p>
                </div>
              </div>
              {booking?.confirmedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Booking Confirmed</p>
                    <p className="text-xs text-muted-foreground">{booking?.confirmedAt}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-initial"
          >
            Close
          </Button>
          <div className="flex gap-3 flex-1">
            <Button
              variant="outline"
              onClick={() => onContact(booking)}
              iconName="Mail"
              iconPosition="left"
              className="flex-1"
            >
              Contact
            </Button>
            <Button
              variant="primary"
              onClick={() => onEdit(booking)}
              iconName="Edit"
              iconPosition="left"
              className="flex-1"
            >
              Edit Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;