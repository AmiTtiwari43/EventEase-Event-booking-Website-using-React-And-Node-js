const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
require('dotenv').config();

// Sample services data with images
const sampleServices = [
  {
    title: "Luxury Wedding Photography",
    category: "Wedding",
    description: "Capture your special day with our premium wedding photography service. We use professional Canon EOS R5 cameras with 4K video capabilities. Includes pre-wedding shoot, full day coverage, drone photography, and a beautifully crafted wedding album. Perfect for couples who want their memories preserved in the most elegant way.",
    address: "Mumbai, Maharashtra",
    price: 45000,
    duration: "1 Day",
    features: ["Pre-wedding Shoot", "Full Day Coverage", "Drone Photography", "Wedding Album", "4K Video", "Professional Editing"],
    images: [
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Corporate Conference Management",
    category: "Corporate",
    description: "Complete corporate event solutions for conferences, seminars, and business meetings. We handle everything from venue selection to catering, audio-visual setup, and guest management. Includes professional event coordinators, high-quality sound systems, and seamless execution. Ideal for companies looking to host impactful business events.",
    address: "Delhi, NCR",
    price: 75000,
    duration: "2 Days",
    features: ["Venue Selection", "Audio-Visual Setup", "Professional Catering", "Guest Management", "Event Coordination", "Post-Event Reporting"],
    images: [
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Birthday Party Decoration",
    category: "Birthday",
    description: "Transform any space into a magical birthday celebration with our creative decoration services. We offer themed decorations, balloon arrangements, LED lighting, and custom backdrops. Perfect for children's parties, milestone birthdays, and special celebrations. Includes setup and cleanup.",
    address: "Bangalore, Karnataka",
    price: 12000,
    duration: "1 Day",
    features: ["Themed Decorations", "Balloon Arrangements", "LED Lighting", "Custom Backdrops", "Setup & Cleanup", "Party Favors"],
    images: [
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Premium Catering Services",
    category: "Other",
    description: "Exquisite catering for all occasions with a diverse menu including Indian, Continental, and Fusion cuisine. We use fresh, locally sourced ingredients and provide professional service staff. Options include buffet, plated service, and cocktail parties. Perfect for weddings, corporate events, and private parties.",
    address: "Chennai, Tamil Nadu",
    price: 35000,
    duration: "1 Day",
    features: ["Indian Cuisine", "Continental Dishes", "Fusion Menu", "Professional Staff", "Buffet Service", "Plated Service"],
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Professional DJ & Music",
    category: "Other",
    description: "Keep your event lively with our professional DJ services featuring the latest sound equipment and music selection. We offer multiple packages including basic DJ setup, premium sound system with lighting, and full entertainment package with live musicians. Perfect for weddings, parties, and corporate events.",
    address: "Pune, Maharashtra",
    price: 25000,
    duration: "1 Day",
    features: ["Professional DJ", "Premium Sound System", "Lighting Effects", "Music Selection", "Live Musicians", "Equipment Setup"],
    images: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Wedding Reception Planning",
    category: "Wedding",
    description: "Complete wedding reception planning and execution services. We handle venue decoration, catering coordination, entertainment, photography, and guest management. Includes personalized planning sessions and on-site coordination. Make your wedding reception memorable with our comprehensive services.",
    address: "Hyderabad, Telangana",
    price: 85000,
    duration: "1 Day",
    features: ["Venue Decoration", "Catering Coordination", "Entertainment", "Photography", "Guest Management", "On-site Coordination"],
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Corporate Team Building Events",
    category: "Corporate",
    description: "Boost team morale with our engaging team building activities. We offer outdoor adventures, indoor workshops, and hybrid events. Activities include trust exercises, problem-solving challenges, and fun competitions. Perfect for companies looking to strengthen team bonds and improve communication.",
    address: "Gurgaon, Haryana",
    price: 55000,
    duration: "1 Day",
    features: ["Outdoor Adventures", "Indoor Workshops", "Trust Exercises", "Problem-solving Challenges", "Team Competitions", "Professional Facilitators"],
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Anniversary Celebration Services",
    category: "Anniversary",
    description: "Celebrate your special milestones with our anniversary planning services. We create personalized celebrations including decoration, catering, entertainment, and photography. Whether it's your 25th or 50th anniversary, we'll make it unforgettable with our attention to detail and creative ideas.",
    address: "Kolkata, West Bengal",
    price: 40000,
    duration: "1 Day",
    features: ["Personalized Decorations", "Special Catering", "Entertainment", "Photography", "Anniversary Cake", "Guest Book"],
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Product Launch Events",
    category: "Corporate",
    description: "Launch your product with impact using our comprehensive event management services. We handle venue selection, stage setup, audio-visual equipment, press coordination, and guest management. Includes branding integration and post-event reporting. Perfect for companies launching new products or services.",
    address: "Mumbai, Maharashtra",
    price: 95000,
    duration: "1 Day",
    features: ["Venue Selection", "Stage Setup", "Audio-Visual Equipment", "Press Coordination", "Guest Management", "Branding Integration"],
    images: [
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Destination Wedding Planning",
    category: "Wedding",
    description: "Plan your dream destination wedding with our expert services. We handle everything from venue selection to guest accommodation, local vendor coordination, and travel arrangements. Popular destinations include Goa, Udaipur, and Kerala. Includes pre-wedding visits and complete coordination.",
    address: "Goa, India",
    price: 150000,
    duration: "3 Days",
    features: ["Venue Selection", "Guest Accommodation", "Local Vendor Coordination", "Travel Arrangements", "Pre-wedding Visits", "Complete Coordination"],
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Graduation Party Services",
    category: "Graduation",
    description: "Celebrate academic achievements with our graduation party services. We offer themed decorations, catering, entertainment, and photography. Perfect for high school and college graduations. Includes personalized planning and execution to make the celebration memorable for graduates and their families.",
    address: "Delhi, NCR",
    price: 30000,
    duration: "1 Day",
    features: ["Themed Decorations", "Catering", "Entertainment", "Photography", "Personalized Planning", "Graduation Caps"],
    images: [
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Corporate Award Ceremonies",
    category: "Corporate",
    description: "Host professional award ceremonies with our comprehensive event services. We handle stage design, audio-visual setup, award presentation coordination, and guest management. Includes professional photography and video coverage. Perfect for recognizing employee achievements and company milestones.",
    address: "Bangalore, Karnataka",
    price: 65000,
    duration: "1 Day",
    features: ["Stage Design", "Audio-Visual Setup", "Award Presentation", "Guest Management", "Professional Photography", "Video Coverage"],
    images: [
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Baby Shower Planning",
    category: "Baby Shower",
    description: "Welcome the little one with our baby shower planning services. We offer themed decorations, catering, games, and entertainment. Includes gender reveal options and personalized touches. Perfect for expecting parents who want to celebrate this special milestone with family and friends.",
    address: "Pune, Maharashtra",
    price: 25000,
    duration: "1 Day",
    features: ["Themed Decorations", "Catering", "Baby Shower Games", "Entertainment", "Gender Reveal", "Personalized Touches"],
    images: [
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Cultural Festival Management",
    category: "Cultural",
    description: "Celebrate cultural diversity with our festival management services. We handle traditional decorations, cultural performances, food stalls, and entertainment. Perfect for community events, cultural organizations, and educational institutions. Includes coordination with local artists and performers.",
    address: "Chennai, Tamil Nadu",
    price: 80000,
    duration: "3 Days",
    features: ["Traditional Decorations", "Cultural Performances", "Food Stalls", "Entertainment", "Local Artists", "Community Coordination"],
    images: [
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  },
  {
    title: "Retirement Party Services",
    category: "Other",
    description: "Honor retiring colleagues with our retirement party services. We create personalized celebrations including decoration, catering, entertainment, and photography. Perfect for companies and organizations wanting to celebrate their employees' contributions. Includes tribute video creation and guest book services.",
    address: "Hyderabad, Telangana",
    price: 35000,
    duration: "1 Day",
    features: ["Personalized Decorations", "Catering", "Entertainment", "Photography", "Tribute Video", "Guest Book"],
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop"
    ],
    isCustom: false,
    isActive: true
  }
];

// Admin user data
const adminUser = {
  name: "Admin User",
  email: "admin@eventease.com",
  password: "admin123",
  role: "admin"
};

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'eventease-lite'
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user with plain text password (will be hashed by pre-save hook)
    const admin = new User({
      name: "Admin User",
      email: "admin@eventease.com",
      password: "admin123",
      role: "admin"
    });
    
    console.log('About to save admin user...');
    await admin.save();
    console.log('Admin user saved successfully');
    console.log('Admin user created:', admin.email);
    console.log('Admin user role:', admin.role);
    console.log('Admin user ID:', admin._id);
    
    // Verify the user was saved
    const savedUser = await User.findOne({ email: 'admin@eventease.com' });
    console.log('Verification - User found in DB:', !!savedUser);
    if (savedUser) {
      console.log('Verification - User role:', savedUser.role);
    }

    // Create sample services with admin as creator
    const services = await Service.insertMany(
      sampleServices.map(service => ({
        ...service,
        createdBy: admin._id
      }))
    );
    console.log('Sample services created:', services.length);

    console.log('Database seeded successfully!');
    console.log('\nAdmin Login Details:');
    console.log('Email: admin@eventease.com');
    console.log('Password: admin123');
    console.log('You can now login as admin to access the admin panel.');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.connection.close();
  }
}

seedData(); 