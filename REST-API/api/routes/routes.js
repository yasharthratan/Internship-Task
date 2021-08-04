const express = require("express");

const router = express.Router();

const livedatass = require("../model/livedata");

const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  res.status(200).json({
    msg: "This is a get request",
  });
});

router.post("/livedata", (req, res, next) => {
  const livedata = new livedatass({
    deviceId: req.body.deviceId,
    level: req.body.level,
    volume: req.body.volume,
    distance: req.body.distance,
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
