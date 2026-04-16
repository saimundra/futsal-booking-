import React, { useState } from 'react';
import Icon from './AppIcon';
import AppImage from './AppImage';

const VenueDetailsModal = ({ isOpen, onClose, futsal }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !futsal) return null;

  const allImages = [
    ...(futsal.cover_image ? [{ image: futsal.cover_image, caption: 'Cover Image' }] : []),
    ...(futsal.images || [])
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
        >
          <Icon name="X" size={20} className="text-gray-700" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold mb-1">{futsal.name}</h2>
          <div className="flex items-center gap-2 text-green-100">
            <Icon name="MapPin" size={16} />
            <span className="text-sm">{futsal.address}, {futsal.city}</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Left Side - Map */}
          <div className="p-6 bg-gray-50 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Icon name="MapPin" size={20} className="text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Location</h3>
                <p className="text-xs text-gray-500">View on Google Maps</p>
              </div>
            </div>

            {futsal.map_link ? (
              <div className="flex-1 relative rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 min-h-[400px]">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(futsal.address + ', ' + futsal.city)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <Icon name="MapPin" size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Map not available</p>
                </div>
              </div>
            )}

            {futsal.map_link && (
              <button
                onClick={() => window.open(futsal.map_link, '_blank')}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all"
              >
                <Icon name="ExternalLink" size={18} />
                <span className="font-medium">Open in Google Maps</span>
              </button>
            )}
          </div>

          {/* Right Side - Images */}
          <div className="p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon name="Image" size={20} className="text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Gallery</h3>
                <p className="text-xs text-gray-500">{allImages.length} image{allImages.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {allImages.length > 0 ? (
              <>
                {/* Main Image */}
                <div className="relative flex-1 rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 min-h-[300px] mb-4">
                  <AppImage
                    src={allImages[activeImageIndex].image}
                    alt={allImages[activeImageIndex].caption || futsal.name}
                    className="w-full h-full object-cover"
                  />
                  {allImages[activeImageIndex].caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm font-medium">{allImages[activeImageIndex].caption}</p>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                      >
                        <Icon name="ChevronLeft" size={20} className="text-gray-700" />
                      </button>
                      <button
                        onClick={() => setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                      >
                        <Icon name="ChevronRight" size={20} className="text-gray-700" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Grid */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          activeImageIndex === index
                            ? 'border-green-500 ring-2 ring-green-200'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <AppImage
                          src={img.image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <Icon name="Image" size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No images available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailsModal;
