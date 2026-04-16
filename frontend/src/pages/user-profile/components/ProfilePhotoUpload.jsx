import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';

const ProfilePhotoUpload = ({ avatar, avatarAlt, onPhotoChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          onPhotoChange?.(reader?.result);
          setIsUploading(false);
        };
        reader?.readAsDataURL(file);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border bg-muted">
          {avatar ? (
            <AppImage
              src={avatar}
              alt={avatarAlt || 'User profile photo'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <Icon name="User" size={40} className="text-primary" />
            </div>
          )}
        </div>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="animate-spin">
              <Icon name="Loader" size={24} className="text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold text-foreground mb-1">Profile Photo</h3>
        <p className="text-xs text-muted-foreground mb-3">Upload a photo to personalize your account</p>
        <div className="flex flex-wrap gap-2">
          <label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="sr-only"
              disabled={isUploading}
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
              iconPosition="left"
              disabled={isUploading}
              asChild
            >
              <span>Upload Photo</span>
            </Button>
          </label>
          {avatar && (
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => onPhotoChange?.('')}
              disabled={isUploading}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;