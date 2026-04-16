import React, { useState, useEffect } from 'react';
import Icon from './AppIcon';
import AppImage from './AppImage';
import Button from './ui/Button';
import { fetchFutsalImages, uploadFutsalImage, deleteFutsalImage } from '../services/api';

const FutsalGalleryManager = ({ futsalId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (futsalId) {
      loadImages();
    }
  }, [futsalId]);

  const loadImages = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const data = await fetchFutsalImages(futsalId, token);
      setImages(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to load images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const token = localStorage.getItem('accessToken');

    try {
      // Upload each file
      for (const file of selectedFiles) {
        await uploadFutsalImage({
          futsal: futsalId,
          image: file,
          caption: '',
          is_featured: false,
          display_order: images.length
        }, token);
      }

      // Reload images
      await loadImages();
      setSelectedFiles([]);
      
      // Reset file input
      const fileInput = document.getElementById('gallery-file-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Failed to upload images:', err);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      await deleteFutsalImage(imageId, token);
      await loadImages();
    } catch (err) {
      console.error('Failed to delete image:', err);
      alert('Failed to delete image. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Icon name="Image" size={24} className="text-blue-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Venue Gallery</h2>
            <p className="text-sm text-gray-500">{images.length} image{images.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="flex flex-col items-center gap-4">
          <Icon name="Upload" size={40} className="text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">Upload Images</p>
            <p className="text-xs text-gray-500">Select multiple images to upload to your venue gallery</p>
          </div>
          <input
            id="gallery-file-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="gallery-file-input">
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
              iconPosition="left"
              className="cursor-pointer"
              onClick={() => document.getElementById('gallery-file-input').click()}
            >
              Select Images
            </Button>
          </label>
          
          {selectedFiles.length > 0 && (
            <div className="w-full">
              <p className="text-sm text-gray-700 mb-2">{selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected</p>
              <Button
                fullWidth
                onClick={handleUpload}
                disabled={uploading}
                iconName={uploading ? "Loader" : "Upload"}
                iconPosition="left"
                className="bg-green-700 text-white hover:bg-green-800"
              >
                {uploading ? 'Uploading...' : 'Upload Selected Images'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={32} className="text-gray-400 animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Image" size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No images uploaded yet</p>
          <p className="text-xs text-gray-400 mt-1">Upload images to showcase your venue</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-500 transition-all"
            >
              <AppImage
                src={image.image}
                alt={image.caption || 'Venue image'}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with Delete Button */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                <button
                  onClick={() => handleDelete(image.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
                >
                  <Icon name="Trash2" size={18} className="text-white" />
                </button>
              </div>

              {image.is_featured && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Icon name="Star" size={12} />
                  Featured
                </div>
              )}

              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs truncate">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            These images will be displayed in the venue gallery when players view your venue details. Upload high-quality photos to attract more bookings!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FutsalGalleryManager;
