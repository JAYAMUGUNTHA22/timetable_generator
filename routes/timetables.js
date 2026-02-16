const express = require('express');
const router = express.Router();
const {
  getTimetables,
  getTimetable,
  generateTimetables,
  updateTimetableSlot,
  deleteTimetablesBySemester
} = require('../controllers/timetableController');
const { authRequired, requireRole } = require('../middleware/auth');

router.get('/', authRequired, requireRole('admin'), getTimetables);
router.post('/generate', authRequired, requireRole('admin'), generateTimetables);
router.delete('/semester/:semester', authRequired, requireRole('admin'), deleteTimetablesBySemester);
router.get('/:id', authRequired, requireRole('admin'), getTimetable);
router.put('/:id/slot', authRequired, requireRole('admin'), updateTimetableSlot);

module.exports = router;

