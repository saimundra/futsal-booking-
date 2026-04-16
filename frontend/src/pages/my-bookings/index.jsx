import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBookings, cancelBooking } from '../../services/api';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import BookingCard from './components/BookingCard';
import BookingFilters from './components/BookingFilters';
import BookingDetailModal from './components/BookingDetailModal';
import { SkeletonBookingCard } from '../../components/animations/SkeletonLoader';
import { AnimatedGrid } from '../../components/animations/AnimatedCard';

const MyBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourtType, setFilterCourtType] = useState('all');
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('accessToken');
  // Force player role for this page
  const userRole = 'player';

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetchBookings();
      const bookingsData = Array.isArray(res.results) ? res.results : (Array.isArray(res) ? res : []);
      
      console.log('Bookings API Response:', bookingsData);
      
      // Transform backend data to match frontend format
      const transformedBookings = bookingsData.map(booking => {
        console.log('Booking court_image:', booking.court_image);
        return {
          id: booking.id,
          bookingId: booking.booking_id,
          courtName: booking.court_name || `Court ${booking.court}`,
          facilityName: booking.futsal_name || 'Futsal Venue',
          courtImage: booking.court_image || '',
          courtImageAlt: `${booking.court_name || 'Court'}`,
          date: booking.date,
          startTime: booking.start_time,
          endTime: booking.end_time,
          duration: booking.duration || 1,
          players: booking.number_of_players || 10,
          price: parseFloat(booking.amount || 0),
          status: booking.status,
          paymentStatus: booking.payment_status || 'pending',
          courtType: booking.court_type || 'indoor',
          bookingDate: booking.created_at ? booking.created_at.split('T')[0] : booking.date,
          cancellationReason: booking.cancellation_reason || '',
          notes: booking.notes || ''
        };
      });

      console.log('Transformed bookings:', transformedBookings);
      setAllBookings(transformedBookings);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };


  const filterBookings = (bookings, status) => {
    let filtered = bookings?.filter((booking) => {
      if (status === 'upcoming') {
        // Show both pending and confirmed bookings as upcoming
        return booking?.status === 'confirmed' || booking?.status === 'pending';
      }
      if (status === 'past') return booking?.status === 'completed';
      if (status === 'cancelled') return booking?.status === 'cancelled';
      return true;
    });

    if (searchTerm) {
      filtered = filtered?.filter((booking) =>
      booking?.courtName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      booking?.facilityName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      booking?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    if (filterCourtType !== 'all') {
      filtered = filtered?.filter((booking) => booking?.courtType === filterCourtType);
    }

    return filtered;
  };

  const upcomingBookings = filterBookings(allBookings, 'upcoming');
  const pastBookings = filterBookings(allBookings, 'past');
  const cancelledBookings = filterBookings(allBookings, 'cancelled');

  const getActiveBookings = () => {
    if (activeTab === 'upcoming') return upcomingBookings;
    if (activeTab === 'past') return pastBookings;
    if (activeTab === 'cancelled') return cancelledBookings;
    return [];
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(bookingId);
      await loadBookings();
      setIsDetailModalOpen(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleRebook = (booking) => {
    navigate('/court-booking-dashboard');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const tabs = [
  { id: 'upcoming', label: 'Upcoming', count: upcomingBookings?.length, icon: 'Calendar' },
  { id: 'past', label: 'Past', count: pastBookings?.length, icon: 'History' },
  { id: 'cancelled', label: 'Cancelled', count: cancelledBookings?.length, icon: 'XCircle' }];


  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole={userRole} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pt-24 md:pt-28">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-h3 font-heading text-foreground mb-2">My Bookings</h1>
            <p className="text-body text-muted-foreground">Manage your court reservations and booking history</p>
          </div>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => navigate('/court-booking-dashboard')}>

            New Booking
          </Button>
        </div>

        <BookingFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          courtType={filterCourtType}
          onCourtTypeChange={setFilterCourtType} />


        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="border-b border-border overflow-x-auto">
            <div className="flex min-w-max">
              {tabs?.map((tab) =>
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors duration-250 border-b-2 ${
                activeTab === tab?.id ?
                'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`
                }>

                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === tab?.id ?
                'bg-primary text-white' : 'bg-muted text-muted-foreground'}`
                }>
                    {tab?.count}
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <AnimatedGrid className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonBookingCard key={i} />
                ))}
              </AnimatedGrid>
            ) : getActiveBookings()?.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                  <Icon name="Calendar" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No bookings found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {activeTab === 'upcoming' && 'You don\'t have any upcoming bookings yet.'}
                  {activeTab === 'past' && 'You don\'t have any past bookings.'}
                  {activeTab === 'cancelled' && 'You don\'t have any cancelled bookings.'}
                </p>
                {activeTab === 'upcoming' &&
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => navigate('/court-booking-dashboard')}>
                    Book a Court
                  </Button>
                }
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {getActiveBookings()?.map((booking) =>
                  <BookingCard
                    key={booking?.id}
                    booking={booking}
                    onViewDetails={handleViewDetails}
                    onCancel={handleCancelBooking}
                    onRebook={handleRebook} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isDetailModalOpen && selectedBooking &&
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setIsDetailModalOpen(false)}
        onCancel={handleCancelBooking}
        onRebook={handleRebook} />

      }
    </div>);

};

export default MyBookings;