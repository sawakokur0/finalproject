const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Yoga Morning"
  trainer: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // minutes
  capacity: { type: Number, default: 20 },
  enrolled: { type: Number, default: 0 }, // Current bookings count
  description: String
});

module.exports = mongoose.model("Class", ClassSchema);