const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const employerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'employer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, employer only' });
  }
};

const jobseekerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'jobseeker') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, jobseeker only' });
  }
};

module.exports = { protect, employerOnly, jobseekerOnly };