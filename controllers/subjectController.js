const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const SubjectFacultyRoom = require('../models/SubjectFacultyRoom');

function toObjectId(v) {
  if (v == null) return v;
  if (v instanceof mongoose.Types.ObjectId) return v;
  if (mongoose.Types.ObjectId.isValid(v)) return new mongoose.Types.ObjectId(v.toString());
  return v;
}

const getSubjects = async (req, res) => {
  try {
    const filter = {};
    if (req.query.semester) filter.semester = Number(req.query.semester);
    if (req.query.department) filter.department = req.query.department;
    const subjects = await Subject.find(filter)
      .populate('department', 'name departmentId')
      .populate('assignedFaculty', 'name facultyId')
      .sort({ semester: 1, name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('department')
      .populate('assignedFaculty');
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { name, semester, department, periodsPerWeek, assignedFaculty, code, facultyRooms } = req.body;
    const doc = {
      name,
      semester: Number(semester),
      department: toObjectId(department) || department,
      periodsPerWeek: Number(periodsPerWeek),
      assignedFaculty: toObjectId(assignedFaculty) || (facultyRooms && facultyRooms[0] && facultyRooms[0].faculty ? toObjectId(facultyRooms[0].faculty) : null) || null
    };
    if (code && String(code).trim()) {
      doc.code = String(code).trim();
    } else {
      doc.code = 'SUB_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    }
    const subject = await Subject.create(doc);
    if (Array.isArray(facultyRooms) && facultyRooms.length > 0) {
      const toInsert = facultyRooms
        .filter((fr) => fr.faculty && fr.roomNumber && String(fr.roomNumber).trim())
        .map((fr, i) => ({
          subject: subject._id,
          faculty: fr.faculty,
          roomNumber: String(fr.roomNumber).trim(),
          order: i
        }));
      if (toInsert.length > 0) await SubjectFacultyRoom.insertMany(toInsert);
    }
    const populated = await Subject.findById(subject._id)
      .populate('department', 'name departmentId')
      .populate('assignedFaculty', 'name facultyId');
    res.status(201).json(populated || subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { name, semester, department, periodsPerWeek, assignedFaculty, facultyRooms } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (semester !== undefined) update.semester = Number(semester);
    if (department !== undefined) update.department = toObjectId(department) || department;
    if (periodsPerWeek !== undefined) update.periodsPerWeek = Number(periodsPerWeek);
    if (assignedFaculty !== undefined) update.assignedFaculty = assignedFaculty;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    )
      .populate('department', 'name departmentId')
      .populate('assignedFaculty', 'name facultyId');
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    if (Array.isArray(facultyRooms)) {
      await SubjectFacultyRoom.deleteMany({ subject: req.params.id });
      const toInsert = facultyRooms
        .filter((fr) => fr.faculty && fr.roomNumber && String(fr.roomNumber).trim())
        .map((fr, i) => ({
          subject: req.params.id,
          faculty: fr.faculty,
          roomNumber: String(fr.roomNumber).trim(),
          order: i
        }));
      if (toInsert.length > 0) {
        await SubjectFacultyRoom.insertMany(toInsert);
        await Subject.findByIdAndUpdate(req.params.id, { assignedFaculty: toInsert[0].faculty });
      }
    }
    const updated = await Subject.findById(req.params.id)
      .populate('department', 'name departmentId')
      .populate('assignedFaculty', 'name facultyId');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    await SubjectFacultyRoom.deleteMany({ subject: req.params.id });
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
};
