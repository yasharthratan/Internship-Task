const express = require("express");

const router = express.Router();

const LIVEDATA = require("../model/livedata");

const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  res.status(200).json({
    msg: "This is student get request",
  });
});

router.post("/", (req, res, next) => {
  const livedata = new LIVEDATA({
    _id: new mongoose.Types.ObjectId(),
    deviceId: req.body._id,
    level: req.body.level,
    volume: req.body.volume,
    distance: req.body.distance,
    insert_time: req.body.insert_time,
    weight: req.body.weight,
  });
  livedata
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        newproperty: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
