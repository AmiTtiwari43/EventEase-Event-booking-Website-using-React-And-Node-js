import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedServices } from '../api/services';

const Home = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [serviceImageIndices, setServiceImageIndices] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // Hero carousel images
  const heroImages = [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ];

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const services = await getFeaturedServices();
        setFeaturedServices(services.slice(0, 6));
        
        // Initialize image indices for each service
        const initialIndices = {};
        services.slice(0, 6).forEach(service => {
          initialIndices[service._id] = 0;
        });
        setServiceImageIndices(initialIndices);
      } catch (error) {
        console.error('Error fetching featured services:', error);
      }
    };

    fetchFeaturedServices();
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Image rotation for service cards
  useEffect(() => {
    const intervals = {};
    
    featuredServices.forEach(service => {
      if (service.images && service.images.length > 1) {
        intervals[service._id] = setInterval(() => {
          setServiceImageIndices(prev => ({
            ...prev,
            [service._id]: (prev[service._id] + 1) % service.images.length
          }));
        }, 5000); // 5 seconds
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [featuredServices]);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section with Enhanced Carousel */}
      <div className="relative h-screen overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <img
              src={image}
              alt={`Event ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          </div>
        ))}
        
        {/* Hero Content with Enhanced Animations */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              Create Unforgettable
              <span className="block text-gradient-hero animate-glow">Moments</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
              From intimate gatherings to grand celebrations, we bring your vision to life with 
              professional event planning and management services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
              <Link
                to="/services"
                className="btn-primary text-lg px-8 py-4"
              >
                Explore Services
              </Link>
              <Link
                to="/services"
                className="btn-glass text-lg px-8 py-4"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-4 h-4 rounded-full transition-all duration-500 hover:scale-125 ${
                index === currentImageIndex 
                  ? 'bg-white shadow-lg shadow-white/50' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-4 h-4 bg-purple-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{animationDelay: '1s'}}>
          <div className="w-6 h-6 bg-pink-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{animationDelay: '2s'}}>
          <div className="w-3 h-3 bg-indigo-400 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Enhanced Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From weddings to corporate events, we offer comprehensive event management 
              services tailored to your unique needs and vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <div
                key={service._id}
                className="card-hover animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="h-48 relative overflow-hidden rounded-t-2xl">
                  {service.images && service.images.length > 0 ? (
                    service.images.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image}
                        alt={`${service.title} ${imgIndex + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                          imgIndex === serviceImageIndices[service._id] ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                        }`}
                      />
                    ))
                  ) : (
                    <div className="h-full gradient-primary flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2 animate-bounce-in">
                          {service.category === 'Photography' && '📸'}
                          {service.category === 'Event Management' && '🎉'}
                          {service.category === 'Decoration' && '🎨'}
                          {service.category === 'Catering' && '🍽️'}
                          {service.category === 'Entertainment' && '🎵'}
                          {service.category === 'Corporate Events' && '🏢'}
                          {service.category === 'Celebration' && '🎊'}
                          {service.category === 'Wedding Planning' && '💒'}
                          {service.category === 'Cultural Events' && '🎭'}
                        </div>
                        <p className="text-sm opacity-90">{service.category}</p>
                      </div>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gradient">
                      ₹{service.price.toLocaleString()}
                    </span>
                    <Link
                      to={`/services/${service._id}`}
                      className="btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in">
            <Link
              to="/services"
              className="btn-primary text-lg px-8 py-4"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Us Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-x-32 -translate-y-32 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full translate-x-32 translate-y-32 opacity-30"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Why Choose EventEase Lite?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine creativity, professionalism, and attention to detail to deliver 
              exceptional events that exceed your expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Personalized Approach',
                description: 'Every event is unique. We work closely with you to understand your vision and create a customized experience.'
              },
              {
                icon: '⭐',
                title: 'Experienced Team',
                description: 'Our team of professionals brings years of experience in event planning and management.'
              },
              {
                icon: '💎',
                title: 'Quality Assurance',
                description: 'We maintain the highest standards of quality in every aspect of our services.'
              },
              {
                icon: '🤝',
                title: '24/7 Support',
                description: 'We\'re here for you throughout your event journey, providing support whenever you need it.'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="text-center card-hover p-6 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl animate-bounce-in">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center text-white animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create Your Perfect Event?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Let us help you bring your vision to life. Contact us today to start planning 
              your unforgettable event.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="btn-outline text-lg px-8 py-4"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="btn-glass text-lg px-8 py-4"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
