import React from 'react';
import Icon from '../../../components/AppIcon';

const CourtInfoPanel = ({ courtInfo }) => {
  return (
    <div className="bg-card rounded-xl shadow-athletic p-4 md:p-6 lg:p-8">
      <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-4 md:mb-6">
        Court Information
      </h3>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h4 className="text-base md:text-lg font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="MapPin" size={20} color="var(--color-primary)" />
            Location
          </h4>
          <p className="text-sm md:text-base text-muted-foreground pl-7">
            {courtInfo?.address}
          </p>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Sparkles" size={20} color="var(--color-primary)" />
            Amenities
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 pl-7">
            {courtInfo?.amenities?.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <Icon name="Check" size={16} color="var(--color-success)" />
                <span className="text-sm md:text-base text-muted-foreground">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="FileText" size={20} color="var(--color-primary)" />
            Booking Policies
          </h4>
          <div className="space-y-2 md:space-y-3 pl-7">
            {courtInfo?.policies?.map((policy, index) => (
              <div key={index} className="flex items-start gap-2">
                <Icon name="Info" size={16} color="var(--color-primary)" className="mt-1 flex-shrink-0" />
                <p className="text-sm md:text-base text-muted-foreground">{policy}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="AlertCircle" size={20} color="var(--color-warning)" />
            Cancellation Policy
          </h4>
          <p className="text-sm md:text-base text-muted-foreground pl-7">
            {courtInfo?.cancellationPolicy}
          </p>
        </div>

        <div className="bg-muted rounded-lg p-3 md:p-4">
          <div className="flex items-start gap-3">
            <Icon name="Phone" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm md:text-base font-medium text-foreground mb-1">
                Need help?
              </p>
              <p className="text-sm text-muted-foreground">
                Contact us at {courtInfo?.contactPhone} or {courtInfo?.contactEmail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtInfoPanel;