const mongoose = require("mongoose");

const live_data = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  deviceId: {
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
  insert_time: {
    timestamps: true,
  },
});

module.exports = mongoose.model("LIVEDATA", live_data);
