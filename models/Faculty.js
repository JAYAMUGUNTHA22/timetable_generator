const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  facultyId: {
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
  homeDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  subjectsHandled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  maxPeriodsPerDay: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  maxPeriodsPerWeek: {
    type: Number,
    required: true,
    min: 1,
    max: 40
  }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
