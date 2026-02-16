const Faculty = require('../models/Faculty');

const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate('homeDepartment', 'name departmentId')
      .populate('subjectsHandled', 'name semester')
      .sort({ facultyId: 1 });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('homeDepartment')
      .populate('subjectsHandled');
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createFaculty = async (req, res) => {
  try {
    const { facultyId, name, homeDepartment, subjectsHandled, maxPeriodsPerDay, maxPeriodsPerWeek } = req.body;
    const faculty = await Faculty.create({
      facultyId,
      name,
      homeDepartment,
      subjectsHandled: subjectsHandled || [],
      maxPeriodsPerDay: Number(maxPeriodsPerDay) || 6,
      maxPeriodsPerWeek: Number(maxPeriodsPerWeek) || 30
    });
    const populated = await Faculty.findById(faculty._id)
      .populate('homeDepartment', 'name departmentId')
      .populate('subjectsHandled', 'name semester');
    res.status(201).json(populated || faculty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('homeDepartment', 'name departmentId')
      .populate('subjectsHandled', 'name semester');
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty
};
