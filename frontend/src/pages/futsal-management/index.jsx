import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchFutsals, fetchCourts, createCourt, updateCourt, deleteCourt, deleteFutsal, updateFutsal, createFutsal } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import AppImage from '../../components/AppImage';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import FutsalGalleryManager from '../../components/FutsalGalleryManager';

const FutsalManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNewVenue = location.pathname === '/futsal-management/new';
  const isEditVenue = location.pathname.startsWith('/futsal-management/edit/') || 
                      (location.pathname !== '/futsal-management/new' && 
                       location.pathname !== '/futsal-management' && 
                       location.pathname.startsWith('/futsal-management/'));
  const editVenueId = isEditVenue ? parseInt(location.pathname.split('/').pop()) : null;
  
  const [futsals, setFutsals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFutsal, setExpandedFutsal] = useState(null);
  
  // Venue form state
  const [venueForm, setVenueForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    contact_phone: '',
    contact_email: '',
    website: '',
    map_link: '',
    description: '',
    cover_image: null,
    is_active: true,
  });
  const [venueFormSubmitting, setVenueFormSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [courtForm, setCourtForm] = useState({
    name: '',
    court_number: '',
    court_type: 'indoor',
    surface_type: 'artificial_turf',
    max_players: 10,
    hourly_rate: '',
    is_active: true,
  });
  const [editingCourt, setEditingCourt] = useState(null);
  const [courtFormVisible, setCourtFormVisible] = useState(null);

  const token = localStorage.getItem('accessToken');
  // Force futsal_owner role for this page
  const userRole = 'futsal_owner';

  useEffect(() => {
    loadFutsals();
  }, []);

  useEffect(() => {
    // Load venue data for editing
    if (isEditVenue && editVenueId && futsals.length > 0) {
      const venueToEdit = futsals.find(f => f.id === editVenueId);
      if (venueToEdit) {
        setVenueForm({
          name: venueToEdit.name || '',
          address: venueToEdit.address || '',
          city: venueToEdit.city || '',
          state: venueToEdit.state || '',
          postal_code: venueToEdit.postal_code || '',
          contact_phone: venueToEdit.contact_phone || '',
          contact_email: venueToEdit.contact_email || '',
          website: venueToEdit.website || '',
          map_link: venueToEdit.map_link || '',
          description: venueToEdit.description || '',
          cover_image: null,
          is_active: venueToEdit.is_active,
        });
        if (venueToEdit.cover_image) {
          setImagePreview(venueToEdit.cover_image);
        }
      }
    }
  }, [isEditVenue, editVenueId, futsals]);

  const loadFutsals = async () => {
    setLoading(true);
    try {
      const res = await fetchFutsals({ my: true });
      setFutsals(Array.isArray(res.results) ? res.results : []);
    } catch (err) {
      console.error('Failed to load futsals:', err);
      setFutsals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleToggleExpand = (futsalId) => {
    setExpandedFutsal(expandedFutsal === futsalId ? null : futsalId);
    setCourtFormVisible(null);
    resetCourtForm();
  };

  const handleToggleActive = async (futsal) => {
    const action = futsal.is_active ? 'unlist' : 'list';
    if (!window.confirm(`Are you sure you want to ${action} "${futsal.name}"?`)) return;
    
    try {
      const updated = await updateFutsal(futsal.id, { is_active: !futsal.is_active }, token);
      setFutsals(prev => prev.map(f => f.id === futsal.id ? updated : f));
    } catch (err) {
      alert(`Failed to ${action} futsal: ` + err.message);
    }
  };

  const handleDeleteFutsal = async (futsal) => {
    if (!window.confirm(`Are you sure you want to delete "${futsal.name}"? This action cannot be undone.`)) return;
    
    try {
      await deleteFutsal(futsal.id, token);
      setFutsals(prev => prev.filter(f => f.id !== futsal.id));
    } catch (err) {
      alert('Failed to delete futsal: ' + err.message);
    }
  };

  const resetCourtForm = () => {
    setCourtForm({
      name: '',
      court_number: '',
      court_type: 'indoor',
      surface_type: 'artificial_turf',
      max_players: 10,
      hourly_rate: '',
      is_active: true,
    });
    setEditingCourt(null);
  };

  const handleCourtFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourtForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddCourt = (futsalId) => {
    setCourtFormVisible(futsalId);
    resetCourtForm();
  };

  const handleEditCourt = (court) => {
    setEditingCourt(court.id);
    setCourtForm({
      name: court.name,
      court_number: court.court_number,
      court_type: court.court_type || 'indoor',
      surface_type: court.surface_type || 'artificial_turf',
      max_players: court.max_players || 10,
      hourly_rate: court.hourly_rate,
      is_active: court.is_active,
    });
    setCourtFormVisible(court.futsal);
  };

  const handleSubmitCourt = async (e, futsalId) => {
    e.preventDefault();
    if (!courtForm.name || !courtForm.court_number || !courtForm.hourly_rate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const courtData = { ...courtForm, futsal: futsalId };
      
      if (editingCourt) {
        await updateCourt(editingCourt, courtData, token);
      } else {
        await createCourt(courtData, token);
      }
      
      await loadFutsals();
      setCourtFormVisible(null);
      resetCourtForm();
    } catch (err) {
      alert('Failed to save court: ' + err.message);
    }
  };

  const handleDeleteCourt = async (courtId) => {
    if (!window.confirm('Are you sure you want to delete this court?')) return;
    
    try {
      await deleteCourt(courtId, token);
      await loadFutsals();
    } catch (err) {
      alert('Failed to delete court: ' + err.message);
    }
  };

  // Venue form handlers
  const handleVenueFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      setVenueForm(prev => ({
        ...prev,
        cover_image: file
      }));
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setVenueForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCreateVenue = async (e) => {
    e.preventDefault();
    setVenueFormSubmitting(true);
    
    try {
      if (isEditVenue && editVenueId) {
        await updateFutsal(editVenueId, venueForm, token);
        alert('Venue updated successfully!');
      } else {
        await createFutsal(venueForm, token);
        alert('Venue created successfully!');
      }
      navigate('/futsal-management');
    } catch (err) {
      alert(`Failed to ${isEditVenue ? 'update' : 'create'} venue: ` + err.message);
    } finally {
      setVenueFormSubmitting(false);
    }
  };

  const resetVenueForm = () => {
    setVenueForm({
      name: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      contact_phone: '',
      contact_email: '',
      website: '',
      map_link: '',
      description: '',
      cover_image: null,
      is_active: true,
    });
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole={userRole} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pt-24 md:pt-28">
        {isNewVenue || isEditVenue ? (
          /* Venue Creation/Edit Form */
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  onClick={() => navigate('/futsal-management')}
                  variant="outline"
                  iconName="ArrowLeft"
                  iconPosition="left"
                  size="sm"
                >
                  Back to Venues
                </Button>
              </div>
              <h1 className="text-h3 font-heading text-foreground mb-2">
                {isEditVenue ? 'Edit Venue' : 'Add New Venue'}
              </h1>
              <p className="text-body text-muted-foreground">
                {isEditVenue ? 'Update your futsal venue details' : 'Create a new futsal venue'}
              </p>
            </div>

            {/* Creation Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <form onSubmit={handleCreateVenue} className="space-y-6">
                {/* Image Upload Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Cover Image
                  </label>
                  <div className="flex items-start gap-6">
                    {imagePreview && (
                      <div className="w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        name="cover_image"
                        accept="image/*"
                        onChange={handleVenueFormChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        PNG, JPG, JPEG up to 5MB. Recommended size: 1200x600px
                      </p>
                      {!isEditVenue && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800 font-medium flex items-center gap-1">
                            <Icon name="Info" size={14} />
                            You can add more images to the gallery after creating the venue
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={venueForm.name}
                      onChange={handleVenueFormChange}
                      placeholder="e.g., Kathmandu Futsal Arena"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <Input
                      type="tel"
                      name="contact_phone"
                      value={venueForm.contact_phone}
                      onChange={handleVenueFormChange}
                      placeholder="e.g., 9841234567"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <Input
                      type="email"
                      name="contact_email"
                      value={venueForm.contact_email}
                      onChange={handleVenueFormChange}
                      placeholder="e.g., info@futsalarena.com"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={venueForm.city}
                      onChange={handleVenueFormChange}
                      placeholder="e.g., Kathmandu"
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <Input
                      type="text"
                      name="address"
                      value={venueForm.address}
                      onChange={handleVenueFormChange}
                      placeholder="e.g., Thamel Marg, Ward 26"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State / Province
                    </label>
                    <Input
                      type="text"
                      name="state"
                      value={venueForm.state}
                      onChange={handleVenueFormChange}
                      placeholder="e.g., Bagmati"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <Input
                      type="text"
                      name="postal_code"
                      value={venueForm.postal_code}
                      onChange={handleVenueFormChange}
                      placeholder="e.g., 44600"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website (Optional)
                    </label>
                    <Input
                      type="url"
                      name="website"
                      value={venueForm.website}
                      onChange={handleVenueFormChange}
                      placeholder="e.g., https://futsalarena.com"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-green-600" />
                      Google Maps Link (Optional)
                    </label>
                    <Input
                      type="url"
                      name="map_link"
                      value={venueForm.map_link}
                      onChange={handleVenueFormChange}
                      placeholder="e.g., https://maps.google.com/?q=..."
                      className="w-full"
                    />
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-800 font-medium mb-1">📍 How to get your location link:</p>
                      <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                        <li>Open Google Maps and search for your venue</li>
                        <li>Click the "Share" button</li>
                        <li>Copy the link and paste it here</li>
                      </ol>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={venueForm.description}
                      onChange={handleVenueFormChange}
                      placeholder="Brief description of your venue..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={venueForm.is_active}
                        onChange={handleVenueFormChange}
                        className="w-4 h-4 text-green-700 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Set venue as active (visible to players)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={venueFormSubmitting}
                    iconName={venueFormSubmitting ? "Loader" : "Check"}
                    iconPosition="left"
                    className="bg-green-700 hover:bg-green-800 text-white"
                  >
                    {venueFormSubmitting 
                      ? (isEditVenue ? 'Updating...' : 'Creating...') 
                      : (isEditVenue ? 'Update Venue' : 'Create Venue')
                    }
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate('/futsal-management')}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
              
              {/* Gallery Manager - Only show in edit mode */}
              {isEditVenue && editVenueId && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <FutsalGalleryManager futsalId={editVenueId} />
                </div>
              )}
            </div>
          </>
        ) : (
          /* Venue List (existing code) */
          <>
        {/* Header */}
        <div className="mb-6 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-h3 font-heading text-foreground mb-2">Venue Management</h1>
              <p className="text-body text-muted-foreground">Manage your futsal venues and courts</p>
            </div>
            <Button
              onClick={() => navigate('/futsal-management/new')}
              iconName="Plus"
              iconPosition="left"
            >
              Add New Venue
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading venues...</p>
            </div>
          </div>
        ) : futsals.length === 0 ? (
          /* Empty State */
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <Icon name="Home" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Venues Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by adding your first futsal venue to begin managing bookings and courts.
            </p>
            <Button
              onClick={() => navigate('/futsal-management/new')}
              iconName="Plus"
              iconPosition="left"
            >
              Add Your First Venue
            </Button>
          </div>
        ) : (
          /* Venues List */
          <div className="space-y-6">
              {futsals.map(futsal => (
                <div key={futsal.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Venue Header */}
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Venue Image */}
                      <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-green-100 to-green-200">
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
                      </div>

                      {/* Venue Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{futsal.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Icon name="MapPin" size={16} />
                                {futsal.location || 'No location'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Phone" size={16} />
                                {futsal.contact_number || 'No phone'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {futsal.is_active ? (
                              <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Icon name="CheckCircle" size={14} />
                                Active
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Icon name="EyeOff" size={14} />
                                Unlisted
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-green-700">
                              {futsal.courts?.length || 0}
                            </div>
                            <div className="text-xs text-gray-600">Courts</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-blue-700">
                              {futsal.courts?.filter(c => c.is_active).length || 0}
                            </div>
                            <div className="text-xs text-gray-600">Active</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-purple-700">0</div>
                            <div className="text-xs text-gray-600">Bookings Today</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => handleToggleExpand(futsal.id)}
                            variant="outline"
                            size="sm"
                            iconName={expandedFutsal === futsal.id ? "ChevronUp" : "ChevronDown"}
                            iconPosition="right"
                            className="border-green-600 text-green-700 hover:bg-green-50"
                          >
                            {expandedFutsal === futsal.id ? 'Hide' : 'Manage'} Courts
                          </Button>
                          <Button
                            onClick={() => navigate(`/futsal-management/edit/${futsal.id}`)}
                            variant="outline"
                            size="sm"
                            iconName="Edit"
                            iconPosition="left"
                          >
                            Edit Venue
                          </Button>
                          <Button
                            onClick={() => handleToggleActive(futsal)}
                            variant="outline"
                            size="sm"
                            iconName={futsal.is_active ? "EyeOff" : "Eye"}
                            iconPosition="left"
                          >
                            {futsal.is_active ? 'Unlist' : 'List'}
                          </Button>
                          <Button
                            onClick={() => handleDeleteFutsal(futsal)}
                            variant="outline"
                            size="sm"
                            iconName="Trash2"
                            iconPosition="left"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Courts Section */}
                  {expandedFutsal === futsal.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-bold text-gray-900">Courts</h4>
                        <Button
                          onClick={() => handleAddCourt(futsal.id)}
                          size="sm"
                          iconName="Plus"
                          iconPosition="left"
                          className="bg-green-700 hover:bg-green-800 text-white"
                        >
                          Add Court
                        </Button>
                      </div>

                      {/* Court Form */}
                      {courtFormVisible === futsal.id && (
                        <div className="bg-white rounded-xl p-6 mb-6 border-2 border-green-200">
                          <h5 className="text-lg font-semibold text-gray-900 mb-4">
                            {editingCourt ? 'Edit Court' : 'Add New Court'}
                          </h5>
                          <form onSubmit={(e) => handleSubmitCourt(e, futsal.id)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Court Name*"
                              name="name"
                              value={courtForm.name}
                              onChange={handleCourtFormChange}
                              placeholder="e.g., Court A"
                              required
                            />
                            <Input
                              label="Court Number*"
                              name="court_number"
                              value={courtForm.court_number}
                              onChange={handleCourtFormChange}
                              placeholder="e.g., 1"
                              required
                            />
                            <Input
                              label="Hourly Rate (NPR)*"
                              name="hourly_rate"
                              type="number"
                              value={courtForm.hourly_rate}
                              onChange={handleCourtFormChange}
                              placeholder="e.g., 1500"
                              required
                            />
                            <Input
                              label="Max Players"
                              name="max_players"
                              type="number"
                              value={courtForm.max_players}
                              onChange={handleCourtFormChange}
                              min="1"
                            />
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Court Type
                              </label>
                              <select
                                name="court_type"
                                value={courtForm.court_type}
                                onChange={handleCourtFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              >
                                <option value="indoor">Indoor</option>
                                <option value="outdoor">Outdoor</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Surface Type
                              </label>
                              <select
                                name="surface_type"
                                value={courtForm.surface_type}
                                onChange={handleCourtFormChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              >
                                <option value="artificial_turf">Artificial Turf</option>
                                <option value="natural_grass">Natural Grass</option>
                                <option value="synthetic">Synthetic</option>
                              </select>
                            </div>
                            <div className="md:col-span-2 flex gap-3">
                              <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">
                                {editingCourt ? 'Update Court' : 'Add Court'}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setCourtFormVisible(null);
                                  resetCourtForm();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Courts List */}
                      {futsal.courts && futsal.courts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {futsal.courts.map(court => (
                            <div key={court.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h5 className="text-lg font-bold text-gray-900">{court.name}</h5>
                                  <p className="text-sm text-gray-600">#{court.court_number}</p>
                                </div>
                                {court.is_active ? (
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                                    Active
                                  </span>
                                ) : (
                                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Icon name="DollarSign" size={14} />
                                  <span>NPR {court.hourly_rate}/hr</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Icon name="Users" size={14} />
                                  <span>{court.max_players} players</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Icon name="Home" size={14} />
                                  <span className="capitalize">{court.court_type}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Icon name="Layers" size={14} />
                                  <span className="capitalize">{court.surface_type?.replace('_', ' ')}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleEditCourt(court)}
                                  variant="outline"
                                  size="sm"
                                  iconName="Edit"
                                  iconPosition="left"
                                  className="flex-1"
                                >
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleDeleteCourt(court.id)}
                                  variant="outline"
                                  size="sm"
                                  iconName="Trash2"
                                  iconPosition="left"
                                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                          <Icon name="Grid3x3" size={48} className="text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">No courts added yet</p>
                          <Button
                            onClick={() => handleAddCourt(futsal.id)}
                            size="sm"
                            iconName="Plus"
                            iconPosition="left"
                            className="bg-green-700 hover:bg-green-800 text-white"
                          >
                            Add First Court
                          </Button>
                        </div>
                      )}
                      
                      {/* Gallery Manager */}
                      <div className="mt-6">
                        <FutsalGalleryManager futsalId={futsal.id} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default FutsalManagement;