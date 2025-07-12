import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-x-32 -translate-y-32 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full translate-x-32 translate-y-32 opacity-30"></div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6 animate-slide-up">
              About EventEase Lite
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
              We transform dreams into unforgettable experiences, creating moments that last a lifetime
            </p>
            <div className="flex justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg">
                Since 2025
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="card-hover animate-fade-in p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 text-2xl animate-bounce-in">
                🎯
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To provide exceptional event planning and management services that exceed expectations, 
                delivering personalized experiences that celebrate life's most important moments with 
                creativity, professionalism, and unwavering dedication.
              </p>
            </div>

            {/* Vision Card */}
            <div className="card-hover animate-fade-in p-8" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 text-2xl animate-bounce-in">
                🌟
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To become the leading event management platform, known for innovation, creativity, 
                and unwavering commitment to customer satisfaction, while setting new standards in 
                the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Our Story
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to industry leadership
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="space-y-6 text-lg text-gray-600">
                <p className="leading-relaxed">
                  Founded with a passion for creating extraordinary events, EventEase Lite began as a 
                  small team of dedicated professionals who understood that every event is unique and 
                  deserves personalized attention.
                </p>
                <p className="leading-relaxed">
                  Over the years, we've grown from a local event planning service to a comprehensive 
                  platform that connects clients with the best event services across the country. Our 
                  journey has been marked by countless successful events, happy clients, and continuous 
                  innovation.
                </p>
                <p className="leading-relaxed">
                  Today, we're proud to serve thousands of clients, helping them create memories that 
                  last a lifetime. From intimate gatherings to grand celebrations, we're here to make 
                  your vision a reality.
                </p>
              </div>
            </div>

            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                  alt="Event Planning Team"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mt-16 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white max-w-4xl mx-auto shadow-2xl">
              <h4 className="text-2xl font-bold mb-6 text-center">Why Choose Us?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Experienced team of professionals",
                  "Personalized approach to every event",
                  "Comprehensive service offerings",
                  "24/7 customer support",
                  "Quality assurance guarantee",
                  "Innovative technology platform"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate professionals behind every successful event
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                description: "With over 15 years of experience in event management, Sarah leads our team with passion and expertise.",
                emoji: "👩‍💼",
                color: "from-purple-500 to-pink-500"
              },
              {
                name: "Michael Chen",
                role: "Head of Operations",
                description: "Michael ensures every event runs smoothly with his meticulous attention to detail.",
                emoji: "👨‍💻",
                color: "from-indigo-500 to-purple-500"
              },
              {
                name: "Emily Rodriguez",
                role: "Creative Director",
                description: "Emily brings creativity and innovation to every event, making each celebration unique.",
                emoji: "🎨",
                color: "from-pink-500 to-red-500"
              },
              {
                name: "David Thompson",
                role: "Customer Success Manager",
                description: "David is dedicated to ensuring every client has an exceptional experience.",
                emoji: "🤝",
                color: "from-green-500 to-emerald-500"
              },
              {
                name: "Lisa Wang",
                role: "Technical Lead",
                description: "Lisa oversees our platform development, ensuring seamless user experiences.",
                emoji: "💻",
                color: "from-blue-500 to-indigo-500"
              },
              {
                name: "James Wilson",
                role: "Marketing Director",
                description: "James connects us with amazing partners and helps grow our community.",
                emoji: "📈",
                color: "from-orange-500 to-red-500"
              }
            ].map((member, index) => (
              <div 
                key={index} 
                className="card-hover animate-fade-in text-center p-6"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl animate-bounce-in`}>
                  {member.emoji}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
                <p className="text-gradient font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-noise opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Impact
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Numbers that tell our success story
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: "Events Managed", icon: "🎉" },
              { number: "500+", label: "Happy Clients", icon: "😊" },
              { number: "50+", label: "Service Partners", icon: "🤝" },
              { number: "98%", label: "Satisfaction Rate", icon: "⭐" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-4xl mb-4 animate-bounce-in">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 animate-slide-up">
                  {stat.number}
                </div>
                <div className="text-white/90 text-lg font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Ready to Create Your Perfect Event?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Let us help you bring your vision to life. Our team is ready to create 
              unforgettable moments for your special occasion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Get Started Today
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 