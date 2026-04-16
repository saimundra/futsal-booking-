
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFutsals, fetchCourts, deleteFutsal, updateFutsal } from '../../services/api';
import Button from '../../components/ui/Button';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import Icon from '../../components/AppIcon';
import AppImage from '../../components/AppImage';
import { AnimatedGrid, AnimatedCard } from '../../components/animations/AnimatedCard';
import { SkeletonVenueCard } from '../../components/animations/SkeletonLoader';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Dashboard error boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="text-4xl mb-4">😢</div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const FutsalOwnerDashboard = () => {

  const navigate = useNavigate();
  const [myFutsals, setMyFutsals] = useState([]);
  const [myCourts, setMyCourts] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Force futsal_owner role for this dashboard
  const userRole = 'futsal_owner';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchFutsals({ my: true }),
      fetchCourts({ my: true })
    ])
      .then(([futsalsRes, courtsRes]) => {
        setMyFutsals(Array.isArray(futsalsRes.results) ? futsalsRes.results : []);
        setMyCourts(Array.isArray(courtsRes.results) ? courtsRes.results : []);
        // Optionally, fetch bookings for futsal owner here
        // setRecentBookings(bookings);
      })
      .catch(() => {
        setMyFutsals([]);
        setMyCourts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDeleteFutsal = async (futsalId) => {
    if (!window.confirm('Are you sure you want to delete this futsal venue? This action cannot be undone.')) {
      return;
    }
    const token = localStorage.getItem('accessToken');
    try {
      await deleteFutsal(futsalId, token);
      setMyFutsals(prev => prev.filter(f => f.id !== futsalId));
      alert('Futsal venue deleted successfully!');
    } catch (err) {
      alert('Failed to delete futsal venue: ' + err.message);
    }
  };

  const handleToggleActive = async (futsal) => {
    const token = localStorage.getItem('accessToken');
    const action = futsal.is_active ? 'unlist' : 'list';
    if (!window.confirm(`Are you sure you want to ${action} this futsal venue?`)) {
      return;
    }
    try {
      const updated = await updateFutsal(futsal.id, { is_active: !futsal.is_active }, token);
      setMyFutsals(prev => prev.map(f => f.id === futsal.id ? updated : f));
      alert(`Futsal venue ${action}ed successfully!`);
    } catch (err) {
      alert(`Failed to ${action} futsal venue: ` + err.message);
    }
  };

  return (
    <ErrorBoundary>
      <>
        <div className="min-h-screen bg-background">
          <RoleBasedNavigation userRole={userRole} onLogout={handleLogout} />
          <div className="main-content-with-nav py-12 px-4 md:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Futsal Owner Dashboard</h1>
            </div>
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4 border border-border">
                <div className="text-xs text-muted-foreground mb-1">Total Venues</div>
                <div className="text-2xl font-bold">{myFutsals.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-border">
                <div className="text-xs text-muted-foreground mb-1">Total Courts</div>
                <div className="text-2xl font-bold">{myCourts.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-border">
                <div className="text-xs text-muted-foreground mb-1">Recent Bookings</div>
                <div className="text-2xl font-bold">{recentBookings.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-border">
                <div className="text-xs text-muted-foreground mb-1">Revenue</div>
                <div className="text-2xl font-bold">NPR 0</div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Button 
                onClick={() => navigate('/futsal-management/new')}
                iconName="PlusCircle"
                iconPosition="left"
                className="bg-green-700 hover:bg-green-800 text-white h-24 flex flex-col items-center justify-center gap-2"
              >
                <span className="text-lg font-semibold">Add New Venue</span>
                <span className="text-xs opacity-90">Create a new futsal venue</span>
              </Button>
              <Button 
                onClick={() => navigate('/futsal-management')}
                iconName="Settings"
                iconPosition="left"
                className="bg-blue-700 hover:bg-blue-800 text-white h-24 flex flex-col items-center justify-center gap-2"
              >
                <span className="text-lg font-semibold">Manage Venues</span>
                <span className="text-xs opacity-90">Edit venues & courts</span>
              </Button>
              <Button 
                onClick={() => navigate('/court-schedule-management')}
                iconName="Calendar"
                iconPosition="left"
                className="bg-purple-700 hover:bg-purple-800 text-white h-24 flex flex-col items-center justify-center gap-2"
              >
                <span className="text-lg font-semibold">View Schedule</span>
                <span className="text-xs opacity-90">Check court bookings</span>
              </Button>
              <Button 
                onClick={() => navigate('/booking-management')}
                iconName="List"
                iconPosition="left"
                className="bg-orange-700 hover:bg-orange-800 text-white h-24 flex flex-col items-center justify-center gap-2"
              >
                <span className="text-lg font-semibold">All Bookings</span>
                <span className="text-xs opacity-90">Manage all bookings</span>
              </Button>
            </div>
            {/* Futsal Venues List */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Futsal Venues</h2>
                <Button 
                  onClick={() => navigate('/futsal-management/new')}
                  iconName="PlusCircle"
                  iconPosition="left"
                  className="bg-green-700 text-white hover:bg-green-800"
                >
                  Add New Venue
                </Button>
              </div>
              {loading ? (
                <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <SkeletonVenueCard key={i} />
                  ))}
                </AnimatedGrid>
              ) : myFutsals.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                    <Icon name="Home" size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Venues Yet</h3>
                  <p className="text-gray-500 mb-6">You haven't added any futsal venues yet. Create your first venue to get started.</p>
                  <Button 
                    onClick={() => navigate('/futsal-management/new')}
                    iconName="PlusCircle"
                    iconPosition="left"
                    className="bg-green-700 text-white hover:bg-green-800"
                  >
                    Add Your First Venue
                  </Button>
                </div>
              ) : (
                <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {myFutsals.map(futsal => (
                    <AnimatedCard key={futsal.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                      <div className="relative h-32 bg-gradient-to-br from-green-100 to-green-200">
                        {futsal.cover_image ? (
                          <AppImage 
                            src={futsal.cover_image} 
                            alt={futsal.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon name="Image" size={48} className="text-green-600 opacity-50" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          {futsal.is_active ? (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow flex items-center gap-1">
                              <Icon name="CheckCircle" size={12} />
                              Listed
                            </span>
                          ) : (
                            <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow flex items-center gap-1">
                              <Icon name="XCircle" size={12} />
                              Unlisted
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-1" title={futsal.name}>{futsal.name}</h3>
                        <div className="space-y-1.5 mb-3">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Icon name="MapPin" size={14} className="text-green-600 flex-shrink-0" />
                            <span className="line-clamp-1">{futsal.address}, {futsal.city}</span>
                          </div>
                          {futsal.contact_phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Icon name="Phone" size={14} className="text-green-600 flex-shrink-0" />
                              <span className="line-clamp-1">{futsal.contact_phone}</span>
                            </div>
                          )}
                          {futsal.map_link && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-md border border-green-200 hover:bg-green-100 transition-all cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(futsal.map_link, '_blank');
                                }}
                              >
                                <Icon name="MapPin" size={12} className="text-green-600 flex-shrink-0" />
                                <span className="text-green-700 font-medium">View on Maps</span>
                                <Icon name="ExternalLink" size={10} className="text-green-600" />
                              </div>
                            </div>
                          )}
                        </div>
                        {futsal.amenities && futsal.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {futsal.amenities.slice(0, 2).map((amenity, idx) => (
                              <span key={idx} className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium border border-green-200">
                                {amenity}
                              </span>
                            ))}
                            {futsal.amenities.length > 2 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                +{futsal.amenities.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex flex-col gap-1.5">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleToggleActive(futsal)}
                            iconName={futsal.is_active ? "EyeOff" : "Eye"}
                            iconPosition="left"
                            fullWidth
                            className="border-blue-600 text-blue-700 hover:bg-blue-50 text-xs h-8"
                          >
                            {futsal.is_active ? 'Unlist' : 'List'}
                          </Button>
                          <div className="grid grid-cols-2 gap-1.5">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/futsal-management/${futsal.id}`)}
                              iconName="Edit"
                              className="border-green-600 text-green-700 hover:bg-green-50 text-xs h-8"
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteFutsal(futsal.id)}
                              iconName="Trash2"
                              className="border-red-600 text-red-700 hover:bg-red-50 text-xs h-8"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </AnimatedGrid>
              )}
            </div>
            {/* Manage Courts Section */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold mb-4">Manage Courts</h2>
              {/* CourtManagement form moved here */}
              {/* You may want to fetch courts and pass them as props here */}
              {/* Example: <CourtManagement courts={myCourts} onAdd={...} onEdit={...} onDelete={...} /> */}
            </div>
            {/* Recent Bookings */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
              {recentBookings.length === 0 ? (
                <div className="text-muted-foreground">No recent bookings.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow border border-border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Futsal</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Court</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Time</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Player</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map(b => (
                        <tr key={b.id}>
                          <td className="px-4 py-2 text-sm">{b.futsal}</td>
                          <td className="px-4 py-2 text-sm">{b.court}</td>
                          <td className="px-4 py-2 text-sm">{b.date}</td>
                          <td className="px-4 py-2 text-sm">{b.time}</td>
                          <td className="px-4 py-2 text-sm">{b.player}</td>
                          <td className="px-4 py-2 text-sm">{b.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </ErrorBoundary>
  );
};

export default FutsalOwnerDashboard;
