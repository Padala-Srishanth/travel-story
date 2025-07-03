const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: true // You can leave this out if you never used select: false
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
