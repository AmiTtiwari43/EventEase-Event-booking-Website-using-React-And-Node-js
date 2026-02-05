
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import CreateService from './pages/CreateService';
import ServiceDetails from './pages/ServiceDetails';
import MyBookings from './pages/MyBookings';
import PaymentQR from './pages/PaymentQR';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import PartnerContact from './pages/PartnerContact';
import PartnerDashboard from './pages/PartnerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route 
            path="/services/new" 
            element={
              <ProtectedRoute partnerOnly>
                <CreateService />
              </ProtectedRoute>
            } 
          />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/partner" element={<PartnerContact />} />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-qr" 
            element={
              <ProtectedRoute>
                <PaymentQR />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
            <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/partner-dashboard" 
            element={
              <ProtectedRoute partnerOnly>
                <PartnerDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 
