import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';

const BookingCard = ({ booking, onViewDetails, onCancel, onRebook }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'confirmed': return 'bg-success/10 text-success border-success/20';
      case 'completed': return 'bg-muted text-muted-foreground border-border';
      case 'cancelled': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-success';
      case 'pending': return 'text-warning';
      case 'refunded': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const canCancel = booking?.status === 'confirmed' || booking?.status === 'pending';
  const canRebook = booking?.status === 'completed' || booking?.status === 'cancelled';

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-48 h-48 md:h-auto flex-shrink-0 bg-muted relative">
          {booking?.courtImage ? (
            <AppImage
              src={booking?.courtImage}
              alt={booking?.courtImageAlt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Icon name="Image" size={48} className="text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <h3 className="text-lg font-semibold text-foreground">{booking?.courtName}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking?.status)}`}>
                  {booking?.status?.charAt(0)?.toUpperCase() + booking?.status?.slice(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{booking?.facilityName}</p>
              <p className="text-xs text-muted-foreground">Booking ID: {booking?.bookingId || booking?.id}</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">${booking?.price?.toFixed(2)}</p>
              <p className={`text-xs font-medium ${getPaymentStatusColor(booking?.paymentStatus)}`}>
                {booking?.paymentStatus?.charAt(0)?.toUpperCase() + booking?.paymentStatus?.slice(1)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-foreground">{formatDate(booking?.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-medium text-foreground">{booking?.startTime} - {booking?.endTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="Timer" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium text-foreground">{booking?.duration}h</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Players</p>
                <p className="text-sm font-medium text-foreground">{booking?.players}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Eye"
              iconPosition="left"
              onClick={() => onViewDetails?.(booking)}
            >
              View Details
            </Button>

            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                iconName="XCircle"
                iconPosition="left"
                onClick={() => onCancel?.(booking?.id)}
              >
                Cancel
              </Button>
            )}

            {canRebook && (
              <Button
                variant="default"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => onRebook?.(booking)}
              >
                Rebook
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;