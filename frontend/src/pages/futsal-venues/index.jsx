import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFutsals } from '../../services/api';
import Button from '../../components/ui/Button';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import Icon from '../../components/AppIcon';
import AppImage from '../../components/AppImage';
import { AnimatedCard, AnimatedGrid, cardVariants } from '../../components/animations/AnimatedCard';
import { SkeletonVenueCard } from '../../components/animations/SkeletonLoader';
import VenueDetailsModal from '../../components/VenueDetailsModal';

const FutsalVenues = () => {
  const navigate = useNavigate();
  const [futsals, setFutsals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFutsals(city ? { city } : {})
      .then(res => {
        // Filter to show only active venues
        const activeFutsals = (Array.isArray(res.results) ? res.results : []).filter(f => f.is_active);
        setFutsals(activeFutsals);
      })
      .finally(() => setLoading(false));
  }, [city]);

  const handleFutsalClick = (futsal) => {
    navigate(`/court-booking-dashboard?futsal=${futsal.id}`);
  };

  const handleLogout = () => {
    // Clear localStorage and redirect to login
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <RoleBasedNavigation userRole="player" onLogout={handleLogout} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-16 px-4 shadow-lg mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon name="MapPin" size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Discover Futsal Venues</h1>
              <p className="text-green-100 text-lg">Find and book the perfect court for your game</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Icon name="Search" size={20} className="text-green-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Search Venues</h2>
                <p className="text-sm text-gray-500">Filter by location to find venues near you</p>
              </div>
            </div>
            <div className="relative">
              <Icon name="MapPin" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Enter city name (e.g., Kathmandu, Pokhara)"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
              />
              {city && (
                <button
                  onClick={() => setCity('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon name="X" size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonVenueCard key={i} />
              ))}
            </AnimatedGrid>
          ) : futsals.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Icon name="Search" size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Venues Found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {city 
                  ? `We couldn't find any futsal venues in "${city}". Try searching for a different city.`
                  : "No futsal venues available at the moment. Please check back later."}
              </p>
              {city && (
                <Button 
                  variant="outline" 
                  onClick={() => setCity('')}
                  iconName="X"
                  iconPosition="left"
                  className="border-green-600 text-green-700 hover:bg-green-50"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            /* Venues Grid */
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Icon name="Home" size={20} className="text-green-700" />
                  <span className="text-gray-700 font-medium">
                    {futsals.length} venue{futsals.length !== 1 ? 's' : ''} found
                    {city && ` in ${city}`}
                  </span>
                </div>
              </div>
<AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {futsals.map((futsal, index) => (
                  <AnimatedCard
                    key={futsal.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Image Section */}
                    <div className="relative h-52 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
                      {futsal.cover_image ? (
                        <AppImage 
                          src={futsal.cover_image} 
                          alt={futsal.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="Image" size={64} className="text-green-600 opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        {futsal.is_active ? (
                          <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                            <Icon name="CheckCircle" size={14} />
                            Open
                          </span>
                        ) : (
                          <span className="bg-gray-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                            <Icon name="XCircle" size={14} />
                            Closed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors line-clamp-1">
                        {futsal.name}
                      </h2>
                      
                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <Icon name="MapPin" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{futsal.address}, {futsal.city}</span>
                        </div>
                        
                        {futsal.contact_phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Icon name="Phone" size={16} className="text-green-600 flex-shrink-0" />
                            <span>{futsal.contact_phone}</span>
                          </div>
                        )}
                        
                        {futsal.description && (
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <Icon name="FileText" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="line-clamp-2">{futsal.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Amenities */}
                      {futsal.amenities && futsal.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {futsal.amenities.slice(0, 3).map((amenity, idx) => (
                            <span 
                              key={idx}
                              className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
                            >
                              {amenity}
                            </span>
                          ))}
                          {futsal.amenities.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                              +{futsal.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button 
                          fullWidth
                          onClick={() => handleFutsalClick(futsal)}
                          iconName="Calendar"
                          iconPosition="left"
                          className="bg-green-700 text-white hover:bg-green-800 focus:ring-2 focus:ring-green-600 group-hover:shadow-lg transition-all"
                        >
                          View Courts & Book
                        </Button>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </AnimatedGrid>
            </>
          )}
        </div>
      </div>

      {/* Venue Details Modal */}
      <VenueDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVenue(null);
        }}
        futsal={selectedVenue}
      />
    </div>
  );
};

export default FutsalVenues;
