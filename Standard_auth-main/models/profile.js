const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type : String,
    unique : true
  },
  email: {
    type : String,
    unique : true
  },
  pwdHash : String,
  otpHash : String
});

module.exports = mongoose.model("Profile", profileSchema);