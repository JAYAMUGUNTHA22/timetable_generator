const mongoose = require('mongoose');

const subjectFacultyRoomSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

subjectFacultyRoomSchema.index({ subject: 1, order: 1 });

module.exports = mongoose.model('SubjectFacultyRoom', subjectFacultyRoomSchema);
