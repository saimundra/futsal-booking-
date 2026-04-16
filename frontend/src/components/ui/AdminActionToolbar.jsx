import React, { useState } from 'react';

import Button from './Button';
import Input from './Input';
import Select from './Select';

const AdminActionToolbar = ({ 
  selectedCount = 0,
  onBulkApprove,
  onBulkReject,
  onBulkDelete,
  onSearch,
  onFilterChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleSearch = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    if (onFilterChange) onFilterChange({ status: value, date: dateFilter });
  };

  const handleDateFilter = (value) => {
    setDateFilter(value);
    if (onFilterChange) onFilterChange({ status: statusFilter, date: value });
  };

  const handleBulkApprove = () => {
    if (onBulkApprove) onBulkApprove();
  };

  const handleBulkReject = () => {
    if (onBulkReject) onBulkReject();
  };

  const handleBulkDelete = () => {
    if (onBulkDelete) onBulkDelete();
  };

  return (
    <div className="admin-action-toolbar">
      <div className="admin-action-toolbar-content">
        {selectedCount > 0 ? (
          <div className="admin-action-toolbar-bulk-actions">
            <span className="admin-action-toolbar-bulk-text">
              {selectedCount} selected
            </span>
            <Button
              variant="success"
              size="sm"
              onClick={handleBulkApprove}
              iconName="CheckCircle"
              iconPosition="left"
            >
              Approve
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={handleBulkReject}
              iconName="XCircle"
              iconPosition="left"
            >
              Reject
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete
            </Button>
          </div>
        ) : (
          <>
            <div className="admin-action-toolbar-search">
              <Input
                type="search"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full"
              />
            </div>

            <div className="admin-action-toolbar-filters">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={handleStatusFilter}
                placeholder="Filter by status"
                className="min-w-[160px]"
              />

              <Select
                options={dateOptions}
                value={dateFilter}
                onChange={handleDateFilter}
                placeholder="Filter by date"
                className="min-w-[160px]"
              />

              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>

              <Button
                variant="primary"
                size="sm"
                iconName="Plus"
                iconPosition="left"
              >
                New Booking
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminActionToolbar;