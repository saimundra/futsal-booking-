import React from 'react';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingTableMobile = ({ bookings, selectedBookings, onSelect, onEdit, onDelete, onViewDetails, onContact }) => {
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
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString?.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-4">
      {bookings?.map((booking) => (
        <div key={booking?.id} className="bg-card rounded-xl shadow-athletic-sm p-4 border border-border">
          <div className="flex items-start gap-3 mb-3">
            <input
              type="checkbox"
              checked={selectedBookings?.includes(booking?.id)}
              onChange={(e) => onSelect(booking?.id, e?.target?.checked)}
              className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
            <Image
              src={booking?.customerAvatar}
              alt={booking?.customerAvatarAlt}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm mb-1">{booking?.customerName}</h3>
              <p className="text-xs text-muted-foreground truncate">{booking?.customerEmail}</p>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Court:</span>
              <span className="text-sm font-medium text-foreground">{booking?.courtName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Date:</span>
              <span className="text-sm font-medium text-foreground">{formatDate(booking?.date)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Time:</span>
              <span className="text-sm font-medium text-foreground">
                {formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Amount:</span>
              <span className="text-sm font-semibold text-foreground">NPR {booking?.amount?.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking?.status)}`}>
              {booking?.status?.charAt(0)?.toUpperCase() + booking?.status?.slice(1)}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking?.paymentStatus)}`}>
              {booking?.paymentStatus?.charAt(0)?.toUpperCase() + booking?.paymentStatus?.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(booking)}
              iconName="Eye"
              iconPosition="left"
              className="flex-1"
            >
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(booking)}
              iconName="Edit"
              iconPosition="left"
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onContact(booking)}
              iconName="Mail"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(booking)}
              iconName="Trash2"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingTableMobile;