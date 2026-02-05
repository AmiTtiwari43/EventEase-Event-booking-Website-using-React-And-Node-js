import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-2xl border-b border-white/20 dark:border-white/10' 
        : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo with enhanced animations */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/25">
              <Logo className="w-10 h-10" />
            </div>
            <div className="transition-all duration-300 group-hover:scale-105">
              <h1 className="text-2xl font-bold text-gradient">EventEase</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 animate-pulse-slow">Lite</p>
            </div>
          </Link>

          {/* Desktop Navigation with enhanced styling */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                isActive('/') 
                  ? 'text-purple-600 font-semibold' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Home
              {isActive('/') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-fade-in"></div>
              )}
            </Link>
            <Link
              to="/services"
              className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                isActive('/services') 
                  ? 'text-purple-600 font-semibold' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Services
              {isActive('/services') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-fade-in"></div>
              )}
            </Link>
            <Link
              to="/about"
              className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                isActive('/about') 
                  ? 'text-purple-600 font-semibold' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              About Us
              {isActive('/about') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-fade-in"></div>
              )}
            </Link>
            {user && (
              <>
                {user.role === 'customer' && (
                  <Link
                    to="/my-bookings"
                    className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                      isActive('/my-bookings') 
                        ? 'text-purple-600 dark:text-purple-400 font-semibold' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                    }`}
                  >
                    My Bookings
                    {isActive('/my-bookings') && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-fade-in"></div>
                    )}
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                      isActive('/admin') 
                        ? 'text-purple-600 dark:text-purple-400 font-semibold' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                    }`}
                  >
                    Admin
                    {isActive('/admin') && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-fade-in"></div>
                    )}
                  </Link>
                )}
                {user.role === 'partner' && (
                    <Link
                      to="/partner-dashboard"
                      className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                        isActive('/partner-dashboard') 
                          ? 'text-purple-600 dark:text-purple-400 font-semibold' 
                          : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                      }`}
                    >
                      Dashboard
                      {isActive('/partner-dashboard') && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-fade-in"></div>
                      )}
                    </Link>
                  )}
              </>
            )}
          </div>

          {/* User Menu with enhanced styling */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                    <span className="text-white font-semibold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="font-medium group-hover:scale-105 transition-transform duration-300">{user.name || 'User'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/25"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button with enhanced styling */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none focus:text-purple-600 transition-all duration-300 p-2 rounded-lg hover:bg-purple-50"
            >
              <svg className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu with enhanced animations */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slide-up">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:scale-105 ${
                  isActive('/') ? 'text-purple-600 font-semibold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className={`text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:scale-105 ${
                  isActive('/services') ? 'text-purple-600 font-semibold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/about"
                className={`text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:scale-105 ${
                  isActive('/about') ? 'text-purple-600 font-semibold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              {user && (
                <>
                  {user.role === 'customer' && (
                    <Link
                      to="/my-bookings"
                      className={`text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:scale-105 ${
                        isActive('/my-bookings') ? 'text-purple-600 font-semibold' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={`text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:scale-105 ${
                        isActive('/admin') ? 'text-purple-600 font-semibold' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  {user.role === 'partner' && (
                    <Link
                      to="/partner-dashboard"
                      className={`text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:scale-105 ${
                        isActive('/partner-dashboard') ? 'text-purple-600 font-semibold' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-red-600 hover:text-red-700 font-medium transition-all duration-300 hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 text-center transform hover:scale-105 hover:shadow-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 
