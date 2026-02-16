const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const COOKIE_NAME = 'token';

async function authRequired(req, res, next) {
  try {
    const token = req.cookies && req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

function signUser(user) {
  return jwt.sign({
    id: user._id.toString(),
    role: user.role,
    faculty: user.faculty ? user.faculty.toString() : null,
    department: user.department ? user.department.toString() : null,
    sectionNumber: user.sectionNumber || null,
    email: user.email || null
  }, JWT_SECRET, { expiresIn: '7d' });
}

async function attachUser(req, res, next) {
  const token = req.cookies && req.cookies[COOKIE_NAME];
  if (!token) return next();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (e) {
    // ignore invalid token
  }
  next();
}

module.exports = {
  authRequired,
  requireRole,
  signUser,
  attachUser,
  COOKIE_NAME
};

