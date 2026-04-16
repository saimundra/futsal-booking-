import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BookingFilters = ({ searchTerm, onSearchChange, courtType, onCourtTypeChange }) => {
  const courtTypeOptions = [
    { value: 'all', label: 'All Courts' },
    { value: 'indoor', label: 'Indoor Courts' },
    { value: 'outdoor', label: 'Outdoor Courts' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by court name, facility, or booking ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e?.target?.value)}
            className="pl-10"
          />
        </div>

        <Select
          options={courtTypeOptions}
          value={courtType}
          onChange={onCourtTypeChange}
          placeholder="Filter by court type"
        />
      </div>
    </div>
  );
};

export default BookingFilters;