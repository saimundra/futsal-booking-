import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UpcomingBookingsPanel = ({ bookings, onViewDetails, onCancelBooking }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date)?.toLocaleDateString('en-US', options);
  };

  const formatTime = (time) => {
    return time;
  };

  const handleViewDetails = (bookingId) => {
    if (onViewDetails) onViewDetails(bookingId);
  };

  const handleCancelBooking = (bookingId) => {
    if (onCancelBooking) onCancelBooking(bookingId);
  };

  return (
    <div className="bg-card rounded-xl shadow-athletic p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-1">Upcoming Bookings</h2>
          <p className="text-sm text-muted-foreground">{bookings?.length} active reservations</p>
        </div>
        <Icon name="Calendar" size={24} className="text-primary" />
      </div>
      <div className="space-y-4">
        {bookings?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CalendarX" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No upcoming bookings</p>
            <p className="text-muted-foreground text-xs mt-1">Book a court to get started</p>
          </div>
        ) : (
          bookings?.map((booking) => (
            <div
              key={booking?.id}
              className="bg-background rounded-lg p-4 border border-border hover:shadow-athletic-sm transition-all duration-250"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Dribbble" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-foreground">{booking?.courtName}</h3>
                    <p className="text-xs text-muted-foreground">{formatDate(booking?.date)}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking?.status)}`}>
                  {booking?.status?.charAt(0)?.toUpperCase() + booking?.status?.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="DollarSign" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground font-medium">NPR {booking?.price}</span>
                </div>
              </div>

              {booking?.players && booking?.players?.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Users" size={16} className="text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {booking?.players?.slice(0, 3)?.map((player, index) => (
                      <Image
                        key={index}
                        src={player?.avatar}
                        alt={player?.avatarAlt}
                        className="w-6 h-6 rounded-full border-2 border-card object-cover"
                      />
                    ))}
                    {booking?.players?.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{booking?.players?.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{booking?.players?.length} players</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => handleViewDetails(booking?.id)}
                  iconName="Eye"
                  iconPosition="left"
                >
                  View Details
                </Button>
                {booking?.status === 'confirmed' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    fullWidth
                    onClick={() => handleCancelBooking(booking?.id)}
                    iconName="X"
                    iconPosition="left"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingBookingsPanel;