const Timetable = require('../models/Timetable');
const { generateTimetablesForSemester } = require('../services/timetableGenerator');

async function dropStaleTimetableIndexes() {
  const namesToTry = ['classSection_1', 'classSection'];
  for (const name of namesToTry) {
    try {
      await Timetable.collection.dropIndex(name);
    } catch (e) {
      const notFound = e.code === 27 || e.codeName === 'IndexNotFound' || (e.message && e.message.includes('index not found'));
      if (!notFound) console.log('Drop index', name, e.message);
    }
  }
  try {
    const cursor = Timetable.collection.listIndexes();
    const list = await cursor.toArray();
    for (const idx of list) {
      if (idx.name && idx.name.toLowerCase().includes('classsection')) {
        await Timetable.collection.dropIndex(idx.name);
      }
    }
  } catch (e) {
    if (e.code !== 27 && e.codeName !== 'IndexNotFound') console.log('List/drop timetable indexes:', e.message);
  }
}

const getTimetables = async (req, res) => {
  try {
    const filter = {};
    if (req.query.semester) filter.semester = Number(req.query.semester);
    if (req.query.department) filter.department = req.query.department;
    const timetables = await Timetable.find(filter)
      .populate('department', 'name departmentId')
      .sort({ department: 1, sectionNumber: 1 });
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('department', 'name departmentId');
    if (!timetable) return res.status(404).json({ error: 'Timetable not found' });
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generateTimetables = async (req, res) => {
  try {
    await dropStaleTimetableIndexes();
    const semester = Number(req.body && req.body.semester !== undefined ? req.body.semester : req.query.semester) || 1;
    const replaceExisting = req.body && req.body.replaceExisting === true;
    const { timetables, errors, skipped, skippedDepartments } = await generateTimetablesForSemester(semester, { replaceExisting });
    const count = timetables ? timetables.length : 0;
    let message = '';
    if (count === 0 && (!errors || errors.length === 0) && (!skippedDepartments || skippedDepartments.length === 0)) {
      message = 'No timetables generated. Set Academic Config, add Departments, Faculty, and Subjects (with Faculty & Room) for this semester, then try again.';
    } else if (count === 0 && errors.length > 0) {
      message = (errors[0] || 'Generation failed.') + (errors.length > 1 ? ' (' + errors.length + ' issues.)' : '');
    } else {
      message = replaceExisting
        ? `Generated ${count} timetable(s) for semester ${semester} (replaced existing).`
        : `Generated ${count} timetable(s) for semester ${semester}. Existing timetables were left unchanged so faculty schedules stay stable.`;
      if (skipped > 0) message += ` Skipped ${skipped} existing timetable(s).`;
      if (skippedDepartments && skippedDepartments.length > 0) {
        message += ' No timetable for: ' + skippedDepartments.map(d => d.name + ' (' + d.reason + ')').join('; ') + '.';
      }
    }
    res.json({
      message,
      timetables: timetables || [],
      errors: errors || [],
      skipped: skipped || 0,
      skippedDepartments: skippedDepartments || []
    });
  } catch (err) {
    console.error('Timetable generation error:', err);
    res.status(500).json({ error: err.message || 'Timetable generation failed' });
  }
};

const updateTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayIndex, periodIndex, subject, faculty, subjectName, facultyName, roomNumber } = req.body;
    const timetable = await Timetable.findById(id);
    if (!timetable) return res.status(404).json({ error: 'Timetable not found' });
    if (!timetable.slots[dayIndex]) timetable.slots[dayIndex] = [];
    timetable.slots[dayIndex][periodIndex] = {
      subject: subject || null,
      faculty: faculty || null,
      subjectName: subjectName || '',
      facultyName: facultyName || '',
      roomNumber: roomNumber || ''
    };
    timetable.updatedAt = new Date();
    await timetable.save();
    const updated = await Timetable.findById(id).populate('department', 'name departmentId');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTimetablesBySemester = async (req, res) => {
  try {
    const semester = Number(req.params.semester);
    const result = await Timetable.deleteMany({ semester });
    res.json({ message: `Deleted ${result.deletedCount} timetable(s) for semester ${semester}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTimetables,
  getTimetable,
  generateTimetables,
  updateTimetableSlot,
  deleteTimetablesBySemester
};
