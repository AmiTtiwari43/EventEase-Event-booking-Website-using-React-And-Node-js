const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Partner = require('./models/Partner');
require('dotenv').config();

// Verified Working Unsplash Images
const IMAGES = {
  wedding1: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  wedding2: "https://images.unsplash.com/photo-1511285560982-1351c4f631f1?w=800&q=80",
  wedding3: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=80",
  wedding4: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  wedding5: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
  corporate1: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
  corporate2: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80",
  corporate3: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?w=800&q=80",
  birthday1: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80", 
  food1: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
  dj1: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  dj2: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  dj3: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80"
};

const sampleServices = [
  // Wedding Category
  {
    title: "Luxury Wedding Photography",
    category: "Wedding",
    description: "Capture your special day with our premium wedding photography service. Includes pre-wedding shoot, drone coverage, and a cinematic wedding film.",
    address: "Mumbai, Maharashtra",
    price: 45000,
    duration: "1 Day",
    features: ["Pre-wedding Shoot", "Drone Photography", "Cinematic Film", "Premium Album"],
    images: [IMAGES.wedding1, IMAGES.wedding2, IMAGES.wedding3],
    isCustom: false,
    isActive: true
  },
  {
    title: "Destination Wedding Planning (Goa)",
    category: "Wedding",
    description: "Full-service planning for your dream beach wedding in Goa. We handle venue, stay, and decor.",
    address: "Goa",
    price: 250000,
    duration: "2 Days",
    features: ["Beach Venue", "Hotel Booking", "Beach Decor", "Logistics"],
    images: [IMAGES.wedding2, IMAGES.wedding4, IMAGES.wedding5],
    isCustom: true,
    isActive: true
  },
  {
    title: "Sangeet & Mehendi Night Decor",
    category: "Wedding",
    description: "Vibrant and colorful decor for your Sangeet and Mehendi functions. Includes stage setup, seating, and floral arrangements.",
    address: "Delhi, NCR",
    price: 80000,
    duration: "1 Day",
    features: ["Colorful Drapes", "Floral Decor", "Stage Setup", "Photo Booth"],
    images: [IMAGES.wedding4, IMAGES.wedding3, IMAGES.wedding1],
    isCustom: false,
    isActive: true
  },
  {
    title: "Bridal Shower Party",
    category: "Wedding",
    description: "Elegant bridal shower planning with chic decor, games, and catering coordination.",
    address: "Bangalore, Karnataka",
    price: 30000,
    duration: "4 Hours",
    features: ["Themed Decor", "Party Games", "Cake Table Styling", "Invites"],
    images: [IMAGES.wedding5, IMAGES.food1, IMAGES.birthday1],
    isCustom: false,
    isActive: true
  },
  {
    title: "Wedding Reception Management",
    category: "Wedding",
    description: "Seamless coordination for your wedding reception. We manage guests, catering, and entertainment.",
    address: "Hyderabad, Telangana",
    price: 85000,
    duration: "6 Hours",
    features: ["Guest Management", "Catering Oversight", "Stage Management", "Entertainment"],
    images: [IMAGES.wedding3, IMAGES.wedding1, IMAGES.corporate1],
    isCustom: false,
    isActive: true
  },
  {
    title: "Haldi Ceremony Setup",
    category: "Wedding",
    description: "Traditional yellow-themed decor for the Haldi ceremony with fresh marigolds.",
    address: "Jaipur, Rajasthan",
    price: 40000,
    duration: "4 Hours",
    features: ["Marigold Decor", "Traditional Seating", "Music System", "Photography"],
    images: [IMAGES.wedding4, IMAGES.wedding2],
    isCustom: false,
    isActive: true
  },

  // Corporate Category
  {
    title: "Corporate Conference Management",
    category: "Corporate",
    description: "End-to-end management for business conferences and seminars.",
    address: "Delhi, NCR",
    price: 75000,
    duration: "1 Day",
    features: ["AV Setup", "Registration Desk", "Lunch Catering", "Delegate Kits"],
    images: [IMAGES.corporate1, IMAGES.corporate2, IMAGES.corporate3],
    isCustom: false,
    isActive: true
  },
  {
    title: "Product Launch Event",
    category: "Corporate",
    description: "Impactful product launch events with high-tech staging and media management.",
    address: "Mumbai, Maharashtra",
    price: 150000,
    duration: "1 Day",
    features: ["Stage Design", "LED Walls", "Press Kit", "Media Management"],
    images: [IMAGES.corporate2, IMAGES.corporate1, IMAGES.dj1],
    isCustom: true,
    isActive: true
  },
  {
    title: "Team Building Retreat",
    category: "Corporate",
    description: "Fun and engaging team building activities at a resort location.",
    address: "Lonavala, Maharashtra",
    price: 60000,
    duration: "2 Days",
    features: ["Outdoor Games", "Facilitators", "Stay & Food", "Transport"],
    images: [IMAGES.corporate3, IMAGES.corporate1],
    isCustom: false,
    isActive: true
  },
  {
    title: "Annual General Meeting (AGM)",
    category: "Corporate",
    description: "Professional setup for AGMs including livestreaming and secure voting systems.",
    address: "Bangalore, Karnataka",
    price: 90000,
    duration: "1 Day",
    features: ["Livestreaming", "Secure Voting", "Presentation Screens", "High Tea"],
    images: [IMAGES.corporate1, IMAGES.corporate2],
    isCustom: false,
    isActive: true
  },
  {
    title: "Tech Conference Organizer",
    category: "Corporate",
    description: "Specialized in tech events, hackathons, and developer summits.",
    address: "Hyderabad, Telangana",
    price: 120000,
    duration: "2 Days",
    features: ["High-speed WiFi", "Hackathon Setup", "Breakout Rooms", "Tech Support"],
    images: [IMAGES.corporate2, IMAGES.corporate3, IMAGES.dj3],
    isCustom: false,
    isActive: true
  },

  // Birthday Category
  {
    title: "Kids Birthday Party Decor",
    category: "Birthday",
    description: "Magical birthday themes for kids including superheroes, princesses, and more.",
    address: "Bangalore, Karnataka",
    price: 15000,
    duration: "4 Hours",
    features: ["Themed Decor", "Balloons", "Cake Table", "Party Hats"],
    images: [IMAGES.birthday1, IMAGES.wedding5],
    isCustom: false,
    isActive: true
  },
  {
    title: "Milestone Birthday Bash (50th/60th)",
    category: "Birthday",
    description: "Sophisticated celebration for milestone birthdays with elegant decor and music.",
    address: "Delhi, NCR",
    price: 45000,
    duration: "5 Hours",
    features: ["Elegant Decor", "Live Band", "Catering", "Photography"],
    images: [IMAGES.birthday1, IMAGES.food1, IMAGES.corporate1],
    isCustom: false,
    isActive: true
  },
  {
    title: "Baby Shower Event",
    category: "Birthday",
    description: "Cute and cozy baby shower setups with pastel colors.",
    address: "Pune, Maharashtra",
    price: 20000,
    duration: "3 Hours",
    features: ["Pastel Balloons", "Baby Blocks", "Games", "Photography"],
    images: [IMAGES.birthday1, IMAGES.wedding4],
    isCustom: false,
    isActive: true
  },

  // Food & Catering
  {
    title: "Premium Catering Services",
    category: "Other",
    description: "Exquisite multi-cuisine catering for weddings and corporate events.",
    address: "Chennai, Tamil Nadu",
    price: 35000,
    duration: "1 Day",
    features: ["Live Counters", "Buffet", "Dessert Bar", "Service Staff"],
    images: [IMAGES.food1, IMAGES.wedding2],
    isCustom: false,
    isActive: true
  },
  {
    title: "Food Truck Festival Stall",
    category: "Other",
    description: "Rent a fully equipped food truck for your outdoor event.",
    address: "Mumbai, Maharashtra",
    price: 25000,
    duration: "1 Day",
    features: ["Equipped Truck", "Permits", "Power Backup", "Fun Vibes"],
    images: [IMAGES.food1, IMAGES.corporate3],
    isCustom: false,
    isActive: true
  },
  {
    title: "Cocktail Party Catering",
    category: "Other",
    description: "Bartending services and finger food for cocktail parties.",
    address: "Gurgaon, Haryana",
    price: 50000,
    duration: "5 Hours",
    features: ["Professional Bartenders", "Glassware", "Cocktail Menu", "Appetizers"],
    images: [IMAGES.dj2, IMAGES.food1],
    isCustom: false,
    isActive: true
  },

  // Music & Entertainment
  {
    title: "Professional DJ & Sound",
    category: "Other",
    description: "High-energy DJ services with top-notch sound and lighting gear.",
    address: "Pune, Maharashtra",
    price: 25000,
    duration: "5 Hours",
    features: ["Pro DJ", "JBL Sound", "Laser Lights", "Smoke Machine"],
    images: [IMAGES.dj1, IMAGES.dj2, IMAGES.dj3],
    isCustom: false,
    isActive: true
  },
  {
    title: "Live Music Concert Setup",
    category: "Other",
    description: "Complete stage and sound setup for live bands and concerts.",
    address: "Bangalore, Karnataka",
    price: 100000,
    duration: "1 Day",
    features: ["Concert Stage", "Line Array Sound", "Truss Lighting", "Backline"],
    images: [IMAGES.dj3, IMAGES.dj1, IMAGES.corporate2],
    isCustom: true,
    isActive: true
  },
  {
    title: "Stand-up Comedy Night",
    category: "Other",
    description: "Organize a laughter-filled evening with popular stand-up comedians.",
    address: "Mumbai, Maharashtra",
    price: 60000,
    duration: "3 Hours",
    features: ["Comedian Booking", "Mic & Sound", "Stage", "Seating"],
    images: [IMAGES.dj1, IMAGES.corporate1],
    isCustom: false,
    isActive: true
  },
  {
    title: "Magic Show for Events",
    category: "Other",
    description: "Engaging magic shows for corporate events or private parties.",
    address: "Delhi, NCR",
    price: 20000,
    duration: "1 Hour",
    features: ["Illusionist", "Interactive Acts", "Mind Reading", "Fun"],
    images: [IMAGES.dj2, IMAGES.birthday1],
    isCustom: false,
    isActive: true
  },

  // Workshops & Wellness
  {
    title: "Yoga & Wellness Retreat",
    category: "Other",
    description: "Rejuvenating yoga sessions and wellness workshops for groups.",
    address: "Rishikesh, Uttarakhand",
    price: 45000,
    duration: "3 Days",
    features: ["Yoga Estimator", "Meditation", "Vegan Food", "Nature Walks"],
    images: [IMAGES.wedding4, IMAGES.corporate3], // Using nature/calm vibes
    isCustom: true,
    isActive: true
  },
  {
    title: "Art & Painting Workshop",
    category: "Other",
    description: "Creative painting workshops for relaxation and team bonding.",
    address: "Mumbai, Maharashtra",
    price: 15000,
    duration: "3 Hours",
    features: ["Canvas & Paints", "Instructor", "Aprons", "Refreshments"],
    images: [IMAGES.birthday1, IMAGES.corporate1],
    isCustom: false,
    isActive: true
  },

  // Social & Others
  {
    title: "Graduation Party",
    category: "Other",
    description: "Celebrate the milestone with a fun graduation party.",
    address: "Chennai, Tamil Nadu",
    price: 30000,
    duration: "5 Hours",
    features: ["DJ", "Photo Booth", "Food", "Decor"],
    images: [IMAGES.dj3, IMAGES.birthday1],
    isCustom: false,
    isActive: true
  },
  {
    title: "Retirement Party Planning",
    category: "Other",
    description: "A respectful and joyous send-off for your colleagues or loved ones.",
    address: "Kolkata, West Bengal",
    price: 40000,
    duration: "4 Hours",
    features: ["Speeches Setup", "Catering", "Decor", "Memory Lane Video"],
    images: [IMAGES.wedding1, IMAGES.food1],
    isCustom: false,
    isActive: true
  }
];

const Review = require('./models/Review');
require('dotenv').config();

// ... existing code ...

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
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // 1. Create Admins and Users
    const admin = new User({
      name: "Admin User",
      email: "admin@eventease.com",
      password: "admin123",
      role: "admin"
    });
    await admin.save();
    console.log('Admin user created');

    const demoUser = new User({
      name: "Demo User",
      email: "demo@eventease.com",
      password: "password123",
      role: "customer",
      mobile: "9876543210"
    });
    await demoUser.save();
    console.log('Demo user created');

    // Create extra dummy users for reviews
    const extraUsers = [];
    const dummyNames = ["Alice Smith", "Bob Jones", "Charlie Brown", "Diana Prince", "Evan Wright"];
    for (let i = 0; i < dummyNames.length; i++) {
        const user = new User({
            name: dummyNames[i],
            email: `user${i+1}@example.com`,
            password: "password123",
            role: "customer",
            mobile: `900000000${i}`
        });
        await user.save();
        extraUsers.push(user);
    }
    console.log(`Created ${extraUsers.length} extra users for reviews`);

    // 2. Create Services
    const createdServices = [];
    for (const service of sampleServices) {
      const newService = await Service.create({
        ...service,
        createdBy: demoUser._id, // Assign services to Demo User
        companyName: "EventEase Demo Events",
        companyContact: "9876543210"
      });
      createdServices.push(newService);
    }
    console.log(`Created ${createdServices.length} services`);

    // 3. Create Reviews
    const reviewComments = [
        "Amazing service! Highly recommended.",
        "Good experience, but could be slightly better.",
        "Absolutely loved it! Will book again.",
        "Professional and timely. Great job.",
        "Value for money. Satisfied with the outcome.",
        "The team was very cooperative and understanding.",
        "Decent service for the price.",
        "Exceeded my expectations!",
        "Very creative and unique execution.",
        "Had a wonderful time, thanks to the team."
    ];

    console.log('Generating reviews...');
    const allReviewers = [demoUser, ...extraUsers];

    for (const service of createdServices) {
        // Randomly decide how many reviews (0 to 5)
        const numReviews = Math.floor(Math.random() * 6); 
        // Shuffle users to pick random reviewers
        const shuffledUsers = allReviewers.sort(() => 0.5 - Math.random());
        const selectedReviewers = shuffledUsers.slice(0, numReviews);

        for (const reviewer of selectedReviewers) {
            const rating = Math.floor(Math.random() * 3) + 3; // Random rating 3-5
            const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
            
            // Generate random replies
            const replies = [];
            if (Math.random() > 0.7) { // 30% chance of reply
                 const replier = allReviewers[Math.floor(Math.random() * allReviewers.length)];
                 const replyTexts = [
                     "Thank you for your feedback!",
                     "Glad you enjoyed it.",
                     "We appreciate your review.",
                     "Hope to see you again soon!",
                     "Thanks for choosing us."
                 ];
                 replies.push({
                     userId: replier._id,
                     comment: replyTexts[Math.floor(Math.random() * replyTexts.length)],
                     createdAt: new Date()
                 });
            }

            // Generate random likes
            const likes = [];
            const dislikes = [];
            // Randomly add 0-3 likes
            const numLikes = Math.floor(Math.random() * 4);
            const shuffledLikers = allReviewers.sort(() => 0.5 - Math.random()).slice(0, numLikes);
            shuffledLikers.forEach(liker => likes.push(liker._id));

            await Review.create({
                userId: reviewer._id,
                serviceId: service._id,
                rating: rating,
                comment: comment,
                replies: replies,
                likes: likes,
                dislikes: dislikes
            });

        }

        // Update service stats
        const serviceReviews = await Review.find({ serviceId: service._id });
        const count = serviceReviews.length;
        const avg = count === 0 ? 0 : serviceReviews.reduce((sum, r) => sum + r.rating, 0) / count;
        
        await Service.findByIdAndUpdate(service._id, {
            reviewCount: count,
            averageRating: Number(avg.toFixed(1))
        });
    }
    console.log('Reviews generated and stats updated');

    // 4. Create Bookings (for Analytics)
    const bookings = [];
    // ... rest of the code ...
    const statuses = ['confirmed', 'completed', 'pending_admin_approval', 'cancelled', 'rejected'];
    const users = [admin, demoUser];

    // Helper to get random date within range (months from now)
    const getRandomDate = (minMonths, maxMonths) => {
      const date = new Date();
      const randomMonth = Math.floor(Math.random() * (maxMonths - minMonths + 1)) + minMonths;
      date.setMonth(date.getMonth() + randomMonth);
      // Random day
      date.setDate(Math.floor(Math.random() * 28) + 1);
      return date;
    };

    console.log('Generating sample bookings...');
    
    for (let i = 0; i < 50; i++) {
        const service = createdServices[Math.floor(Math.random() * createdServices.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        let date;

        // Logic to make data realistic
        if (status === 'completed') {
            // Must be in the past
            date = getRandomDate(-6, -1);
        } else if (status === 'pending_admin_approval' || status === 'confirmed') {
            // Mostly in future, some recent past
            date = getRandomDate(-1, 3);
        } else {
            // Cancelled/Rejected anywhere
            date = getRandomDate(-4, 2);
        }

        bookings.push({
            userId: user._id,
            serviceId: service._id,
            name: user.name,
            mobile: user.mobile || "9999999999",
            date: date,
            timeSlot: "10:00 AM - 02:00 PM",
            durationHours: 4,
            status: status,
            paymentStatus: (status === 'confirmed' || status === 'completed') ? 'paid' : 'pending'
        });
    }

    await Booking.insertMany(bookings);
    console.log(`Created ${bookings.length} sample bookings for analytics`);

    // Create sample partner applications
    await Partner.deleteMany({});
    const samplePartners = [
      {
        companyName: "Elite Catering Co.",
        contactPerson: "Rajesh Kumar",
        email: "rajesh@elitecatering.com",
        phone: "9876543210",
        website: "www.elitecatering.com",
        eventType: "Wedding",
        eventDetails: "Full service catering for weddings up to 1000 guests",
        serviceDescription: "Premium Indian and Continental cuisine with live counters",
        pricing: "Starting from ₹1500 per plate",
        margin: 15,
        experience: 10,
        portfolio: "https://example.com/portfolio/elite",
        status: "pending"
      },
      {
        companyName: "Star Decorators",
        contactPerson: "Priya Singh",
        email: "priya@stardecor.com",
        phone: "9876543211",
        website: "www.stardecor.com",
        eventType: "Birthday",
        eventDetails: "Theme based decorations for kids and adults",
        serviceDescription: "Balloon arches, stage setup, lighting and floral arrangements",
        pricing: "Packages start at ₹25000",
        margin: 20,
        experience: 5,
        portfolio: "https://example.com/portfolio/star",
        status: "negotiating",
        reviewNotes: "Margin seems a bit high, proposing 15%"
      },
      {
        companyName: "Sound & Beats DJ",
        contactPerson: "Amit Shah",
        email: "amit@soundbeats.com",
        phone: "9876543212",
        website: "www.soundbeats.com",
        eventType: "Corporate",
        eventDetails: "Professional DJ and sound system for corporate events",
        serviceDescription: "JBL sound system, LED walls, and professional DJ",
        pricing: "₹50000 per event",
        margin: 10,
        experience: 8,
        portfolio: "https://example.com/portfolio/sound",
        status: "accepted",
        reviewedBy: admin._id,
        reviewedAt: new Date()
      }
    ];

    // Add addresses to sample partners
    samplePartners[0].address = "123 Catering Lane, Mumbai, Maharashtra";
    samplePartners[1].address = "45 Decor Street, Delhi, NCR";
    samplePartners[2].address = "78 Sound Avenue, Bangalore, Karnataka";
    
    // Create Partner profile for Demo User (so their services show company details)
    const demoPartner = {
        companyName: "EventEase Demo Events",
        contactPerson: "Demo Partner",
        email: demoUser.email,
        phone: "9876543210",
        website: "www.eventease-demo.com",
        eventType: "Wedding",
        eventDetails: "Full service event planning for all occasions",
        serviceDescription: "Premier event management company specializing in luxury weddings and corporate events",
        pricing: "Variable",
        margin: 10,
        experience: 5,
        portfolio: "https://example.com/portfolio/demo",
        status: "accepted",
        userId: demoUser._id,
        address: "101 Event Plaza, Cyber City, Gurgaon"
    };
    
    await Partner.insertMany([...samplePartners, demoPartner]);
    console.log('Created sample partner applications');

    console.log('Database seeded successfully!');
    console.log('Admin Email: admin@eventease.com');
    console.log('Demo Email: demo@eventease.com');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.connection.close();
  }
}

seedData();