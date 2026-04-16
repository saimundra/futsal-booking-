import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: 'Create Booking',
      description: 'Add new court reservation',
      icon: 'Plus',
      iconColor: 'bg-primary',
      action: 'create-booking'
    },
    {
      id: 2,
      title: 'Manage Customers',
      description: 'View and edit customer profiles',
      icon: 'Users',
      iconColor: 'bg-secondary',
      action: 'manage-customers'
    },
    {
      id: 3,
      title: 'Court Schedule',
      description: 'View and manage court availability',
      icon: 'Calendar',
      iconColor: 'bg-accent',
      action: 'court-schedule',
      link: '/court-schedule-management'
    },
    {
      id: 4,
      title: 'Generate Report',
      description: 'Create revenue and analytics reports',
      icon: 'FileText',
      iconColor: 'bg-success',
      action: 'generate-report'
    },
    {
      id: 5,
      title: 'Payment Tracking',
      description: 'Monitor pending and completed payments',
      icon: 'CreditCard',
      iconColor: 'bg-warning',
      action: 'payment-tracking'
    },
    {
      id: 6,
      title: 'Maintenance Mode',
      description: 'Schedule court maintenance',
      icon: 'Settings',
      iconColor: 'bg-muted',
      action: 'maintenance'
    }
  ];

  const handleAction = (actionType, link) => {
    if (link) {
      window.location.href = link;
    } else {
      console.log(`Action triggered: ${actionType}`);
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-athletic">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">Quick Actions</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Common administrative tasks</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => handleAction(action?.action, action?.link)}
            className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary hover:shadow-athletic-sm transition-athletic text-left group"
          >
            <div className={`w-10 h-10 rounded-lg ${action?.iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-250`}>
              <Icon name={action?.icon} size={20} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-250">
                {action?.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {action?.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;