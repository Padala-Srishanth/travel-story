const mongoose = require('mongoose');

const travelStorySchema = new mongoose.Schema({
  title: String,
  story: String,
  visitedLocation: [String], // ✅ Now supports array of locations
  isFavorite: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: String,
  visitedDate: Date
});

module.exports = mongoose.model('TravelStory', travelStorySchema);
