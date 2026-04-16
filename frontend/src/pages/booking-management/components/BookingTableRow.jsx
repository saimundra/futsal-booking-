import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingTableRow = ({ booking, isSelected, onSelect, onEdit, onDelete, onViewDetails, onContact }) => {
  const [showActions, setShowActions] = useState(false);

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
    <tr className="border-b border-border hover:bg-muted/50 transition-colors duration-250">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(booking?.id, e?.target?.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={booking?.customerAvatar}
            alt={booking?.customerAvatarAlt}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-foreground text-sm">{booking?.customerName}</p>
            <p className="text-xs text-muted-foreground">{booking?.customerEmail}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-foreground">{booking?.courtName}</p>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">{formatDate(booking?.date)}</p>
          <p className="text-xs text-muted-foreground">
            {formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking?.status)}`}>
          {booking?.status?.charAt(0)?.toUpperCase() + booking?.status?.slice(1)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">${booking?.amount?.toFixed(2)}</p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(booking?.paymentStatus)}`}>
            {booking?.paymentStatus?.charAt(0)?.toUpperCase() + booking?.paymentStatus?.slice(1)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(booking)}
            iconName="Eye"
            className="hover-lift"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(booking)}
            iconName="Edit"
            className="hover-lift"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onContact(booking)}
            iconName="Mail"
            className="hover-lift"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowActions(!showActions)}
            iconName="MoreVertical"
            className="hover-lift"
          />
          {showActions && (
            <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-athletic-md z-10 min-w-[160px]">
              <button
                onClick={() => {
                  onDelete(booking);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-muted transition-colors duration-250 flex items-center gap-2"
              >
                <Icon name="Trash2" size={16} />
                Delete Booking
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default BookingTableRow;