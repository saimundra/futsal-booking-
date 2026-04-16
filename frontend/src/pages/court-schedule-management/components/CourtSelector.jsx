import React from 'react';
import Select from '../../../components/ui/Select';

const CourtSelector = ({ courts, selectedCourt, onCourtChange }) => {
  const courtOptions = courts?.map(court => ({
    value: court?.id,
    label: court?.name
  }));

  return (
    <div className="w-full lg:w-64">
      <Select
        options={courtOptions}
        value={selectedCourt}
        onChange={onCourtChange}
        placeholder="Select court"
        label="Court"
      />
    </div>
  );
};

export default CourtSelector;