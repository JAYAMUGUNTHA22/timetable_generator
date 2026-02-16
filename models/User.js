const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true
  },
  passwordHash: {
    type: String
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'faculty', 'student']
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  sectionNumber: {
    type: Number
  }
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);

