import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import { fetchFutsals, fetchCourts } from '../../services/api';

const FutsalOwnerDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [myFutsals, setMyFutsals] = useState([]);
  const [myCourts, setMyCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchFutsals({ my: true }),
      fetchCourts({ my: true })
    ])
      .then(([futsals, courts]) => {
        setMyFutsals(futsals);
        setMyCourts(courts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  // TODO: Integrate real metrics and booking data from backend
  const metrics = [];

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole="futsal_owner" onLogout={handleLogout} />
      <main className="pt-24 md:pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Futsal Owner Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  {currentTime?.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {currentTime?.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              <div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg mr-2" onClick={() => navigate('/futsal-management/new')}>Add New Futsal</button>
                <button className="bg-secondary text-white px-4 py-2 rounded-lg" onClick={() => navigate('/court-schedule-management')}>Add New Court</button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-16">Loading your futsals and courts...</div>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="text-lg font-semibold mb-4">Your Futsal Venues</h2>
                {myFutsals.length === 0 ? (
                  <div className="text-muted-foreground">You have not added any futsal venues yet.</div>
                ) : (
                  <div className="space-y-6">
                    {myFutsals.map(futsal => (
                      <div key={futsal.id} className="bg-white rounded-xl shadow-md p-6 border border-border">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <h2 className="text-xl font-bold text-primary mb-1">{futsal.name}</h2>
                            <div className="text-sm text-muted-foreground mb-1">{futsal.address}, {futsal.city}</div>
                            <div className="text-xs text-muted-foreground">{futsal.amenities?.join(', ')}</div>
                            <div className="text-xs text-success mt-1">{futsal.is_active ? 'Open' : 'Closed'}</div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <button className="bg-primary text-white px-3 py-1 rounded-lg" onClick={() => navigate(`/futsal-management/${futsal.id}`)}>Manage</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-10">
                <h2 className="text-lg font-semibold mb-4">Your Courts</h2>
                {myCourts.length === 0 ? (
                  <div className="text-muted-foreground">You have not added any courts yet.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myCourts.map(court => (
                      <div key={court.id} className="bg-white rounded-xl shadow-md p-6 border border-border flex flex-col gap-2">
                        <div className="font-semibold text-foreground">{court.name}</div>
                        <div className="text-xs text-muted-foreground">Type: {court.court_type}, Surface: {court.surface_type}</div>
                        <div className="text-xs text-muted-foreground">Max Players: {court.max_players}</div>
                        <div className="text-xs text-primary font-bold">NPR {court.hourly_rate} / hour</div>
                        <button className="bg-secondary text-white px-3 py-1 rounded-lg mt-2" onClick={() => navigate(`/court-schedule-management?court=${court.id}`)}>Manage</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default FutsalOwnerDashboard;