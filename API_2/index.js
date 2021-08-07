const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
require("events").EventEmitter.defaultMaxListeners = 0;
const mongoose = require("mongoose");
const Live_data = require("./modal/livedata");
const db = require("./config/db");

app.use(express.json());

//Get data using the parameter device_id

app.get("/api/lvl_live/:device_id", async (req, res) => {
  try {
    const Device_id = req.params.device_id;
    const dataentry = await Live_data.find({ device_id: Device_id }).exec();
    console.log(dataentry);

    if (!dataentry) {
      return res.status(404).send();
    } else {
      res.send(dataentry);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("API for the PROJECT, Server is set up on the Port", PORT);
});
