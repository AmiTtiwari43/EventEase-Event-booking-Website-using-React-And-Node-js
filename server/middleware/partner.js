module.exports = function(req, res, next) {
    // 401 Unauthorized
    if (req.user.role !== 'partner' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Partners or Admins only.' });
    }
    next();
  };
