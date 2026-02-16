const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { authRequired, requireRole } = require('../middleware/auth');

router.get('/', authRequired, requireRole('admin'), getDepartments);
router.get('/:id', authRequired, requireRole('admin'), getDepartment);
router.post('/', authRequired, requireRole('admin'), createDepartment);
router.put('/:id', authRequired, requireRole('admin'), updateDepartment);
router.delete('/:id', authRequired, requireRole('admin'), deleteDepartment);

module.exports = router;

