import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const BookingSummaryCard = ({ booking, onEdit }) => {
  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2025-01-01 ${time}`)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-athletic p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
          Booking Summary
        </h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 text-sm md:text-base text-primary hover:text-secondary transition-athletic"
        >
          <Icon name="Edit2" size={18} />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          <div className="w-full sm:w-32 md:w-40 lg:w-48 h-32 md:h-40 lg:h-48 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={booking?.courtImage}
              alt={booking?.courtImageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-3 md:space-y-4">
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-1">
                {booking?.courtName}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {booking?.facilityName}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Calendar" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Date</p>
                  <p className="text-sm md:text-base lg:text-lg font-medium text-foreground">
                    {formatDate(booking?.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Clock" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Time</p>
                  <p className="text-sm md:text-base lg:text-lg font-medium text-foreground">
                    {formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Timer" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Duration</p>
                  <p className="text-sm md:text-base lg:text-lg font-medium text-foreground">
                    {booking?.duration} hour{booking?.duration > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Users" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Players</p>
                  <p className="text-sm md:text-base lg:text-lg font-medium text-foreground">
                    {booking?.players} players
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4 md:pt-6">
          <h4 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
            Booking Details
          </h4>
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-between text-sm md:text-base">
              <span className="text-muted-foreground">Court rental ({booking?.duration}h)</span>
              <span className="font-medium text-foreground">${booking?.courtPrice?.toFixed(2)}</span>
            </div>
            {booking?.equipmentRental > 0 && (
              <div className="flex items-center justify-between text-sm md:text-base">
                <span className="text-muted-foreground">Equipment rental</span>
                <span className="font-medium text-foreground">${booking?.equipmentRental?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm md:text-base">
              <span className="text-muted-foreground">Service fee</span>
              <span className="font-medium text-foreground">${booking?.serviceFee?.toFixed(2)}</span>
            </div>
            {booking?.discount > 0 && (
              <div className="flex items-center justify-between text-sm md:text-base text-success">
                <span>Discount applied</span>
                <span className="font-medium">-${booking?.discount?.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-4 md:pt-6">
          <div className="flex items-center justify-between">
            <span className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground">
              Total Amount
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
              ${booking?.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryCard;