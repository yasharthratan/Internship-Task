require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const crypto = require('crypto');
const app = express();
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8000;
// console.log(crypto.randomBytes(32).toString("hex"))

if (process.env.NODE_ENV == "production") {
  db = process.env.MONGOURL;
} else {
  db = process.env.DATABASE;
}

//routes
const authRoutes = require("./routes/authRoutes");

//connecting to the server
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connection is successful");
  })
  .catch((err) => console.log("Connection is unsuccessful"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Static Files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/img", express.static(__dirname + "public/img"));
app.use("/js", express.static(__dirname + "public/js"));

//Set Views
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// routes
app.use("", authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
