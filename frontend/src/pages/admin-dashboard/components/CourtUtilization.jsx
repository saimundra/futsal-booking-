import React from 'react';
import Icon from '../../../components/AppIcon';

const CourtUtilization = () => {
  const courts = [
    { 
      id: 1, 
      name: 'Court 1', 
      utilization: 85, 
      status: 'active',
      bookings: 12,
      revenue: 1800
    },
    { 
      id: 2, 
      name: 'Court 2', 
      utilization: 92, 
      status: 'active',
      bookings: 14,
      revenue: 2100
    },
    { 
      id: 3, 
      name: 'Court 3', 
      utilization: 78, 
      status: 'active',
      bookings: 10,
      revenue: 1500
    },
    { 
      id: 4, 
      name: 'Court 4', 
      utilization: 45, 
      status: 'maintenance',
      bookings: 6,
      revenue: 900
    }
  ];

  const getUtilizationColor = (utilization) => {
    if (utilization >= 80) return 'bg-success';
    if (utilization >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 text-success text-xs font-medium">
          <Icon name="CheckCircle" size={12} />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-warning/10 text-warning text-xs font-medium">
        <Icon name="AlertCircle" size={12} />
        Maintenance
      </span>
    );
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-athletic">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">Court Utilization</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Real-time court usage statistics</p>
        </div>
        <button className="p-2 rounded-lg hover:bg-muted transition-colors duration-250">
          <Icon name="MoreVertical" size={20} />
        </button>
      </div>
      <div className="space-y-4">
        {courts?.map((court) => (
          <div key={court?.id} className="border border-border rounded-lg p-4 hover:shadow-athletic-sm transition-athletic">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="Dribbble" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-semibold text-foreground">{court?.name}</h4>
                  <p className="text-xs text-muted-foreground">{court?.bookings} bookings today</p>
                </div>
              </div>
              {getStatusBadge(court?.status)}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Utilization</span>
                <span className="font-semibold text-foreground">{court?.utilization}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getUtilizationColor(court?.utilization)} transition-all duration-500`}
                  style={{ width: `${court?.utilization}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Revenue: ${court?.revenue}</span>
                <span>{court?.bookings} slots filled</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourtUtilization;