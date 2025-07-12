# EventEase Lite - Full Stack Event Management Platform

A modern, full-stack event management platform built with React, Node.js, and MongoDB. EventEase Lite connects event planners with service providers, offering a comprehensive solution for event planning and management.

## 🚀 Features

### For Event Planners
- **Browse Services**: Discover a wide range of event services
- **Book Services**: Easy booking system with real-time availability
- **Manage Bookings**: Track and manage all your event bookings
- **User Profiles**: Personalized profiles with booking history
- **Reviews & Ratings**: Share experiences and read reviews

### For Service Partners
- **Partner Registration**: Easy onboarding for service providers
- **Service Management**: Add, edit, and manage your services
- **Booking Management**: Handle incoming booking requests
- **Analytics Dashboard**: Track performance and earnings

### For Administrators
- **Admin Dashboard**: Comprehensive management interface
- **User Management**: Manage users and partners
- **Booking Oversight**: Monitor all platform bookings
- **Analytics**: Platform-wide statistics and insights

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing

### Development Tools
- **Git** - Version control
- **npm** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
FULL STACK DEVELOPMENT PETV88/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   └── main.jsx       # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── server.js         # Server entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd FULL-STACK-DEVELOPMENT-PETV88
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm run dev
   
   # Start frontend server (from client directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📋 Available Scripts

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Configuration

### Database Setup
1. Create a MongoDB database (local or MongoDB Atlas)
2. Update the `MONGODB_URI` in your `.env` file
3. Run the seed script to populate with sample data:
   ```bash
   cd server
   npm run seed
   ```

### Environment Variables
Create a `.env` file in the server directory with the following variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## 🎯 Key Features Implementation

### Authentication System
- JWT-based authentication
- Protected routes
- User role management (User, Partner, Admin)

### Booking System
- Real-time booking management
- Booking status tracking
- Payment integration ready

### Partner Management
- Partner registration and approval
- Service listing and management
- Partner dashboard

### Admin Features
- User and partner management
- Booking oversight
- Platform analytics

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to your preferred hosting service

### Backend Deployment (Railway/Render/Heroku)
1. Set up environment variables on your hosting platform
2. Deploy the server directory
3. Update the frontend API base URL to point to your deployed backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React, Vite, Tailwind CSS
- **Backend Development**: Node.js, Express, MongoDB
- **Database Design**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based system
- **UI/UX**: Modern, responsive design

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**EventEase Lite** - Making event planning effortless and enjoyable! 🎉 