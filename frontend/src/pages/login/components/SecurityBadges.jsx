import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const badges = [
    {
      id: 1,
      icon: 'Shield',
      title: 'SSL Secured',
      description: '256-bit encryption'
    },
    {
      id: 2,
      icon: 'Lock',
      title: 'Secure Payments',
      description: 'PCI DSS compliant'
    },
    {
      id: 3,
      icon: 'CheckCircle',
      title: 'Verified Platform',
      description: 'Trusted by 10,000+ users'
    }
  ];

  return (
    <div className="pt-6 border-t border-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {badges?.map((badge) => (
          <div
            key={badge?.id}
            className="flex flex-col items-center text-center space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-250"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name={badge?.icon} size={20} className="text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-medium text-foreground">
                {badge?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {badge?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;