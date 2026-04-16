import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import AppImage from '../../components/AppImage';
import Button from '../../components/ui/Button';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import BookingModal from './components/BookingModal';
import VenueDetailsModal from '../../components/VenueDetailsModal';
import { fetchFutsals, createBooking } from '../../services/api';
import { useToast } from '../../components/animations/Toast';

const CourtBookingDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [futsals, setFutsals] = useState([]);
  const [filteredFutsal, setFilteredFutsal] = useState(null);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);

  const handleBookingConfirm = async (bookingData) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Calculate end time and amount
      const duration = parseFloat(bookingData.duration);
      const hourlyRate = parseFloat(bookingData.hourlyRate || 0);
      const amount = (hourlyRate * duration * 1.05).toFixed(2); // Including 5% service fee
      
      // Calculate end_time from start_time + duration
      const [hours, minutes] = bookingData.timeSlot.split(':');
      const startDate = new Date();
      startDate.setHours(parseInt(hours), parseInt(minutes), 0);
      const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
      const end_time = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      
      // Prepare booking data for API with correct field names
      const bookingPayload = {
        court: bookingData.courtId,
        date: bookingData.bookingDate,
        start_time: bookingData.timeSlot,
        end_time: end_time,
        duration: duration,
        number_of_players: parseInt(bookingData.playerCount),
        amount: amount,
        payment_method: 'cash',
        notes: bookingData.notes || ''
      };
      
      await createBooking(bookingPayload, token);
      
      setIsBookingModalOpen(false);
      toast.success('Booking confirmed successfully! Redirecting to my bookings...');

      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Failed to create booking: ' + error.message);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    fetchFutsals()
      .then(res => {
        if (Array.isArray(res)) setFutsals(res);
        else if (Array.isArray(res?.results)) setFutsals(res.results);
        else setFutsals([]);
      })
      .catch(() => setFutsals([]));
  }, []);

  useEffect(() => {
    // If futsal id is present in query params, filter to that futsal only
    const params = new URLSearchParams(location.search);
    const futsalId = params.get('futsal');
    if (futsalId && futsals.length > 0) {
      const found = futsals.find(f => String(f.id) === String(futsalId));
      setFilteredFutsal(found || null);
    } else {
      setFilteredFutsal(null);
    }
  }, [location.search, futsals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <RoleBasedNavigation userRole="player" onLogout={handleLogout} />

      <div className="pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/futsal-venues')}
              iconName="ArrowLeft"
              iconPosition="left"
              className="transition-all duration-200 border border-green-600 bg-white text-green-700 hover:bg-green-50 focus:ring-2 focus:ring-green-600"
            >
              Back to Venues
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/my-bookings')}
              iconName="ClipboardList"
              iconPosition="left"
              className="transition-all duration-200 border border-green-600 bg-white text-green-700 hover:bg-green-50 focus:ring-2 focus:ring-green-600"
            >
              My Bookings
            </Button>
          </div>

          {/* Futsal venues and courts */}
          {filteredFutsal ? (
            <div className="space-y-6">
              {/* Venue Header Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon name="Home" size={32} className="text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{filteredFutsal.name}</h1>
                        <div className="flex items-center gap-2 text-green-100">
                          <Icon name="MapPin" size={16} />
                          <span>{filteredFutsal.address}, {filteredFutsal.city}</span>
                        </div>
                      </div>
                    </div>
                    {filteredFutsal.is_active ? (
                      <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        <Icon name="CheckCircle" size={16} />
                        Open Now
                      </span>
                    ) : (
                      <span className="bg-red-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        <Icon name="XCircle" size={16} />
                        Closed
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {filteredFutsal.contact_phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <Icon name="Phone" size={20} className="text-green-700" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Contact</p>
                          <p className="text-sm font-medium text-gray-800">{filteredFutsal.contact_phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Map & Gallery Side by Side */}
                  {(filteredFutsal.map_link || (filteredFutsal.images && filteredFutsal.images.length > 0)) && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Map Preview (Square) */}
                      <div>
                        {filteredFutsal.map_link ? (
                          <div 
                            className="relative rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 hover:border-green-500 transition-all cursor-pointer group aspect-square"
                            onClick={() => window.open(filteredFutsal.map_link, '_blank')}
                          >
                            <iframe
                              src={`https://www.google.com/maps?q=${encodeURIComponent(filteredFutsal.address + ', ' + filteredFutsal.city)}&output=embed`}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              className="pointer-events-none absolute inset-0"
                            ></iframe>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all flex items-end justify-between p-3">
                              <div className="flex items-center gap-2">
                                <div className="bg-white rounded-full p-1.5">
                                  <Icon name="MapPin" size={16} className="text-green-700" />
                                </div>
                                <div>
                                  <p className="text-white text-sm font-semibold">View Location</p>
                                  <p className="text-white/70 text-xs">{filteredFutsal.address}, {filteredFutsal.city}</p>
                                </div>
                              </div>
                              <div className="bg-white/90 rounded-full p-1.5 group-hover:bg-white transition-all">
                                <Icon name="ExternalLink" size={16} className="text-green-700" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                            <div className="text-center">
                              <Icon name="MapPin" size={40} className="text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-400 text-sm">No map available</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Image Gallery */}
                      <div>
                        {filteredFutsal.images && filteredFutsal.images.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2 h-full">
                            {filteredFutsal.images.slice(0, 4).map((img, idx) => (
                              <div
                                key={img.id || idx}
                                className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-500 transition-all cursor-pointer"
                                onClick={() => setIsVenueModalOpen(true)}
                              >
                                <AppImage
                                  src={img.image}
                                  alt={img.caption || `Gallery image ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                {filteredFutsal.images.length > 4 && idx === 3 && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">+{filteredFutsal.images.length - 4}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                            <div className="text-center">
                              <Icon name="Image" size={40} className="text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-400 text-sm">No images yet</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {filteredFutsal.description && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{filteredFutsal.description}</p>
                    </div>
                  )}
                  {filteredFutsal.amenities && filteredFutsal.amenities.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {filteredFutsal.amenities.map((amenity, idx) => (
                          <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Available Courts Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Icon name="Calendar" size={24} className="text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Available Courts</h2>
                    <p className="text-gray-500">Select a court and book your preferred time slot</p>
                  </div>
                </div>

                {(filteredFutsal.courts || []).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Icon name="AlertCircle" size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Courts Available</h3>
                    <p className="text-gray-500">This venue doesn't have any courts set up yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFutsal.courts.map(court => (
                      <div key={court.id} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                            <Icon name="Square" size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-700 transition-colors">{court.name}</h3>
                            <p className="text-xs text-gray-500">{court.court_type}</p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Icon name="Layers" size={16} className="text-green-600" />
                              Surface
                            </span>
                            <span className="font-medium text-gray-800">{court.surface_type}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Icon name="Users" size={16} className="text-green-600" />
                              Max Players
                            </span>
                            <span className="font-medium text-gray-800">{court.max_players}</span>
                          </div>
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Hourly Rate</span>
                              <span className="text-2xl font-bold text-green-700">NPR {court.hourly_rate}</span>
                            </div>
                          </div>
                        </div>

                        <Button 
                          fullWidth
                          size="lg"
                          onClick={() => {
                            setSelectedBookingDetails({
                              courtId: court.id,
                              courtName: court.name,
                              futsalId: filteredFutsal.id,
                              futsalName: filteredFutsal.name,
                              hourlyRate: court.hourly_rate,
                              courtType: court.court_type,
                              surfaceType: court.surface_type,
                              maxPlayers: court.max_players
                            });
                            setIsBookingModalOpen(true);
                          }}
                          iconName="Calendar"
                          iconPosition="left"
                          className="bg-green-700 text-white hover:bg-green-800 focus:ring-2 focus:ring-green-600 group-hover:shadow-lg transition-all"
                        >
                          Book Now
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Icon name="Search" size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Venue Selected</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Please select a futsal venue from the Browse Venues page to view and book courts.
              </p>
              <Button 
                onClick={() => navigate('/futsal-venues')}
                iconName="MapPin"
                iconPosition="left"
                className="bg-green-700 text-white hover:bg-green-800 focus:ring-2 focus:ring-green-600"
              >
                Browse Venues
              </Button>
            </div>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingDetails={selectedBookingDetails}
        onConfirm={handleBookingConfirm} />

      <VenueDetailsModal
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
        futsal={filteredFutsal}
      />
    </div>);
};

export default CourtBookingDashboard;