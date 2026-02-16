const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/academicConfigController');
const { authRequired, requireRole } = require('../middleware/auth');

router.get('/', authRequired, requireRole('admin'), getConfig);
router.put('/', authRequired, requireRole('admin'), updateConfig);

module.exports = router;
