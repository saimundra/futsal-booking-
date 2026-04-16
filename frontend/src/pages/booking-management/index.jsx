import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import AdminActionToolbar from '../../components/ui/AdminActionToolbar';
import { fetchBookings, updateBookingStatus, deleteBooking } from '../../services/api';
import Icon from '../../components/AppIcon';

import BookingTableRow from './components/BookingTableRow';
import BookingTableMobile from './components/BookingTableMobile';
import BookingDetailsModal from './components/BookingDetailsModal';
import CreateBookingModal from './components/CreateBookingModal';
import EditBookingModal from './components/EditBookingModal';
import ContactCustomerModal from './components/ContactCustomerModal';

const BookingManagement = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('accessToken');
  // Force futsal_owner role for this page
  const userRole = 'futsal_owner';

  useEffect(() => {
    loadBookings();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetchBookings({ my: true });
      const bookingsData = Array.isArray(res.results) ? res.results : (Array.isArray(res) ? res : []);
      
      // Transform backend data to match frontend format
      const transformedBookings = bookingsData.map(booking => ({
        id: booking.id,
        bookingId: `BK${booking.id.toString().padStart(3, '0')}`,
        customerName: booking.user_name || booking.user?.name || 'N/A',
        customerEmail: booking.user_email || booking.user?.email || 'N/A',
        customerPhone: booking.user_phone || booking.user?.phone || 'N/A',
        customerAvatar: '',
        customerAvatarAlt: '',
        courtId: booking.court,
        courtName: booking.court_name || `Court ${booking.court}`,
        date: booking.date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        duration: booking.duration || 1,
        status: booking.status,
        amount: parseFloat(booking.price || 0),
        paymentStatus: booking.payment_status || 'pending',
        paymentMethod: booking.payment_method || 'N/A',
        transactionId: booking.transaction_id || 'N/A',
        notes: booking.notes || '',
        createdAt: new Date(booking.created_at).toLocaleString(),
        confirmedAt: booking.confirmed_at ? new Date(booking.confirmed_at).toLocaleString() : null
      }));

      setBookings(transformedBookings);
      setFilteredBookings(transformedBookings);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Mock data removed - using real API data only

  const handleLogout = () => {
    navigate('/login');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...filteredBookings]?.sort((a, b) => {
      if (a?.[key] < b?.[key]) return direction === 'asc' ? -1 : 1;
      if (a?.[key] > b?.[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setFilteredBookings(sorted);
  };

  const handleSelectBooking = (id, checked) => {
    if (checked) {
      setSelectedBookings([...selectedBookings, id]);
    } else {
      setSelectedBookings(selectedBookings?.filter((bookingId) => bookingId !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBookings(filteredBookings?.map((b) => b?.id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleBulkApprove = () => {
    const updated = bookings?.map((booking) =>
    selectedBookings?.includes(booking?.id) && booking?.status === 'pending' ?
    { ...booking, status: 'confirmed', confirmedAt: new Date()?.toLocaleString('en-US') } :
    booking
    );
    setBookings(updated);
    setFilteredBookings(updated);
    setSelectedBookings([]);
  };

  const handleBulkReject = () => {
    const updated = bookings?.map((booking) =>
    selectedBookings?.includes(booking?.id) && booking?.status === 'pending' ?
    { ...booking, status: 'cancelled' } :
    booking
    );
    setBookings(updated);
    setFilteredBookings(updated);
    setSelectedBookings([]);
  };

  const handleBulkDelete = () => {
    const updated = bookings?.filter((booking) => !selectedBookings?.includes(booking?.id));
    setBookings(updated);
    setFilteredBookings(updated);
    setSelectedBookings([]);
  };

  const handleSearch = (query) => {
    let filtered = bookings?.filter((booking) =>
    booking?.customerName?.toLowerCase()?.includes(query?.toLowerCase()) ||
    booking?.customerEmail?.toLowerCase()?.includes(query?.toLowerCase()) ||
    booking?.bookingId?.toLowerCase()?.includes(query?.toLowerCase())
    );
    setFilteredBookings(filtered);
  };

  const handleFilterChange = (filters) => {
    let filtered = [...bookings];

    if (filters?.status && filters?.status !== 'all') {
      filtered = filtered?.filter((b) => b?.status === filters?.status);
    }

    if (filters?.date && filters?.date !== 'all') {
      const today = new Date();
      today?.setHours(0, 0, 0, 0);

      if (filters?.date === 'today') {
        filtered = filtered?.filter((b) => {
          const bookingDate = new Date(b.date);
          bookingDate?.setHours(0, 0, 0, 0);
          return bookingDate?.getTime() === today?.getTime();
        });
      } else if (filters?.date === 'week') {
        const weekFromNow = new Date(today);
        weekFromNow?.setDate(weekFromNow?.getDate() + 7);
        filtered = filtered?.filter((b) => {
          const bookingDate = new Date(b.date);
          return bookingDate >= today && bookingDate <= weekFromNow;
        });
      } else if (filters?.date === 'month') {
        const monthFromNow = new Date(today);
        monthFromNow?.setMonth(monthFromNow?.getMonth() + 1);
        filtered = filtered?.filter((b) => {
          const bookingDate = new Date(b.date);
          return bookingDate >= today && bookingDate <= monthFromNow;
        });
      }
    }

    setFilteredBookings(filtered);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  const handleDelete = (booking) => {
    if (window.confirm(`Are you sure you want to delete booking ${booking?.bookingId}?`)) {
      const updated = bookings?.filter((b) => b?.id !== booking?.id);
      setBookings(updated);
      setFilteredBookings(updated);
    }
  };

  const handleContact = (booking) => {
    setSelectedBooking(booking);
    setShowContactModal(true);
  };

  const handleCreateBooking = (formData) => {
    const newBooking = {
      id: `BK${String(bookings?.length + 1)?.padStart(3, '0')}`,
      bookingId: `BK${String(bookings?.length + 1)?.padStart(3, '0')}`,
      customerName: formData?.customerName,
      customerEmail: formData?.customerEmail,
      customerPhone: formData?.customerPhone,
      customerAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_125930865-1763298322634.png",
      customerAvatarAlt: 'Professional headshot of new customer in business attire',
      courtId: formData?.courtId,
      courtName: formData?.courtId === 'court-1' ? 'Court 1 - Main Arena' :
      formData?.courtId === 'court-2' ? 'Court 2 - Training Ground' :
      formData?.courtId === 'court-3' ? 'Court 3 - Competition Court' : 'Court 4 - Practice Field',
      date: formData?.date,
      startTime: formData?.startTime,
      endTime: `${parseInt(formData?.startTime?.split(':')?.[0]) + parseInt(formData?.duration)}:${formData?.startTime?.split(':')?.[1]}`,
      duration: parseInt(formData?.duration),
      status: 'pending',
      amount: parseInt(formData?.duration) * 40,
      paymentStatus: 'pending',
      paymentMethod: 'Credit Card',
      transactionId: `TXN-2025-${String(Math.floor(Math.random() * 999999))?.padStart(6, '0')}`,
      notes: formData?.notes,
      createdAt: new Date()?.toLocaleString('en-US'),
      confirmedAt: null
    };

    const updated = [...bookings, newBooking];
    setBookings(updated);
    setFilteredBookings(updated);
    setShowCreateModal(false);
  };

  const handleUpdateBooking = (updatedBooking) => {
    const updated = bookings?.map((b) => b?.id === updatedBooking?.id ? updatedBooking : b);
    setBookings(updated);
    setFilteredBookings(updated);
    setShowEditModal(false);
  };

  const handleSendMessage = (messageData) => {
    setShowContactModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole={userRole} onLogout={handleLogout} />
      <div className="pt-24 md:pt-28">
        <AdminActionToolbar
          selectedCount={selectedBookings?.length}
          onBulkApprove={handleBulkApprove}
          onBulkReject={handleBulkReject}
          onBulkDelete={handleBulkDelete}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange} />


        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">Booking Management</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage all facility reservations and customer bookings
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-700 mb-4"></div>
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Icon name="Calendar" size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Bookings Yet</h3>
              <p className="text-gray-500 mb-6">
                You don't have any bookings at the moment. Bookings will appear here once customers make reservations.
              </p>
            </div>
          ) : (
          <div className="bg-card rounded-xl shadow-athletic border border-border overflow-hidden">
            {isMobile ?
            <div className="p-4">
                <BookingTableMobile
                bookings={filteredBookings}
                selectedBookings={selectedBookings}
                onSelect={handleSelectBooking}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                onContact={handleContact} />

              </div> :

            <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                        type="checkbox"
                        checked={selectedBookings?.length === filteredBookings?.length && filteredBookings?.length > 0}
                        onChange={(e) => handleSelectAll(e?.target?.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2" />

                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                        onClick={() => handleSort('customerName')}
                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors duration-250">

                          Customer
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                        onClick={() => handleSort('courtName')}
                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors duration-250">

                          Court
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors duration-250">

                          Date & Time
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors duration-250">

                          Status
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                        onClick={() => handleSort('amount')}
                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors duration-250">

                          Payment
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings?.map((booking) =>
                  <BookingTableRow
                    key={booking?.id}
                    booking={booking}
                    isSelected={selectedBookings?.includes(booking?.id)}
                    onSelect={handleSelectBooking}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                    onContact={handleContact} />

                  )}
                  </tbody>
                </table>
              </div>
            }

            {filteredBookings?.length === 0 &&
            <div className="text-center py-12 md:py-16">
                <p className="text-base md:text-lg text-muted-foreground">No bookings found</p>
              </div>
            }
          </div>
          )}
        </main>
      </div>
      {showDetailsModal &&
      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setShowDetailsModal(false)}
        onEdit={handleEdit}
        onContact={handleContact} />

      }
      {showCreateModal &&
      <CreateBookingModal
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBooking} />

      }
      {showEditModal &&
      <EditBookingModal
        booking={selectedBooking}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateBooking} />

      }
      {showContactModal &&
      <ContactCustomerModal
        booking={selectedBooking}
        onClose={() => setShowContactModal(false)}
        onSend={handleSendMessage} />

      }
    </div>);

};

export default BookingManagement;