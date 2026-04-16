import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivity = () => {
  const activities = [
  {
    id: 1,
    type: 'booking',
    customer: 'Michael Rodriguez',
    customerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_103972665-1763296698542.png",
    customerImageAlt: 'Professional headshot of Hispanic man with short black hair wearing navy blue business suit and white shirt',
    action: 'New booking created',
    court: 'Court 2',
    time: '5 minutes ago',
    amount: 150,
    status: 'pending'
  },
  {
    id: 2,
    type: 'payment',
    customer: 'Sarah Johnson',
    customerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1ccaed995-1763294687911.png",
    customerImageAlt: 'Professional headshot of blonde woman with shoulder-length hair wearing light blue blouse and pearl necklace',
    action: 'Payment received',
    court: 'Court 1',
    time: '12 minutes ago',
    amount: 200,
    status: 'confirmed'
  },
  {
    id: 3,
    type: 'cancellation',
    customer: 'David Chen',
    customerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1bb8988be-1763295050652.png",
    customerImageAlt: 'Professional headshot of Asian man with short black hair wearing dark gray suit and burgundy tie',
    action: 'Booking cancelled',
    court: 'Court 3',
    time: '28 minutes ago',
    amount: 175,
    status: 'cancelled'
  },
  {
    id: 4,
    type: 'booking',
    customer: 'Emma Williams',
    customerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_169325fe9-1763297762481.png",
    customerImageAlt: 'Professional headshot of brunette woman with long wavy hair wearing white blouse and silver earrings',
    action: 'Booking confirmed',
    court: 'Court 4',
    time: '45 minutes ago',
    amount: 180,
    status: 'confirmed'
  },
  {
    id: 5,
    type: 'payment',
    customer: 'James Anderson',
    customerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1cef3e3c2-1763295620422.png",
    customerImageAlt: 'Professional headshot of Caucasian man with brown hair wearing charcoal suit and blue striped tie',
    action: 'Payment pending',
    court: 'Court 1',
    time: '1 hour ago',
    amount: 150,
    status: 'pending'
  }];


  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking':
        return { name: 'Calendar', color: 'bg-secondary' };
      case 'payment':
        return { name: 'DollarSign', color: 'bg-success' };
      case 'cancellation':
        return { name: 'XCircle', color: 'bg-error' };
      default:
        return { name: 'Activity', color: 'bg-muted' };
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-warning/10 text-warning', label: 'Pending' },
      confirmed: { color: 'bg-success/10 text-success', label: 'Confirmed' },
      cancelled: { color: 'bg-error/10 text-error', label: 'Cancelled' }
    };
    const badge = badges?.[status];
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${badge?.color}`}>
        {badge?.label}
      </span>);

  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-athletic">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">Recent Activity</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Latest booking updates and transactions</p>
        </div>
        <Button variant="ghost" size="sm" iconName="RefreshCw">
          Refresh
        </Button>
      </div>
      <div className="space-y-3">
        {activities?.map((activity) => {
          const icon = getActivityIcon(activity?.type);
          return (
            <div
              key={activity?.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-250">

              <div className={`w-10 h-10 rounded-lg ${icon?.color} flex items-center justify-center flex-shrink-0`}>
                <Icon name={icon?.name} size={18} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={activity?.customerImage}
                      alt={activity?.customerImageAlt}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0" />

                    <p className="text-sm font-medium text-foreground truncate">{activity?.customer}</p>
                  </div>
                  {getStatusBadge(activity?.status)}
                </div>
                
                <p className="text-xs md:text-sm text-muted-foreground mb-2">
                  {activity?.action} • {activity?.court}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{activity?.time}</span>
                  <span className="text-sm font-semibold text-foreground">${activity?.amount}</span>
                </div>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-background transition-colors duration-250 flex-shrink-0">
                <Icon name="MoreVertical" size={16} />
              </button>
            </div>);

        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="outline" fullWidth iconName="ArrowRight" iconPosition="right">
          View All Activity
        </Button>
      </div>
    </div>);

};

export default RecentActivity;