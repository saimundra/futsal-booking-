import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';



const RevenueChart = () => {
  const [timeRange, setTimeRange] = useState('week');

  const weeklyData = [
    { day: 'Mon', revenue: 1200, bookings: 8 },
    { day: 'Tue', revenue: 1800, bookings: 12 },
    { day: 'Wed', revenue: 2400, bookings: 16 },
    { day: 'Thu', revenue: 2100, bookings: 14 },
    { day: 'Fri', revenue: 3200, bookings: 22 },
    { day: 'Sat', revenue: 4500, bookings: 30 },
    { day: 'Sun', revenue: 3800, bookings: 25 }
  ];

  const monthlyData = [
    { week: 'Week 1', revenue: 8500, bookings: 58 },
    { week: 'Week 2', revenue: 9200, bookings: 64 },
    { week: 'Week 3', revenue: 10800, bookings: 72 },
    { week: 'Week 4', revenue: 11500, bookings: 78 }
  ];

  const data = timeRange === 'week' ? weeklyData : monthlyData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-athletic-md">
          <p className="text-sm font-medium text-foreground mb-2">
            {payload?.[0]?.payload?.[timeRange === 'week' ? 'day' : 'week']}
          </p>
          <p className="text-xs text-success">
            Revenue: ${payload?.[0]?.value?.toLocaleString()}
          </p>
          <p className="text-xs text-secondary">
            Bookings: {payload?.[1]?.value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-athletic">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">Revenue Analytics</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Track booking revenue and trends</p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all duration-250 ${
              timeRange === 'week' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all duration-250 ${
              timeRange === 'month' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="w-full h-64 md:h-80" aria-label="Revenue and Bookings Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey={timeRange === 'week' ? 'day' : 'week'} 
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              stroke="var(--color-border)"
            />
            <YAxis 
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              stroke="var(--color-border)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Bar dataKey="revenue" fill="var(--color-success)" radius={[8, 8, 0, 0]} name="Revenue ($)" />
            <Bar dataKey="bookings" fill="var(--color-secondary)" radius={[8, 8, 0, 0]} name="Bookings" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;