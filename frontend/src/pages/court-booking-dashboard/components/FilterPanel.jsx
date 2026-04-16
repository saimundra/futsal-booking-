import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    courts: [],
    timeRange: 'all',
    priceRange: 'all',
    availability: 'all'
  });

  const courtOptions = [
    { value: 'court-1', label: 'Court 1' },
    { value: 'court-2', label: 'Court 2' },
    { value: 'court-3', label: 'Court 3' },
    { value: 'court-4', label: 'Court 4' }
  ];

  const timeRangeOptions = [
    { value: 'all', label: 'All Times' },
    { value: 'morning', label: 'Morning (6AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
    { value: 'evening', label: 'Evening (6PM - 11PM)' }
  ];

  const priceRangeOptions = [
    { value: 'all', label: 'All Prices' },
    { value: 'low', label: 'Under NPR 50' },
    { value: 'medium', label: 'NPR 50 - NPR 100' },
    { value: 'high', label: 'Over NPR 100' }
  ];

  const availabilityOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available Only' },
    { value: 'booked', label: 'Booked Only' }
  ];

  const handleCourtToggle = (courtValue) => {
    setFilters(prev => ({
      ...prev,
      courts: prev?.courts?.includes(courtValue)
        ? prev?.courts?.filter(c => c !== courtValue)
        : [...prev?.courts, courtValue]
    }));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleReset = () => {
    setFilters({
      courts: [],
      timeRange: 'all',
      priceRange: 'all',
      availability: 'all'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] lg:relative lg:z-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card shadow-athletic-2xl lg:relative lg:rounded-xl lg:shadow-athletic overflow-y-auto scrollbar-athletic">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            <p className="text-xs text-muted-foreground">Refine your search</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-250"
            aria-label="Close filters"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Courts</label>
            <div className="space-y-2">
              {courtOptions?.map((court) => (
                <Checkbox
                  key={court?.value}
                  label={court?.label}
                  checked={filters?.courts?.includes(court?.value)}
                  onChange={() => handleCourtToggle(court?.value)}
                />
              ))}
            </div>
          </div>

          <div>
            <Select
              label="Time Range"
              options={timeRangeOptions}
              value={filters?.timeRange}
              onChange={(value) => handleFilterChange('timeRange', value)}
            />
          </div>

          <div>
            <Select
              label="Price Range"
              options={priceRangeOptions}
              value={filters?.priceRange}
              onChange={(value) => handleFilterChange('priceRange', value)}
            />
          </div>

          <div>
            <Select
              label="Availability"
              options={availabilityOptions}
              value={filters?.availability}
              onChange={(value) => handleFilterChange('availability', value)}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              fullWidth
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleApply}
              iconName="Check"
              iconPosition="left"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;