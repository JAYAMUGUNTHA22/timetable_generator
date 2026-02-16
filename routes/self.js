const express = require('express');
const router = express.Router();
const { authRequired, requireRole } = require('../middleware/auth');
const Timetable = require('../models/Timetable');
const AcademicConfig = require('../models/AcademicConfig');
const Faculty = require('../models/Faculty');

// Faculty: view own timetable + free periods
router.get('/faculty/timetable', authRequired, requireRole('faculty'), async (req, res) => {
  try {
    const facultyId = req.user.faculty;
    if (!facultyId) return res.status(400).json({ error: 'Faculty not linked to user.' });
    const semester = Number(req.query.semester) || 1;

    const config = await AcademicConfig.findOne().sort({ updatedAt: -1 });
    if (!config) return res.status(400).json({ error: 'Academic configuration not found.' });
    const workingDays = config.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periodsPerDay = config.periodsPerDay || 7;
    const breakPeriodIndices = config.breakPeriodIndices || [];

    const timetables = await Timetable.find({ semester });

    const grid = [];
    for (let d = 0; d < workingDays.length; d++) {
      const row = [];
      for (let p = 0; p < periodsPerDay; p++) {
        if (breakPeriodIndices.includes(p)) {
          row.push({ status: 'break' });
          continue;
        }
        let found = null;
        for (const tt of timetables) {
          const slotRow = tt.slots && tt.slots[d];
          const slot = slotRow && slotRow[p];
          if (slot && slot.faculty && slot.faculty.toString() === facultyId) {
            found = {
              status: 'class',
              subjectName: slot.subjectName,
              department: tt.department,
              sectionNumber: tt.sectionNumber,
              roomNumber: slot.roomNumber || ''
            };
            break;
          }
        }
        if (!found) {
          row.push({ status: 'free' });
        } else {
          row.push(found);
        }
      }
      grid.push(row);
    }

    const faculty = await Faculty.findById(facultyId).populate('homeDepartment', 'name departmentId');

    res.json({
      faculty: faculty ? { name: faculty.name, facultyId: faculty.facultyId, department: faculty.homeDepartment } : null,
      workingDays,
      periodsPerDay,
      grid
    });
  } catch (err) {
    console.error('Faculty self timetable error:', err);
    res.status(500).json({ error: 'Failed to load timetable.' });
  }
});

// Student: view own section timetable
router.get('/student/timetable', authRequired, requireRole('student'), async (req, res) => {
  try {
    const { department, sectionNumber } = req.user;
    if (!department || !sectionNumber) {
      return res.status(400).json({ error: 'Student is not linked to department/section.' });
    }
    const semester = Number(req.query.semester) || 1;
    const tt = await Timetable.findOne({ department, sectionNumber, semester }).populate('department', 'name departmentId');
    if (!tt) return res.status(404).json({ error: 'Timetable not found for your section.' });
    res.json(tt);
  } catch (err) {
    console.error('Student self timetable error:', err);
    res.status(500).json({ error: 'Failed to load timetable.' });
  }
});

module.exports = router;

