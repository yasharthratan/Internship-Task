const http = require("http");
const express = require("express");
const app = express();
const theRoute = require("./api/routes/routes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const server = http.createServer(app);

server.listen(3000, console.log("app is running"));

mongoose.connect(
  "mongodb://user1:ef54#!9a2@172.105.40.182:27017/?authSource=ultrasound&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.on("error", (err) => {
  console.log("connection failed");
});

mongoose.connection.on("connected", (connected) => {
  console.log("connection with the databse");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(theRoute);

app.use((req, res, next) => {
  res.status(200).json({
    error: "Bad request",
  });
});

module.exports = app;