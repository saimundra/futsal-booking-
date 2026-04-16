import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const BookingCalendarNavigation = ({ 
  currentDate = new Date(),
  onDateChange,
  selectedCourt = 'all',
  onCourtChange,
  viewMode = 'day',
  onViewModeChange
}) => {
  const [date, setDate] = useState(currentDate);

  const courtOptions = [
    { value: 'all', label: 'All Courts' },
    { value: 'court-1', label: 'Court 1' },
    { value: 'court-2', label: 'Court 2' },
    { value: 'court-3', label: 'Court 3' },
    { value: 'court-4', label: 'Court 4' }
  ];

  const viewModes = [
    { value: 'day', label: 'Day', icon: 'Calendar' },
    { value: 'week', label: 'Week', icon: 'CalendarDays' },
    { value: 'month', label: 'Month', icon: 'CalendarRange' }
  ];

  const handlePreviousDate = () => {
    const newDate = new Date(date);
    if (viewMode === 'day') {
      newDate?.setDate(newDate?.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate?.setDate(newDate?.getDate() - 7);
    } else {
      newDate?.setMonth(newDate?.getMonth() - 1);
    }
    setDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(date);
    if (viewMode === 'day') {
      newDate?.setDate(newDate?.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate?.setDate(newDate?.getDate() + 7);
    } else {
      newDate?.setMonth(newDate?.getMonth() + 1);
    }
    setDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setDate(today);
    if (onDateChange) onDateChange(today);
  };

  const formatDate = () => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date?.toLocaleDateString('en-US', options);
  };

  const handleCourtSelect = (value) => {
    if (onCourtChange) onCourtChange(value);
  };

  const handleViewModeSelect = (mode) => {
    if (onViewModeChange) onViewModeChange(mode);
  };

  return (
    <div className="booking-calendar-nav">
      <div className="booking-calendar-nav-controls">
        <div className="booking-calendar-nav-date">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDate}
            iconName="ChevronLeft"
            className="press-scale"
          />
          <div className="booking-calendar-nav-date-display">
            {formatDate()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDate}
            iconName="ChevronRight"
            className="press-scale"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleToday}
            className="press-scale"
          >
            Today
          </Button>
        </div>

        <div className="booking-calendar-nav-filters">
          <Select
            options={courtOptions}
            value={selectedCourt}
            onChange={handleCourtSelect}
            placeholder="Select court"
            className="min-w-[160px]"
          />

          <div className="booking-calendar-nav-view-toggle">
            {viewModes?.map((mode) => (
              <button
                key={mode?.value}
                onClick={() => handleViewModeSelect(mode?.value)}
                className={`booking-calendar-nav-view-button ${viewMode === mode?.value ? 'active' : ''}`}
              >
                <span className="flex items-center gap-1.5">
                  <Icon name={mode?.icon} size={16} />
                  <span className="hidden sm:inline">{mode?.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendarNavigation;