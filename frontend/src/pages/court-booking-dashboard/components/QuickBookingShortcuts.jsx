import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickBookingShortcuts = ({ shortcuts, onShortcutClick }) => {
  const handleShortcutClick = (shortcut) => {
    if (onShortcutClick) onShortcutClick(shortcut);
  };

  return (
    <div className="bg-card rounded-xl shadow-athletic p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">Quick Booking</h3>
          <p className="text-xs text-muted-foreground">Your favorite time slots</p>
        </div>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      <div className="space-y-3">
        {shortcuts?.map((shortcut) => (
          <button
            key={shortcut?.id}
            onClick={() => handleShortcutClick(shortcut)}
            className="w-full bg-background rounded-lg p-3 border border-border hover:border-primary hover:shadow-athletic-sm transition-all duration-250 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {shortcut?.label}
              </span>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Icon name="MapPin" size={12} />
                <span>{shortcut?.court}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={12} />
                <span>{shortcut?.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Calendar" size={12} />
                <span>{shortcut?.day}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        fullWidth
        className="mt-4"
        iconName="Plus"
        iconPosition="left"
      >
        Add Shortcut
      </Button>
    </div>
  );
};

export default QuickBookingShortcuts;