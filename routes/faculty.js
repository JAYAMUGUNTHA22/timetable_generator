const express = require('express');
const router = express.Router();
const {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty
} = require('../controllers/facultyController');
const { authRequired, requireRole } = require('../middleware/auth');

router.get('/', authRequired, requireRole('admin'), getFaculty);
router.get('/:id', authRequired, requireRole('admin'), getFacultyById);
router.post('/', authRequired, requireRole('admin'), createFaculty);
router.put('/:id', authRequired, requireRole('admin'), updateFaculty);
router.delete('/:id', authRequired, requireRole('admin'), deleteFaculty);

module.exports = router;

