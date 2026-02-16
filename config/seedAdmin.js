const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function ensureDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ role: 'admin', email });
  if (existing) {
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    role: 'admin',
    email,
    passwordHash
  });
  console.log(`Seeded default admin user: ${email} / ${password}`);
}

module.exports = { ensureDefaultAdmin };

