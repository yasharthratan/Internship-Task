require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const GMAIL = process.env.GMAIL;
const PASSWORD = process.env.PASSWORD;
const smsKey = process.env.OTP_KEY;
const Profile = require("../models/profile");

// checks for the validity of the email
function isEmail(userId) {
  if (userId.includes("@")) return true;
  return false;
}

// generates password hash
const genPasswordHash = async (password) => {
  var pwdHash = crypto
    .pbkdf2Sync(password, AUTH_TOKEN, 10000, 64, "sha512")
    .toString("hex");

  return pwdHash;
};

// checks whether the password is correct
const validPassword = async (password, hash) => {
  var hashVerify = crypto
    .pbkdf2Sync(password, AUTH_TOKEN, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
};

// checks the validity of the otp i.e whether the password has expired and whether the otp is correct
const validOtp = async (id, otp) => {
  try {
    let hash = await Profile.findById({ '_id': id }, { otpHash: 1, '_id': 0 });
    console.log(`in valid OTP ${hash.otpHash}`);
    let [hashValue, expires] = hash.otpHash.split(".");

    let now = Date.now();

    if (now > parseInt(expires)) return null;
    const data = `${id}.${otp}.${expires}`;
    const newCalculatedHash = crypto
      .createHmac("sha256", smsKey)
      .update(data)
      .digest("hex");

    if (newCalculatedHash === hashValue) return true;
    return false;
  } catch (err) {
    throw err;
  }
};

// checks whether there is an account with the giver userId 
// and returns the id of the document
// otherwise returns null
const isMember = async (userId) => {
  try {
    if (isEmail(userId)) {
      data = await Profile.findOne({ email: userId });
    } else {
      data = await Profile.findOne({ user: userId });
    }

    if (data) return data;
    return false;
  } catch (err) {
    throw err;
  }
};

// otp generating function.
// returns the hash of the otp
function genAndSendOtp(id) {
  const otp = Math.floor(100000 + Math.random() * 900000); // generating otp
  const ttl = 5 * 60 * 1000;
  const expires = Date.now() + ttl; // expiry time
  const data = `${id}.${otp}.${expires}`;
  const hash = crypto.createHmac("sha256", smsKey).update(data).digest("hex");
  const fullhash = `${hash}.${expires}`;
  return {
    otp: otp,
    hash: fullhash,
  };
}


// sends the otp to the registered email
const sendEmail = async (otp, mail) => {
  console.log(`Gmail is ${GMAIL}`);
  console.log(`Password is ${PASSWORD}`);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL,
      pass: PASSWORD,
    },
  });

  var mailOptions = {
    from: GMAIL,
    to: mail,
    subject: "password change OTP",
    text: `The otp for the password change is ${otp}. The otp expires in 5 minutes`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(`in sendEmail ${error}`);
      throw error;
    }
  });
};

module.exports = {
  genPasswordHash,
  validPassword,
  isMember,
  sendEmail,
  genAndSendOtp,
  validOtp
};
