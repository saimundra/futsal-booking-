import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Shield, Users, Trophy } from 'lucide-react';
import Icon from '../../components/AppIcon';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book your favorite court in just a few clicks'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access our booking system anytime, anywhere'
    },
    {
      icon: MapPin,
      title: 'Multiple Courts',
      description: 'Choose from our variety of premium futsal courts'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Safe and encrypted payment processing'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Organize your team and manage bookings together'
    },
    {
      icon: Trophy,
      title: 'Professional Facilities',
      description: 'High-quality courts with modern amenities'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative min-h-screen">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/futsal-bg.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 px-6 py-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Dribbble" size={24} color="white" />
              </div>
              <span className="text-2xl font-bold text-white">FutsalBooker</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 text-white font-medium hover:text-primary transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 hover:shadow-primary/50"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 px-6 md:px-12 lg:px-16 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Book Your Perfect
                <span className="block text-primary">Futsal Court</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                Experience the thrill of futsal with our premium courts. Book instantly, play passionately, and elevate your game.
              </p>
            </div>

            <div className="flex justify-center items-center">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-2xl hover:shadow-primary/50 hover:scale-105 text-lg"
              >
                Start Booking Now
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto pt-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">4+</div>
                <div className="text-sm md:text-base text-gray-300">Premium Courts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">1000+</div>
                <div className="text-sm md:text-base text-gray-300">Happy Players</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm md:text-base text-gray-300">Booking Access</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Why Choose FutsalBooker?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the best futsal booking experience with state-of-the-art facilities and seamless technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-border"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-primary">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Ready to Play?
          </h2>
          <p className="text-lg md:text-xl text-white/90">
            Join thousands of futsal enthusiasts and book your court today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-xl text-lg hover:scale-105"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg hover:bg-white/10 transition-all border-2 border-white text-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 lg:px-16 bg-foreground text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Dribbble" size={20} color="white" />
                </div>
                <span className="text-xl font-bold">FutsalBooker</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner for premium futsal court bookings
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Our Courts</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@futsalbooker.com</li>
                <li>Phone: +977 1234567890</li>
                <li>Location: Kathmandu, Nepal</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 FutsalBooker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
