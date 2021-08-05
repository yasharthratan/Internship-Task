const mongoose = require("mongoose");

const live_data = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  device_time: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("live_data", live_data);
