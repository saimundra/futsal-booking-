import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const CourtAvailabilityCalendar = ({ selectedDate, onDateChange, onTimeSlotClick }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(selectedDate));

  const courts = [
    { id: 'court-1', name: 'Court 1', color: 'bg-primary' },
    { id: 'court-2', name: 'Court 2', color: 'bg-secondary' },
    { id: 'court-3', name: 'Court 3', color: 'bg-accent' },
    { id: 'court-4', name: 'Court 4', color: 'bg-success' }
  ];

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const getWeekDates = (startDate) => {
    const dates = [];
    const start = new Date(startDate);
    start?.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date?.setDate(start?.getDate() + i);
      dates?.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeekStart);

  const getSlotStatus = (courtId, date, time) => {
    const random = Math.random();
    if (random > 0.7) return 'booked';
    if (random > 0.6) return 'maintenance';
    return 'available';
  };

  const handlePreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart?.setDate(newStart?.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart?.setDate(newStart?.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const handleToday = () => {
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    setCurrentWeekStart(today);
    if (onDateChange) onDateChange(today);
  };

  const formatDateHeader = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date?.toLocaleDateString('en-US', options);
  };

  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const handleSlotClick = (court, date, time, status) => {
    if (status === 'available' && onTimeSlotClick) {
      onTimeSlotClick({ court, date, time });
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-athletic p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-1">Court Availability</h2>
          <p className="text-sm text-muted-foreground">Select a time slot to book your court</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousWeek}
            iconName="ChevronLeft"
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
            iconName="ChevronRight"
            className="press-scale"
          />
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success"></div>
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-error"></div>
          <span className="text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning"></div>
          <span className="text-muted-foreground">Maintenance</span>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-athletic">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-sm font-medium text-muted-foreground"></div>
            {weekDates?.map((date, index) => (
              <div
                key={index}
                className={`text-center p-2 rounded-lg ${
                  isToday(date) ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                <div className="text-xs md:text-sm font-medium">{formatDateHeader(date)}</div>
              </div>
            ))}
          </div>

          {courts?.map((court) => (
            <div key={court?.id} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${court?.color}`}></div>
                <span className="text-sm font-medium text-foreground">{court?.name}</span>
              </div>
              
              <div className="space-y-1">
                {timeSlots?.map((time) => (
                  <div key={time} className="grid grid-cols-8 gap-2">
                    <div className="text-xs text-muted-foreground flex items-center">
                      {time}
                    </div>
                    {weekDates?.map((date, dateIndex) => {
                      const status = getSlotStatus(court?.id, date, time);
                      const isPast = date < new Date() || (date?.toDateString() === new Date()?.toDateString() && parseInt(time) < new Date()?.getHours());
                      
                      return (
                        <button
                          key={dateIndex}
                          onClick={() => handleSlotClick(court, date, time, status)}
                          disabled={status !== 'available' || isPast}
                          className={`h-8 rounded transition-all duration-250 ${
                            status === 'available' && !isPast ?'bg-success hover:bg-success/80 cursor-pointer hover-lift'
                              : status === 'booked' ?'bg-error cursor-not-allowed opacity-60'
                              : status === 'maintenance' ?'bg-warning cursor-not-allowed opacity-60' :'bg-muted cursor-not-allowed opacity-40'
                          }`}
                          aria-label={`${court?.name} at ${time} on ${formatDateHeader(date)} - ${status}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourtAvailabilityCalendar;