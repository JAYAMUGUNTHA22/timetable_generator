const SubjectFacultyRoom = require('../models/SubjectFacultyRoom');

const getBySubject = async (req, res) => {
  try {
    const list = await SubjectFacultyRoom.find({ subject: req.params.subjectId })
      .populate('faculty', 'name facultyId')
      .sort({ order: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const setForSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { facultyRooms } = req.body;
    if (!Array.isArray(facultyRooms)) {
      return res.status(400).json({ error: 'facultyRooms must be an array' });
    }
    await SubjectFacultyRoom.deleteMany({ subject: subjectId });
    const docs = facultyRooms
      .filter((fr) => fr.faculty && fr.roomNumber && String(fr.roomNumber).trim())
      .map((fr, i) => ({
        subject: subjectId,
        faculty: fr.faculty,
        roomNumber: String(fr.roomNumber).trim(),
        order: i
      }));
    if (docs.length > 0) {
      await SubjectFacultyRoom.insertMany(docs);
    }
    const list = await SubjectFacultyRoom.find({ subject: subjectId })
      .populate('faculty', 'name facultyId')
      .sort({ order: 1 });
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getBySubject, setForSubject };
