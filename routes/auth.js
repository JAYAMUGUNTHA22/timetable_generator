const express = require('express');
const router = express.Router();
const { login, me, logout } = require('../controllers/authController');
const { attachUser } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', attachUser, me);
router.post('/logout', logout);

module.exports = router;

