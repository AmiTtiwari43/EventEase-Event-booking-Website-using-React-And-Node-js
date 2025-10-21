# EventEase Lite - Full Stack Event Management Platform

A modern, full-stack event management platform built with React, Node.js, and MongoDB. EventEase Lite connects event planners with service providers, offering a comprehensive solution for event planning and management.

## 🚀 Features

### For Event Planners
- **Browse Services**: Discover a wide range of event services
- **Book Services**: Easy booking system with real-time availability
- **Manage Bookings**: Track and manage all your event bookings
- **User Profiles**: Personalized profiles with booking history
- **Reviews & Ratings**: Share experiences and read reviews
- **UPI QR Code Payment**: Pay for bookings via UPI QR code after admin confirmation
- **Refund Requests**: Request refunds for cancelled, paid bookings (fully functional, with clear status display)
- **Improved Navigation**: All navigation buttons and hyperlinks (including 'Contact Us') are checked and work correctly
- **Consistent Image Transitions**: All carousels and sliders now transition every 5 seconds
- **Show/Hide Password**: Login and Signup pages feature show/hide password buttons for better UX

### For Service Partners
- **Partner Registration**: Easy onboarding for service providers (requires login)
- **Service Management**: Add, edit, and manage your services
- **Booking Management**: Handle incoming booking requests
- **Analytics Dashboard**: Track performance and earnings

### For Administrators
- **Admin Dashboard**: Comprehensive management interface
- **User Management**: Manage users and partners
- **Booking Oversight**: Monitor all platform bookings
- **Analytics**: Platform-wide statistics and insights
- **Refund Processing**: Process and track refunds for cancelled bookings
- **Revenue Calculation**: Revenue only includes paid, non-refunded bookings

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
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
│   │   │   ├── PartnerContact.jsx   # 'Be Our Partner' application page (login required)
│   │   │   ├── PaymentQRCode.jsx    # UPI QR code payment page
│   │   │   ├── MyBookings.jsx       # User bookings, refund/payment actions
│   │   │   ├── AdminDashboard.jsx   # Admin dashboard (refunds, analytics)
│   │   │   └── ...
│   └── ...
└── server/                 # Node.js backend
    └── ...
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
- Protected routes (booking, contact, partner, and payment pages require login)
- User role management (User, Partner, Admin)
- **Show/Hide Password**: Toggle password visibility in login and signup forms

### Booking & Payment System
- Real-time booking management
- Booking status tracking
- UPI QR code payment (shown only after admin confirmation)
- Payment status tracking (paid/unpaid)
- **Refund request and processing**: User can request refund after admin cancellation and payment; refund status is shown in MyBookings (yellow for requested, green for successful)
- Revenue analytics (only paid, non-refunded bookings count)

### User Experience Improvements
- All navigation buttons and hyperlinks are checked and work correctly
- Consistent 5-second image transitions for all carousels/sliders

### Partner Management
- Partner registration and approval (via 'Be Our Partner' page, login required)
- Service listing and management
- Partner dashboard

### Admin Features
- User and partner management
- Booking oversight
- Refund management
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

### Deployment environment variables
For CORS and frontend-to-backend configuration, set the following environment variables:

- `ALLOWED_ORIGINS` (server): comma-separated list of allowed front-end origins. Example:

```
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://staging.yourdomain.com,http://localhost:3001
```

- `VITE_API_URL` (client): the backend base URL used by the frontend when built for production. Example in a Vite `.env` file placed in the `client/` folder:

```
VITE_API_URL=https://your-backend.example.com/api
```

These settings ensure the production front-end can call the backend without CORS failures and that the correct backend URL is used when the app is deployed.

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
