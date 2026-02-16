const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const { signUser, COOKIE_NAME } = require('../middleware/auth');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false // set true if you serve over HTTPS
};

async function login(req, res) {
  try {
    const { role } = req.body || {};
    if (!role) return res.status(400).json({ error: 'Role is required' });

    let user;

    if (role === 'admin') {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
      user = await User.findOne({ role: 'admin', email });
      if (!user || !user.passwordHash) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials.' });
    } else if (role === 'faculty') {
      const { facultyId, name } = req.body;
      if (!facultyId || !name) {
        return res.status(400).json({ error: 'Faculty ID and name are required.' });
      }
      const faculty = await Faculty.findOne({ facultyId: facultyId.trim() });
      if (!faculty || faculty.name.trim().toLowerCase() !== String(name).trim().toLowerCase()) {
        return res.status(401).json({ error: 'Faculty not found. Check ID and name.' });
      }
      user = await User.findOne({ role: 'faculty', faculty: faculty._id });
      if (!user) {
        user = await User.create({
          role: 'faculty',
          faculty: faculty._id,
          email: null,
          passwordHash: null
        });
      }
    } else if (role === 'student') {
      const { email, departmentId, sectionNumber } = req.body;
      if (!email || !departmentId || !sectionNumber) {
        return res.status(400).json({ error: 'Email, department and section are required.' });
      }
      const dept = await Department.findById(departmentId);
      if (!dept) return res.status(400).json({ error: 'Department not found.' });
      user = await User.findOne({ role: 'student', email, department: dept._id, sectionNumber });
      if (!user) {
        user = await User.create({
          role: 'student',
          email,
          department: dept._id,
          sectionNumber,
          passwordHash: null
        });
      }
    } else {
      return res.status(400).json({ error: 'Unsupported role.' });
    }

    const token = signUser(user);
    res.cookie(COOKIE_NAME, token, cookieOptions);
    res.json({
      user: {
        id: user._id,
        role: user.role,
        email: user.email || null,
        faculty: user.faculty || null,
        department: user.department || null,
        sectionNumber: user.sectionNumber || null
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
}

async function me(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: req.user });
}

function logout(req, res) {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.json({ success: true });
}

module.exports = {
  login,
  me,
  logout
};

