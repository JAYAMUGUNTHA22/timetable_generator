const Department = require('../models/Department');

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ departmentId: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ error: 'Department not found' });
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { departmentId, name, sectionsCount } = req.body;
    const department = await Department.create({ departmentId, name, sectionsCount });
    res.status(201).json(department);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!department) return res.status(404).json({ error: 'Department not found' });
    res.json(department);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ error: 'Department not found' });
    res.json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
