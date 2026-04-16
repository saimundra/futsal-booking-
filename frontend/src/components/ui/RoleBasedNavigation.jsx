import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleBasedNavigation = ({ userRole = 'player', onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const playerNavItems = [
    { label: 'Browse Venues', path: '/futsal-venues', icon: 'MapPin' },
    { label: 'My Bookings', path: '/my-bookings', icon: 'ClipboardList' },
    { label: 'Profile', path: '/user-profile', icon: 'User' }
  ];

  const ownerNavItems = [
    { label: 'Dashboard', path: '/futsal-owner-dashboard', icon: 'LayoutDashboard' },
    { label: 'Manage Courts', path: '/court-management', icon: 'Settings' }
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/futsal-owner-dashboard', icon: 'LayoutDashboard' },
    { label: 'Manage Bookings', path: '/booking-management', icon: 'Settings' },
    { label: 'Court Schedule', path: '/court-schedule-management', icon: 'Calendar' }
  ];

  let navItems = playerNavItems;
  if (userRole === 'admin') navItems = adminNavItems;
  else if (userRole === 'futsal_owner') navItems = ownerNavItems;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location?.pathname === path;

  return (
    <>
      <nav className="role-based-nav">
        <div className="role-based-nav-container">
          <div className="role-based-nav-content">
            <div className="role-based-nav-logo">
              <div className="role-based-nav-logo-icon">
                <Icon name="Dribbble" size={24} color="white" />
              </div>
              <span className="role-based-nav-logo-text">FutsalBooker</span>
            </div>

            <div className="role-based-nav-menu">
              {navItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`role-based-nav-link ${isActive(item?.path) ? 'active' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <Icon name={item?.icon} size={18} />
                    {item?.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="role-based-nav-actions">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                iconName="LogOut"
                iconPosition="left"
                className="hidden lg:flex"
              >
                Logout
              </Button>

              {userRole === 'futsal_owner' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/futsal-owner-profile')}
                  iconName="User"
                  iconPosition="left"
                  className="hidden lg:flex"
                >
                  Profile
                </Button>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="role-based-nav-mobile-toggle"
                aria-label="Toggle mobile menu"
              >
                <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className={`role-based-nav-mobile-menu ${isMobileMenuOpen ? 'open' : 'closed'}`}>
        <div className="role-based-nav-mobile-header">
          <div className="role-based-nav-logo">
            <div className="role-based-nav-logo-icon">
              <Icon name="Dribbble" size={24} color="white" />
            </div>
            <span className="role-based-nav-logo-text">FutsalBooker</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-muted transition-colors duration-250"
            aria-label="Close mobile menu"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="role-based-nav-mobile-links">
          {navItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`role-based-nav-mobile-link ${isActive(item?.path) ? 'active' : ''}`}
            >
              <span className="flex items-center gap-3">
                <Icon name={item?.icon} size={20} />
                {item?.label}
              </span>
            </button>
          ))}

          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <Button
              variant="outline"
              fullWidth
              onClick={handleLogout}
              iconName="LogOut"
              iconPosition="left"
            >
              Logout
            </Button>
            
            {userRole === 'futsal_owner' && (
              <Button
                variant="ghost"
                fullWidth
                onClick={() => handleNavigation('/futsal-owner-profile')}
                iconName="User"
                iconPosition="left"
              >
                Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleBasedNavigation;