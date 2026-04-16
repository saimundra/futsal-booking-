import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFutsals } from "../../services/api";
import Icon from "../../components/AppIcon";
import AppImage from "../../components/AppImage";
import { AnimatedCard, AnimatedGrid } from "../../components/animations/AnimatedCard";
import { SkeletonVenueCard } from "../../components/animations/SkeletonLoader";

function PlayerFutsalCard({ futsal, onClick }) {
  const fallbackImage = "/assets/images/futsal-placeholder.jpg";
  
  return (
    <AnimatedCard
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {futsal.cover_image ? (
          <AppImage 
            src={futsal.cover_image} 
            alt={futsal.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
            <Icon name="Image" size={64} className="text-green-600 opacity-50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          {futsal.is_active ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Active
            </span>
          ) : (
            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1 group-hover:text-green-700 transition-colors">
          {futsal.name}
        </h3>
        
        <div className="space-y-2 mb-4">
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
          
          {futsal.contact_email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Mail" size={16} className="text-green-600 flex-shrink-0" />
              <span className="truncate">{futsal.contact_email}</span>
            </div>
          )}
        </div>

        {futsal.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {futsal.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-400">
            Added {new Date(futsal.created_at).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1 text-green-700 font-medium text-sm group-hover:gap-2 transition-all">
            View Details
            <Icon name="ArrowRight" size={16} />
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const [futsals, setFutsals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFutsals();
  }, []);

  const loadFutsals = async () => {
    try {
      setLoading(true);
      const data = await fetchFutsals();
      // Filter to show only active venues on the frontend as well
      const activeFutsals = (data.results || data || []).filter(f => f.is_active);
      setFutsals(activeFutsals);
    } catch (err) {
      console.error('Failed to load futsals:', err);
      setError('Failed to load futsal venues. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (futsal) => {
    // Navigate to futsal details or booking page
    navigate(`/court-booking-dashboard?futsal=${futsal.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Icon name="Home" size={24} className="text-green-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Available Futsal Venues</h1>
              <p className="text-gray-500 mt-1">Browse and book your favorite futsal courts</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonVenueCard key={i} />
            ))}
          </AnimatedGrid>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
            <Icon name="AlertCircle" size={24} className="text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && futsals.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="Search" size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Futsal Venues Found</h3>
            <p className="text-gray-500 mb-6">There are currently no futsal venues available. Please check back later.</p>
          </div>
        )}

        {/* Futsals Grid */}
        {!loading && !error && futsals.length > 0 && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {futsals.length} venue{futsals.length !== 1 ? 's' : ''}
            <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {futsals.map((futsal) => (
                <PlayerFutsalCard 
                  key={futsal.id} 
                  futsal={futsal}
                  onClick={() => handleCardClick(futsal)}
                />
              ))}
            </AnimatedGrid>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;
