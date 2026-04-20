import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/animations/PageTransition";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Landing from './pages/landing';
import AdminDashboard from './pages/admin-dashboard';
import BookingConfirmation from './pages/booking-confirmation';
import Login from './pages/login';
import BookingManagement from './pages/booking-management';
import CourtBookingDashboard from './pages/court-booking-dashboard';
import FutsalVenues from './pages/futsal-venues';
import Register from './pages/register';
import UserProfile from './pages/user-profile';
import MyBookings from './pages/my-bookings';
import CourtScheduleManagement from './pages/court-schedule-management';
import FutsalOwnerDashboard from './pages/futsal-owner-dashboard';
import FutsalManagement from './pages/futsal-management';
import FutsalOwnerProfile from './pages/futsal-owner-profile';
import PlayerDashboard from './pages/player-dashboard';
import CourtManagement from './pages/court-management';

const getDefaultRouteForRole = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'futsal_owner') return '/futsal-owner-dashboard';
  return '/futsal-venues';
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <RouterRoutes location={location} key={location.pathname}>
        {/* Define your route here */}
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PageTransition><AdminDashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="/booking-confirmation" element={<PageTransition><BookingConfirmation /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/booking-management" element={<PageTransition><BookingManagement /></PageTransition>} />
        <Route path="/court-booking-dashboard" element={<PageTransition><CourtBookingDashboard /></PageTransition>} />
        <Route path="/futsal-venues" element={<PageTransition><FutsalVenues /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/user-profile" element={<PageTransition><UserProfile /></PageTransition>} />
        <Route path="/my-bookings" element={<PageTransition><MyBookings /></PageTransition>} />
        <Route
          path="/court-schedule-management"
          element={
            <ProtectedRoute allowedRoles={['futsal_owner', 'admin']}>
              <PageTransition><CourtScheduleManagement /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/futsal-owner-dashboard"
          element={
            <ProtectedRoute allowedRoles={['futsal_owner']}>
              <PageTransition><FutsalOwnerDashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/futsal-management"
          element={
            <ProtectedRoute allowedRoles={['futsal_owner', 'admin']}>
              <PageTransition><FutsalManagement /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/futsal-management/new"
          element={
            <ProtectedRoute allowedRoles={['futsal_owner', 'admin']}>
              <PageTransition><FutsalManagement /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/futsal-management/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['futsal_owner', 'admin']}>
              <PageTransition><FutsalManagement /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/futsal-management/:id"
          element={
            <ProtectedRoute allowedRoles={['futsal_owner', 'admin']}>
              <PageTransition><FutsalManagement /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="/futsal-owner-profile" element={<PageTransition><FutsalOwnerProfile /></PageTransition>} />
        <Route
          path="/court-management"
          element={
            <ProtectedRoute allowedRoles={['futsal_owner', 'admin']}>
              <PageTransition><CourtManagement /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="/player-dashboard" element={<PageTransition><PlayerDashboard /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </RouterRoutes>
    </AnimatePresence>
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <AnimatedRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
