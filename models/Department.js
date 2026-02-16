const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  sectionsCount: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
