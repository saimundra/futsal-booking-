import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ScheduleCalendar = ({ selectedCourt, viewMode, currentDate, onDateChange }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Mock schedule data
  const scheduleData = {
    'court-1': {
      '2025-12-29': [
        { time: '08:00', status: 'available' },
        { time: '09:00', status: 'booked' },
        { time: '10:00', status: 'booked' },
        { time: '11:00', status: 'available' },
        { time: '12:00', status: 'maintenance' },
        { time: '13:00', status: 'available' },
        { time: '14:00', status: 'available' },
        { time: '15:00', status: 'booked' },
        { time: '16:00', status: 'available' },
        { time: '17:00', status: 'available' },
        { time: '18:00', status: 'booked' },
        { time: '19:00', status: 'available' },
        { time: '20:00', status: 'closed' }
      ]
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-success hover:bg-success/80',
      booked: 'bg-primary hover:bg-primary/80',
      maintenance: 'bg-warning hover:bg-warning/80',
      closed: 'bg-error hover:bg-error/80',
      unavailable: 'bg-muted hover:bg-muted/80'
    };
    return colors?.[status] || 'bg-muted';
  };

  const handlePrevious = () => {
    if (viewMode === 'week') {
      onDateChange(subWeeks(currentDate, 1));
    } else if (viewMode === 'day') {
      onDateChange(addDays(currentDate, -1));
    } else {
      onDateChange(addDays(currentDate, -30));
    }
  };

  const handleNext = () => {
    if (viewMode === 'week') {
      onDateChange(addWeeks(currentDate, 1));
    } else if (viewMode === 'day') {
      onDateChange(addDays(currentDate, 1));
    } else {
      onDateChange(addDays(currentDate, 30));
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const timeSlots = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-xs font-semibold text-muted-foreground p-2">Time</div>
            {weekDays?.map((day) => (
              <div key={day?.toString()} className="text-center p-2 bg-muted rounded-lg">
                <div className="text-xs font-semibold text-foreground">{format(day, 'EEE')}</div>
                <div className="text-sm text-muted-foreground">{format(day, 'MMM d')}</div>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {timeSlots?.map((time) => (
              <div key={time} className="grid grid-cols-8 gap-2">
                <div className="text-xs text-muted-foreground p-2 flex items-center">{time}</div>
                {weekDays?.map((day) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const courtData = scheduleData?.[selectedCourt === 'all' ? 'court-1' : selectedCourt];
                  const slot = courtData?.[dateKey]?.find(s => s?.time === time);
                  const status = slot?.status || 'available';
                  
                  return (
                    <button
                      key={`${day}-${time}`}
                      onClick={() => setSelectedSlot({ date: day, time, status })}
                      className={`p-2 rounded-lg transition-athletic text-xs font-medium text-white ${getStatusColor(status)}`}
                    >
                      {status === 'available' ? '✓' : status === 'booked' ? '●' : status === 'maintenance' ? '⚙' : '✕'}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const timeSlots = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const courtData = scheduleData?.[selectedCourt === 'all' ? 'court-1' : selectedCourt];

    return (
      <div className="space-y-2">
        {timeSlots?.map((time) => {
          const slot = courtData?.[dateKey]?.find(s => s?.time === time);
          const status = slot?.status || 'available';
          
          return (
            <button
              key={time}
              onClick={() => setSelectedSlot({ date: currentDate, time, status })}
              className={`w-full p-4 rounded-lg transition-athletic flex items-center justify-between ${getStatusColor(status)}`}
            >
              <span className="text-sm font-semibold text-white">{time}</span>
              <span className="text-xs text-white uppercase">{status}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']?.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
            {day}
          </div>
        ))}
        {days?.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const courtData = scheduleData?.[selectedCourt === 'all' ? 'court-1' : selectedCourt];
          const daySlots = courtData?.[dateKey] || [];
          const availableCount = daySlots?.filter(s => s?.status === 'available')?.length || 0;
          
          return (
            <button
              key={day?.toString()}
              onClick={() => onDateChange(day)}
              className="p-3 rounded-lg border border-border hover:border-primary hover:shadow-athletic-sm transition-athletic"
            >
              <div className="text-sm font-semibold text-foreground mb-1">{format(day, 'd')}</div>
              <div className="text-xs text-muted-foreground">{availableCount} slots</div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-athletic">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">
          {viewMode === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
          {viewMode === 'week' && `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`}
          {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>

      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'month' && renderMonthView()}

      {selectedSlot && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-foreground">
            <strong>Selected:</strong> {format(selectedSlot?.date, 'MMM d, yyyy')} at {selectedSlot?.time} - Status: <span className="capitalize">{selectedSlot?.status}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;