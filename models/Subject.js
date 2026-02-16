const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  periodsPerWeek: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  assignedFaculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: false
  }
}, { timestamps: true });

subjectSchema.index({ code: 1 }, { unique: true, sparse: true });

subjectSchema.pre('save', function (next) {
  if (!this.code || String(this.code).trim() === '') {
    this.code = 'SUB_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
  }
  next();
});

module.exports = mongoose.model('Subject', subjectSchema);
