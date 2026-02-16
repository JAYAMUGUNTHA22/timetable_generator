const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { getBySubject, setForSubject } = require('../controllers/subjectFacultyRoomController');
const { authRequired, requireRole } = require('../middleware/auth');

router.get('/', authRequired, requireRole('admin'), getSubjects);
router.get('/:subjectId/faculty-rooms', authRequired, requireRole('admin'), getBySubject);
router.put('/:subjectId/faculty-rooms', authRequired, requireRole('admin'), setForSubject);
router.get('/:id', authRequired, requireRole('admin'), getSubject);
router.post('/', authRequired, requireRole('admin'), createSubject);
router.put('/:id', authRequired, requireRole('admin'), updateSubject);
router.delete('/:id', authRequired, requireRole('admin'), deleteSubject);

module.exports = router;

