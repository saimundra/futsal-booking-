import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import AppImage from '../../components/AppImage';

const defaultFutsal = {
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
  amenities: [],
  operating_hours: {},
  payment_methods: [],
  is_active: true,
  cover_image: '',
};

const FutsalForm = ({ initialData = defaultFutsal, onSubmit, loading }) => {
  const [form, setForm] = useState(initialData);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleImageChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, cover_image: file }));
      // For preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, cover_image_preview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.address) {
      setError('Name, address, and city are required.');
      return;
    }
    setError('');
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Icon name="PlusCircle" size={24} className="text-green-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Add New Futsal Venue</h1>
            <p className="text-gray-500 mt-1">Create a new futsal venue listing to attract players</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image Upload */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Icon name="Image" size={20} className="text-green-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Venue Photo</h2>
                <p className="text-sm text-gray-500">Showcase your facility</p>
              </div>
            </div>

            <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 mb-4 hover:border-green-500 transition-colors">
              {form.cover_image_preview ? (
                <div className="relative w-full h-full group">
                  <AppImage
                    src={form.cover_image_preview}
                    alt={form.name || 'Futsal venue'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <Icon name="Eye" size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                  <Icon name="Image" size={48} className="text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-600">No photo uploaded</p>
                  <p className="text-xs text-gray-400 mt-1">Upload an image to preview</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  iconName="Upload" 
                  iconPosition="left"
                  size="sm"
                  fullWidth
                  className="border-green-600 text-green-700 hover:bg-green-50"
                >
                  {form.cover_image_preview ? 'Change Photo' : 'Upload Photo'}
                </Button>
              </label>
              {form.cover_image_preview && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  fullWidth
                  iconName="Trash2"
                  iconPosition="left"
                  onClick={() => setForm((prev) => ({ ...prev, cover_image: '', cover_image_preview: '' }))}
                  className="text-red-600 hover:bg-red-50"
                >
                  Remove Photo
                </Button>
              )}
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} className="text-green-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-green-800 mb-1">Photo Tips</p>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Use high-quality images</li>
                    <li>• Show the full venue</li>
                    <li>• Natural lighting is best</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-green-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
                <p className="text-sm text-gray-500">Essential venue details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input 
                  label="Futsal Venue Name" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter venue name"
                />
              </div>
              <Input 
                label="City" 
                name="city" 
                value={form.city} 
                onChange={handleChange} 
                required 
                placeholder="Enter city"
              />
              <Input 
                label="Address" 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                required 
                placeholder="Street address"
              />
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Icon name="Phone" size={20} className="text-green-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                <p className="text-sm text-gray-500">How players can reach you</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Contact Phone" 
                name="contact_phone" 
                value={form.contact_phone} 
                onChange={handleChange} 
                required 
                placeholder="+977 98XXXXXXXX"
                type="tel"
              />
              <Input 
                label="Contact Email" 
                name="contact_email" 
                value={form.contact_email} 
                onChange={handleChange} 
                required 
                placeholder="venue@example.com"
                type="email"
              />
              <div className="md:col-span-2">
                <Input 
                  label="Google Maps Link" 
                  name="map_link" 
                  value={form.map_link} 
                  onChange={handleChange} 
                  placeholder="https://maps.google.com/?q=..."
                  type="url"
                />
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Icon name="Info" size={12} />
                  Paste your Google Maps link so players can find your venue easily
                </p>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Icon name="AlignLeft" size={20} className="text-green-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Description</h2>
                <p className="text-sm text-gray-500">Tell players about your venue</p>
              </div>
            </div>

            <Input 
              label="Venue Description" 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              multiline 
              placeholder="Describe your futsal venue, facilities, amenities, and what makes it special..."
              rows={5}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <Icon name="AlertCircle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={loading} 
                iconName="Check" 
                iconPosition="left" 
                size="lg"
                className="bg-green-700 text-white hover:bg-green-800 focus:ring-2 focus:ring-green-600 px-8"
              >
                {loading ? 'Creating Venue...' : 'Create Futsal Venue'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FutsalForm;
