const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth Middleware: Header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Auth Middleware: No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth Middleware: Token decoded, userId:', decoded.userId);
      
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        console.log('Auth Middleware: User not found for ID:', decoded.userId);
        return res.status(401).json({ message: 'Token is not valid' });
      }

      console.log('Auth Middleware: User found, role:', user.role);
      req.user = user;
      next();
    } catch (err) {
       console.log('Auth Middleware: JWT Verification Failed:', err.message);
       return res.status(401).json({ message: 'Token is not valid' });
    }

  } catch (error) {
    console.error('Auth Middleware: System Error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authorization failed' });
  }
};

module.exports = { auth, adminAuth }; 
