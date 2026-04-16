import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFutsals, fetchCourts, fetchCourtSchedules, createCourtSchedule, deleteCourtSchedule } from '../../services/api';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const CourtScheduleManagement = () => {
  const navigate = useNavigate();
  const [futsals, setFutsals] = useState([]);
  const [selectedFutsal, setSelectedFutsal] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'player';

  // Redirect if not futsal owner
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (userRole !== 'futsal_owner' && userRole !== 'admin') {
      alert('Only futsal owners can access this page');
      navigate('/player-dashboard');
      return;
    }
  }, [token, userRole, navigate]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedFutsal) {
      loadSchedules();
    }
  }, [selectedFutsal, currentDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchFutsals({ my: true });
      const futsalsList = Array.isArray(res.results) ? res.results : [];
      setFutsals(futsalsList);
      if (futsalsList.length > 0) {
        setSelectedFutsal(futsalsList[0].id);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSchedules = async () => {
    try {
      const res = await fetchCourtSchedules();
      setSchedules(Array.isArray(res.results) ? res.results : res || []);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    }
  };

  const handleSlotClick = (court, time) => {
    console.log('Slot clicked:', court.name, time);
    setSelectedSlot({ court, time });
    setShowStatusModal(true);
  };

  const handleSetStatus = async (status) => {
    if (!selectedSlot) return;

    const { court, time } = selectedSlot;
    
    // Map UI status to backend schedule_type
    const scheduleTypeMap = {
      'booked': 'blocked',
      'pending': 'maintenance',
      'blocked': 'blocked'
    };
    
    const scheduleType = scheduleTypeMap[status] || 'blocked';
    
    // Get current day of week
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = daysOfWeek[new Date().getDay()];
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User role:', user.role);
    console.log('Token exists:', !!token);
    console.log('Court ID:', court.id);
    
    const scheduleData = {
      court: court.id,
      day_of_week: dayOfWeek,
      start_time: time + ':00',
      end_time: `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
      schedule_type: scheduleType,
      notes: `Marked as ${status} by owner`
    };
    console.log('Schedule data:', scheduleData);
    
    try {
      // Create schedule block
      await createCourtSchedule(scheduleData, token);
      
      await loadSchedules();
      setShowStatusModal(false);
      setSelectedSlot(null);
      alert('Time slot status updated successfully!');
    } catch (err) {
      console.error('Failed to set status:', err);
      alert('Failed to set status: ' + err.message);
    }
  };

  const getSlotStatus = (court, time) => {
    const schedule = schedules.find(s => 
      s.court === court.id && 
      s.start_time === time + ':00'
    );
    
    if (schedule) {
      if (schedule.schedule_type === 'blocked') return 'blocked';
      if (schedule.schedule_type === 'maintenance') return 'pending';
    }
    return 'available';
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const selectedFutsalData = futsals.find(f => f.id === selectedFutsal);
  const courts = selectedFutsalData?.courts || [];
  const filteredCourts = selectedCourt === 'all' ? courts : courts.filter(c => c.id === parseInt(selectedCourt));

  // Generate time slots (6 AM to 11 PM)
  const timeSlots = [];
  for (let hour = 6; hour <= 23; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Get current week days
  const getWeekDays = () => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole={userRole} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pt-24 md:pt-28">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-h3 font-heading text-foreground mb-2">
                Court Schedule
              </h1>
              <p className="text-body text-muted-foreground">
                View and manage your court bookings
              </p>
              <p className="text-sm text-red-600 font-semibold mt-1">
                Current Role: {userRole} {userRole !== 'futsal_owner' && '(You need to be a futsal owner to manage schedules)'}
              </p>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="Calendar" size={24} className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {futsals.reduce((acc, f) => acc + (f.courts?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Courts</div>
                  </div>
                </div>
              </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} className="text-blue-700" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Today's Bookings</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Icon name="Clock" size={24} className="text-purple-700" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Icon name="DollarSign" size={24} className="text-orange-700" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">NPR 0</div>
                  <div className="text-sm text-gray-600">Today's Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading schedule...</p>
              </div>
            </div>
          ) : futsals.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Venues Found</h3>
              <p className="text-muted-foreground mb-6">
                Add a futsal venue first to manage court schedules.
              </p>
              <Button
                onClick={() => navigate('/futsal-management/new')}
                iconName="Plus"
                iconPosition="left"
              >
                Add Venue
              </Button>
            </div>
          ) : (
            <>
              {/* Venue & Court Selector */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Venue
                    </label>
                    <select
                      value={selectedFutsal || ''}
                      onChange={(e) => {
                        setSelectedFutsal(parseInt(e.target.value));
                        setSelectedCourt('all');
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {futsals.map(futsal => (
                        <option key={futsal.id} value={futsal.id}>
                          {futsal.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Court
                    </label>
                    <select
                      value={selectedCourt}
                      onChange={(e) => setSelectedCourt(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Courts</option>
                      {courts.map(court => (
                        <option key={court.id} value={court.id}>
                          {court.name} (#{court.court_number})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Week Navigation */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      newDate.setDate(currentDate.getDate() - 7);
                      setCurrentDate(newDate);
                    }}
                    variant="outline"
                    size="sm"
                    iconName="ChevronLeft"
                    iconPosition="left"
                  >
                    Previous Week
                  </Button>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      newDate.setDate(currentDate.getDate() + 7);
                      setCurrentDate(newDate);
                    }}
                    variant="outline"
                    size="sm"
                    iconName="ChevronRight"
                    iconPosition="right"
                  >
                    Next Week
                  </Button>
                </div>
              </div>

              {/* Schedule Grid */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  {filteredCourts.length === 0 ? (
                    <div className="p-12 text-center">
                      <Icon name="Grid3x3" size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No courts available for this venue</p>
                      <Button
                        onClick={() => navigate('/futsal-management')}
                        size="sm"
                        iconName="Plus"
                        iconPosition="left"
                        className="bg-green-700 hover:bg-green-800 text-white"
                      >
                        Add Courts
                      </Button>
                    </div>
                  ) : (
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 sticky left-0 bg-gray-50">
                            Time / Court
                          </th>
                          {filteredCourts.map(court => (
                            <th key={court.id} className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                              <div>{court.name}</div>
                              <div className="text-xs font-normal text-gray-500">
                                #{court.court_number}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {timeSlots.map(time => (
                          <tr key={time} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-white">
                              {time}
                            </td>
                            {filteredCourts.map(court => (
                              <td key={`${time}-${court.id}`} className="px-2 py-2">
                                {(() => {
                                  const status = getSlotStatus(court, time);
                                  const statusColors = {
                                    available: 'border-gray-300 hover:border-green-500 hover:bg-green-50',
                                    booked: 'bg-green-500 border-green-500',
                                    pending: 'bg-yellow-500 border-yellow-500',
                                    blocked: 'bg-red-500 border-red-500'
                                  };
                                  const statusText = {
                                    available: 'Available',
                                    booked: 'Booked',
                                    pending: 'Pending',
                                    blocked: 'Blocked'
                                  };
                                  
                                  return (
                                    <div 
                                      onClick={() => handleSlotClick(court, time)}
                                      className={`h-12 rounded-lg border-2 ${status === 'available' ? 'border-dashed' : ''} ${statusColors[status]} cursor-pointer transition-all flex items-center justify-center`}
                                    >
                                      <span className={`text-xs ${status === 'available' ? 'text-gray-400' : 'text-white font-semibold'}`}>
                                        {statusText[status]}
                                      </span>
                                    </div>
                                  );
                                })()}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 bg-white rounded-xl p-4 shadow-md border border-gray-200">
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-dashed border-gray-300"></div>
                    <span className="text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="text-gray-600">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-500"></div>
                    <span className="text-gray-600">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span className="text-gray-600">Blocked</span>
                  </div>
                </div>
              </div>
            </>
          )}
      </div>

      {/* Status Selection Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Mark Time Slot</h3>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedSlot(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            {selectedSlot && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Court</p>
                <p className="font-semibold text-gray-800">{selectedSlot.court.name} (#{selectedSlot.court.court_number})</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Time Slot</p>
                <p className="font-semibold text-gray-800">{selectedSlot.time}</p>
              </div>
            )}

            <p className="text-gray-600 mb-6">Select the status for this time slot:</p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Booked button clicked');
                  handleSetStatus('booked');
                }}
                className="w-full flex items-center gap-3 p-4 border-2 border-green-500 bg-green-50 hover:bg-green-100 rounded-lg transition-all group"
              >
                <div className="w-6 h-6 rounded bg-green-500"></div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-800">Booked</p>
                  <p className="text-xs text-gray-600">Mark as confirmed booking</p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-green-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Pending button clicked');
                  handleSetStatus('pending');
                }}
                className="w-full flex items-center gap-3 p-4 border-2 border-yellow-500 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-all group"
              >
                <div className="w-6 h-6 rounded bg-yellow-500"></div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-800">Pending</p>
                  <p className="text-xs text-gray-600">Mark as pending confirmation</p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-yellow-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Blocked button clicked');
                  handleSetStatus('blocked');
                }}
                className="w-full flex items-center gap-3 p-4 border-2 border-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all group"
              >
                <div className="w-6 h-6 rounded bg-red-500"></div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-800">Blocked</p>
                  <p className="text-xs text-gray-600">Block this time slot</p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-red-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <button
              onClick={() => {
                setShowStatusModal(false);
                setSelectedSlot(null);
              }}
              className="w-full mt-6 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtScheduleManagement;