import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking':
        return 'CheckCircle';
      case 'cancellation':
        return 'XCircle';
      case 'modification':
        return 'Edit';
      case 'payment':
        return 'DollarSign';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'booking':
        return 'text-success';
      case 'cancellation':
        return 'text-error';
      case 'modification':
        return 'text-warning';
      case 'payment':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-card rounded-xl shadow-athletic p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">Recent Activity</h3>
          <p className="text-xs text-muted-foreground">Your booking history</p>
        </div>
        <Icon name="Activity" size={20} className="text-primary" />
      </div>
      <div className="space-y-3">
        {activities?.length === 0 ? (
          <div className="text-center py-6">
            <Icon name="Inbox" size={40} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          activities?.map((activity) => (
            <div
              key={activity?.id}
              className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-athletic-sm transition-all duration-250"
            >
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground mb-1">{activity?.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatTimestamp(activity?.timestamp)}</span>
                  {activity?.court && (
                    <>
                      <span>•</span>
                      <span>{activity?.court}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;