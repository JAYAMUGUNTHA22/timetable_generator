const mongoose = require('mongoose');

const academicConfigSchema = new mongoose.Schema({
  workingDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  periodsPerDay: {
    type: Number,
    default: 7,
    min: 1,
    max: 12
  },
  breakPeriodIndices: {
    type: [Number],
    default: []
  },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AcademicConfig', academicConfigSchema);
