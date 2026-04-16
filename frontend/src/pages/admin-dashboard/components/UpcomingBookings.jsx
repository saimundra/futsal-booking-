import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingBookings = () => {
  const bookings = [
  {
    id: 1,
    customer: 'Team Alpha',
    customerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_192fca3db-1763294826845.png",
    customerImageAlt: 'Professional headshot of athletic man with short brown hair wearing red sports jersey',
    court: 'Court 1',
    date: 'Dec 29, 2025',
    time: '4:00 PM - 5:00 PM',
    duration: '1 hour',
    amount: 150,
    status: 'confirmed',
    players: 10
  },
  {
    id: 2,
    customer: 'Weekend Warriors',
    customerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_192e6ac8d-1763295501727.png",
    customerImageAlt: 'Professional headshot of bearded man with dark hair wearing blue athletic shirt',
    court: 'Court 2',
    date: 'Dec 29, 2025',
    time: '6:00 PM - 7:30 PM',
    duration: '1.5 hours',
    amount: 225,
    status: 'confirmed',
    players: 12
  },
  {
    id: 3,
    customer: 'FC Strikers',
    customerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_19770f066-1763299749232.png",
    customerImageAlt: 'Professional headshot of young man with blonde hair wearing green sports uniform',
    court: 'Court 3',
    date: 'Dec 30, 2025',
    time: '10:00 AM - 11:00 AM',
    duration: '1 hour',
    amount: 150,
    status: 'pending',
    players: 8
  }];


  const getStatusBadge = (status) => {
    if (status === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 text-success text-xs font-medium">
          <Icon name="CheckCircle" size={12} />
          Confirmed
        </span>);

    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-warning/10 text-warning text-xs font-medium">
        <Icon name="Clock" size={12} />
        Pending
      </span>);

  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-athletic">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">Upcoming Bookings</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Next scheduled court reservations</p>
        </div>
        <Button variant="ghost" size="sm" iconName="Calendar">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {bookings?.map((booking) =>
        <div
          key={booking?.id}
          className="border border-border rounded-lg p-4 hover:shadow-athletic-sm transition-athletic">

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                src={booking?.customerImage}
                alt={booking?.customerImageAlt}
                className="w-12 h-12 rounded-full object-cover" />

                <div>
                  <h4 className="text-sm md:text-base font-semibold text-foreground">{booking?.customer}</h4>
                  <p className="text-xs text-muted-foreground">{booking?.players} players</p>
                </div>
              </div>
              {getStatusBadge(booking?.status)}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={16} color="var(--color-muted-foreground)" />
                <span className="text-xs md:text-sm text-muted-foreground">{booking?.court}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
                <span className="text-xs md:text-sm text-muted-foreground">{booking?.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={16} color="var(--color-muted-foreground)" />
                <span className="text-xs md:text-sm text-muted-foreground">{booking?.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="DollarSign" size={16} color="var(--color-success)" />
                <span className="text-xs md:text-sm font-semibold text-foreground">${booking?.amount}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <Button variant="outline" size="sm" fullWidth iconName="Edit">
                Edit
              </Button>
              <Button variant="ghost" size="sm" fullWidth iconName="MessageSquare">
                Contact
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>);

};

export default UpcomingBookings;