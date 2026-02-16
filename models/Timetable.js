const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  subjectName: String,
  facultyName: String,
  roomNumber: String
}, { _id: false });

const timetableSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  sectionNumber: {
    type: Number,
    required: true,
    min: 1
  },
  semester: {
    type: Number,
    required: true
  },
  workingDays: [String],
  periodsPerDay: Number,
  slots: [[slotSchema]],
  generationErrors: [String],
  generatedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

timetableSchema.index({ department: 1, sectionNumber: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);
