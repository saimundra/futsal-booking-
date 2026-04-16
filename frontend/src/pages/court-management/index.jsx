import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import { fetchCourts, createCourt, updateCourt, deleteCourt, fetchFutsals } from '../../services/api';

const CourtManagement = () => {
  const navigate = useNavigate();
  const [courts, setCourts] = useState([]);
  const [futsals, setFutsals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

  const [formData, setFormData] = useState({
    futsal: '',
    name: '',
    court_number: '',
    court_type: 'indoor',
    surface_type: 'artificial_turf',
    max_players: 10,
    hourly_rate: '',
    has_lighting: true,
    has_changing_rooms: true,
    has_parking: true,
    description: '',
    is_active: true
  });

  const courtTypeOptions = [
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' }
  ];

  const surfaceTypeOptions = [
    { value: 'artificial_turf', label: 'Artificial Turf' },
    { value: 'natural_grass', label: 'Natural Grass' },
    { value: 'synthetic', label: 'Synthetic' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('accessToken');
      
      const [courtsRes, futsalsRes] = await Promise.all([
        fetchCourts({ my: 'true' }),
        fetchFutsals({ my: 'true' })
      ]);

      setCourts(Array.isArray(courtsRes.results) ? courtsRes.results : courtsRes);
      setFutsals(Array.isArray(futsalsRes.results) ? futsalsRes.results : futsalsRes);
      
      // Auto-select first futsal if available
      if (futsalsRes.results && futsalsRes.results.length > 0 && !formData.futsal) {
        setFormData(prev => ({ ...prev, futsal: futsalsRes.results[0].id }));
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load courts and venues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.futsal) {
      setError('Please select a futsal venue');
      return;
    }

    try {
      setError('');
      const token = localStorage.getItem('accessToken');
      
      const courtData = {
        futsal: parseInt(formData.futsal),
        name: formData.name,
        court_number: formData.court_number,
        court_type: formData.court_type,
        surface_type: formData.surface_type,
        max_players: parseInt(formData.max_players),
        hourly_rate: parseFloat(formData.hourly_rate),
        has_lighting: formData.has_lighting,
        has_changing_rooms: formData.has_changing_rooms,
        has_parking: formData.has_parking,
        description: formData.description,
        is_active: formData.is_active
      };

      if (editingCourt) {
        await updateCourt(editingCourt.id, courtData, token);
        setSuccessMessage('Court updated successfully!');
      } else {
        await createCourt(courtData, token);
        setSuccessMessage('Court created successfully!');
      }

      await loadData();
      resetForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving court:', err);
      setError(err.message || 'Failed to save court. Please check your input and try again.');
    }
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setFormData({
      futsal: court.futsal?.id || court.futsal || '',
      name: court.name,
      court_number: court.court_number,
      court_type: court.court_type,
      surface_type: court.surface_type,
      max_players: court.max_players,
      hourly_rate: court.hourly_rate,
      has_lighting: court.has_lighting,
      has_changing_rooms: court.has_changing_rooms,
      has_parking: court.has_parking,
      description: court.description || '',
      is_active: court.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (courtId) => {
    if (!window.confirm('Are you sure you want to delete this court?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await deleteCourt(courtId, token);
      setSuccessMessage('Court deleted successfully!');
      await loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting court:', err);
      setError('Failed to delete court. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      futsal: futsals.length > 0 ? futsals[0].id : '',
      name: '',
      court_number: '',
      court_type: 'indoor',
      surface_type: 'artificial_turf',
      max_players: 10,
      hourly_rate: '',
      has_lighting: true,
      has_changing_rooms: true,
      has_parking: true,
      description: '',
      is_active: true
    });
    setEditingCourt(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedNavigation userRole="futsal_owner" onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-[60vh] pt-24 md:pt-28">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading courts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole="futsal_owner" onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pt-24 md:pt-28">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-h3 font-heading text-foreground mb-2">Court Management</h1>
              <p className="text-body text-muted-foreground">Manage your futsal courts</p>
            </div>
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Add New Court
              </Button>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <p className="text-sm text-success font-medium">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
            <Icon name="AlertCircle" size={20} className="text-destructive" />
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        {futsals.length === 0 && (
          <div className="mb-6 p-6 bg-card border border-border rounded-lg text-center">
            <Icon name="AlertCircle" size={40} className="text-warning mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Futsal Venues Found</h3>
            <p className="text-muted-foreground mb-4">You need to create a futsal venue before adding courts.</p>
            <Button onClick={() => navigate('/futsal-management/new')}>Create Futsal Venue</Button>
          </div>
        )}

        {showForm && futsals.length > 0 && (
          <div className="mb-8 bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {editingCourt ? 'Edit Court' : 'Add New Court'}
              </h2>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <Icon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Futsal Venue *
                  </label>
                  <select
                    name="futsal"
                    value={formData.futsal}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  >
                    <option value="">Select a venue</option>
                    {futsals.map((futsal) => (
                      <option key={futsal.id} value={futsal.id}>
                        {futsal.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Court Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Court A"
                />

                <Input
                  label="Court Number"
                  name="court_number"
                  value={formData.court_number}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., C001"
                />

                <Select
                  label="Court Type"
                  options={courtTypeOptions}
                  value={formData.court_type}
                  onChange={(value) => setFormData(prev => ({ ...prev, court_type: value }))}
                />

                <Select
                  label="Surface Type"
                  options={surfaceTypeOptions}
                  value={formData.surface_type}
                  onChange={(value) => setFormData(prev => ({ ...prev, surface_type: value }))}
                />

                <Input
                  label="Max Players"
                  name="max_players"
                  type="number"
                  min="1"
                  value={formData.max_players}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Hourly Rate (NPR)"
                  name="hourly_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.hourly_rate}
                  onChange={handleInputChange}
                  required
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    placeholder="Additional information about the court..."
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="block text-sm font-medium text-foreground mb-2">Features</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="has_lighting"
                        checked={formData.has_lighting}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">Has Lighting</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="has_changing_rooms"
                        checked={formData.has_changing_rooms}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">Has Changing Rooms</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="has_parking"
                        checked={formData.has_parking}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">Has Parking</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" iconName="Save" iconPosition="left">
                  {editingCourt ? 'Update Court' : 'Create Court'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Your Courts ({courts.length})</h2>
          </div>

          {courts.length === 0 ? (
            <div className="p-12 text-center">
              <Icon name="Square" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Courts Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first court to start accepting bookings</p>
              {futsals.length > 0 && (
                <Button onClick={() => setShowForm(true)} iconName="Plus" iconPosition="left">
                  Add Your First Court
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {courts.map((court) => (
                <div key={court.id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{court.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          court.is_active 
                            ? 'bg-success/10 text-success' 
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {court.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Icon name="Hash" size={16} />
                          <span>{court.court_number}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={16} />
                          <span>{court.court_type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Users" size={16} />
                          <span>{court.max_players} players</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="DollarSign" size={16} />
                          <span>NPR {court.hourly_rate}/hr</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {court.has_lighting && (
                          <span className="px-2 py-1 bg-muted rounded text-xs text-foreground flex items-center gap-1">
                            <Icon name="Zap" size={12} /> Lighting
                          </span>
                        )}
                        {court.has_changing_rooms && (
                          <span className="px-2 py-1 bg-muted rounded text-xs text-foreground flex items-center gap-1">
                            <Icon name="Home" size={12} /> Changing Rooms
                          </span>
                        )}
                        {court.has_parking && (
                          <span className="px-2 py-1 bg-muted rounded text-xs text-foreground flex items-center gap-1">
                            <Icon name="Car" size={12} /> Parking
                          </span>
                        )}
                      </div>

                      {court.futsal && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Venue: {court.futsal.name || `Futsal #${court.futsal}`}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(court)}
                        iconName="Edit"
                        iconPosition="left"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(court.id)}
                        iconName="Trash2"
                        iconPosition="left"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourtManagement;
