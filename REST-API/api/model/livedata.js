const mongoose = require("mongoose");

const live_data = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("livedatass", live_data);
