import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import Button from '../../components/ui/Button';
import BookingSummaryCard from './components/BookingSummaryCard';
import CourtInfoPanel from './components/CourtInfoPanel';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import CardPaymentForm from './components/CardPaymentForm';
import PromoCodeSection from './components/PromoCodeSection';
import NotificationPreferences from './components/NotificationPreferences';
import PaymentSuccessModal from './components/PaymentSuccessModal';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [notificationPreferences, setNotificationPreferences] = useState(null);

  // Get booking data from navigation state or show error
  const bookingData = location.state?.booking;

  useEffect(() => {
    if (!bookingData) {
      // Redirect back if no booking data
      navigate('/futsal-venues');
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null; // Will redirect
  }

  const mockBooking = {
    courtName: bookingData.courtName || "Court",
    facilityName: bookingData.facilityName || "Futsal Venue",
    courtImage: bookingData.courtImage || "",
    courtImageAlt: bookingData.courtImageAlt || "Court image",
    date: bookingData.date || new Date().toISOString().split('T')[0],
    startTime: bookingData.startTime || "18:00",
    endTime: bookingData.endTime || "20:00",
    duration: bookingData.duration || 2,
    players: bookingData.players || 10,
    courtPrice: bookingData.courtPrice || 80.00,
    equipmentRental: bookingData.equipmentRental || 0,
    serviceFee: bookingData.serviceFee || 0,
    discount: 0,
    totalAmount: bookingData.totalAmount || 80.00
  };

  const courtInfo = {
    address: "123 Sports Complex Drive, Downtown District, New York, NY 10001",
    amenities: [
    "Climate controlled indoor facility",
    "Professional LED lighting",
    "High-quality artificial turf",
    "Changing rooms with showers",
    "Free parking available",
    "Equipment rental available",
    "Water fountains",
    "Spectator seating area"],

    policies: [
    "Players must arrive 15 minutes before booking time",
    "Proper indoor sports footwear required",
    "Maximum 10 players per booking",
    "No outside food or beverages allowed",
    "Facility rules must be followed at all times"],

    cancellationPolicy: "Free cancellation up to 24 hours before booking. Cancellations within 24 hours will incur a 50% charge. No-shows will be charged the full amount.",
    contactPhone: "+1 (555) 123-4567",
    contactEmail: "support@futsalbooker.com"
  };

  const calculateTotal = () => {
    let total = mockBooking?.courtPrice + mockBooking?.equipmentRental + mockBooking?.serviceFee;

    if (appliedPromo) {
      if (appliedPromo?.type === 'percentage') {
        total = total * (1 - appliedPromo?.discount / 100);
      } else {
        total = total - appliedPromo?.discount;
      }
    }

    return total;
  };

  const handleEditBooking = () => {
    navigate('/court-booking-dashboard');
  };

  const handleApplyPromo = (promo) => {
    setAppliedPromo(promo);
  };

  const handlePaymentSubmit = (paymentData) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);
    }, 2500);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleViewBooking = () => {
    setShowSuccessModal(false);
    navigate('/court-booking-dashboard');
  };

  const handleBackToDashboard = () => {
    setShowSuccessModal(false);
    navigate('/court-booking-dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole="player" onLogout={handleLogout} />
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <button
              onClick={() => navigate('/court-booking-dashboard')}
              className="flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-foreground transition-athletic mb-4">

              <span>←</span>
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Complete Your Booking
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Review your booking details and complete payment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <BookingSummaryCard
                booking={{
                  ...mockBooking,
                  discount: appliedPromo ?
                  appliedPromo?.type === 'percentage' ?
                  (mockBooking?.courtPrice + mockBooking?.equipmentRental + mockBooking?.serviceFee) * (appliedPromo?.discount / 100) :
                  appliedPromo?.discount :
                  0,
                  totalAmount: calculateTotal()
                }}
                onEdit={handleEditBooking} />


              <PromoCodeSection
                onApplyPromo={handleApplyPromo}
                appliedPromo={appliedPromo} />


              <div className="bg-card rounded-xl shadow-athletic p-4 md:p-6 lg:p-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-6 md:mb-8">
                  Payment Information
                </h2>

                <div className="space-y-6 md:space-y-8">
                  <PaymentMethodSelector
                    selectedMethod={selectedPaymentMethod}
                    onMethodChange={setSelectedPaymentMethod} />


                  {selectedPaymentMethod === 'card' &&
                  <CardPaymentForm
                    onSubmit={handlePaymentSubmit}
                    isProcessing={isProcessing} />

                  }

                  {selectedPaymentMethod !== 'card' &&
                  <div className="bg-muted/50 rounded-lg p-6 md:p-8 text-center">
                      <p className="text-sm md:text-base text-muted-foreground mb-4">
                        You will be redirected to complete payment with {selectedPaymentMethod === 'paypal' ? 'PayPal' : selectedPaymentMethod === 'apple' ? 'Apple Pay' : 'Google Pay'}
                      </p>
                      <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handlePaymentSubmit}
                      loading={isProcessing}>

                        Continue to Payment
                      </Button>
                    </div>
                  }
                </div>
              </div>

              <NotificationPreferences
                onPreferencesChange={setNotificationPreferences} />


              {selectedPaymentMethod === 'card' &&
              <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/court-booking-dashboard')}>

                    Cancel
                  </Button>
                  <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    const form = document.querySelector('form');
                    if (form) {
                      form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                  }}
                  loading={isProcessing}
                  iconName="Lock"
                  iconPosition="left">

                    Pay ${calculateTotal()?.toFixed(2)}
                  </Button>
                </div>
              }
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                <CourtInfoPanel courtInfo={courtInfo} />

                <div className="bg-card rounded-xl shadow-athletic p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">
                        ${(mockBooking?.courtPrice + mockBooking?.equipmentRental + mockBooking?.serviceFee)?.toFixed(2)}
                      </span>
                    </div>
                    {appliedPromo &&
                    <div className="flex justify-between text-sm md:text-base text-success">
                        <span>Discount ({appliedPromo?.code})</span>
                        <span className="font-medium">
                          -${appliedPromo?.type === 'percentage' ?
                        ((mockBooking?.courtPrice + mockBooking?.equipmentRental + mockBooking?.serviceFee) * (appliedPromo?.discount / 100))?.toFixed(2) :
                        appliedPromo?.discount?.toFixed(2)}
                        </span>
                      </div>
                    }
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-base md:text-lg font-semibold text-foreground">
                          Total
                        </span>
                        <span className="text-xl md:text-2xl font-bold text-primary">
                          ${calculateTotal()?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        bookingReference="FB-2025-001234"
        onClose={handleBackToDashboard}
        onViewBooking={handleViewBooking} />

    </div>);

};

export default BookingConfirmation;