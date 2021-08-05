const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
require("events").EventEmitter.defaultMaxListeners = 0;
const mongoose = require("mongoose");
const Live_data = require("./modal/livedata");
const db = require("./config/db");

app.use(express.json());
app.post("/api/lvl_live", async (req, res) => {
  console.log(req.body);
  let result = JSON.stringify(req.body);
  let d = JSON.parse(result);
  const device_id = d.device_id;
  const level = d.L;
  const volume = d.V;
  const distance = d.D;
  const weight = d.W;
  const device_time = d.T;
  try {
    const live_data = await Live_data.create({
      device_id: device_id,
      level: level,
      volume: volume,
      distance: distance,
      weight: weight,
      device_time: device_time,
    });

    live_data;
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("API for LEVEL PROJECT, Server listening on Port", PORT);
});
