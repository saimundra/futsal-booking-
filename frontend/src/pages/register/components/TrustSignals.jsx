import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Secure Registration',
      description: 'Your personal information is encrypted and protected'
    },
    {
      icon: 'Lock',
      title: 'Privacy First',
      description: 'We never share your data with third parties'
    },
    {
      icon: 'CheckCircle',
      title: 'Verified Platform',
      description: 'Trusted by thousands of futsal players nationwide'
    },
    {
      icon: 'Clock',
      title: 'Quick Setup',
      description: 'Get started in less than 2 minutes'
    }
  ];

  return (
    <div className="mt-8 md:mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {trustFeatures?.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 md:p-5 bg-muted rounded-xl transition-athletic hover-lift"
          >
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name={feature?.icon} size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">
                {feature?.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 md:mt-8 p-4 md:p-6 bg-card rounded-xl border border-border">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm md:text-base font-semibold text-foreground mb-2">
              Why Create an Account?
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
                <span>Book courts instantly with real-time availability</span>
              </li>
              <li className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
                <span>Manage all your bookings in one place</span>
              </li>
              <li className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
                <span>Receive instant notifications for booking confirmations</span>
              </li>
              <li className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
                <span>Access exclusive member benefits and discounts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;