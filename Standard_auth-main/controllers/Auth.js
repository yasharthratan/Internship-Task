const Profile = require("../models/profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  genPasswordHash,
  validPassword,
  isMember,
  sendEmail,
  genAndSendOtp,
  validOtp,
} = require("../lib/authUtilis");
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;


const signup = async (req, res) => {
  try {
    let result = await Profile.insertMany({
      email: req.body.email,
      user: req.body.user,
    });

    let pwdHash = await genPasswordHash(req.body.pwd); // returns hashed password

    await Profile.findOneAndUpdate(
      { user: result[0].user },
      { '$set': { pwdHash: pwdHash } }
    );
    return res.status(200).send({ msg: "signup successful" });
  } catch (err) {
    let errMsg = err.writeErrors[0].err.errmsg;
    if (errMsg.includes("email")) {
      return res
        .status(500)
        .send({ msg: "There exists an account with the given email id" });
    } else if (errMsg.includes("user")) {
      return res.status(500).send({ msg: "username is already taken" });
    }

    return res.status(500).send({ msg: "Signup Unsuccesful" });
  }
};

const login = async (req, res) => {
  try {
    let data = await isMember(req.body.userId);

    if (!data)
      return res
        .status(500)
        .send({ msg: `no user with given userId ${req.body.userId}` });

    let valid = await validPassword(req.body.pwd, data.pwdHash);

    if (!valid) return res.status(500).send({msg : 'Wrong Password'});

    const accessToken = jwt.sign(
      {
        id: data._id,
      },
      JWT_AUTH_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    res
      .status(202)
      .cookie("accessToken", accessToken, {
        expires: new Date(new Date().getTime() + 86400 * 1000),
        sameSite: "strict",
        httpOnly: true,
      })

      .cookie("authSession", true, {
        expires: new Date(new Date().getTime() + 86400 * 1000),
        sameSite: "strict",
      })

      .send({
        msg: "Device verified",
      });
  } catch (err) {
    res.status(500).send("Some error occured. Please try again");
  }
};

const sendOtp = async (req, res) => {
  try {
    let data = await isMember(req.body.userId);

    if (!data)
      return res
        .status(500)
        .send({ msg: `no user with given userId ${req.body.userId}` });

    let otpHash = genAndSendOtp(data._id);
    await Profile.findByIdAndUpdate(
      { _id: data._id },
      { '$set': { otpHash: otpHash.hash } }
    );
    sendEmail(otpHash.otp, data.email);
    res.status(200).send({ msg: "Otp sent to the registered email id" });
  } catch (err) {
    console.log(`in sendOtp ${err}`);
    res.status(500).send("Some error occured. Please try again");
  }
};

const verifyOtpChangePassword = async (req, res) => {
  try {
    let data = await isMember(req.body.userId);

    if (!data)
      return res
        .status(500)
        .send({ msg: `no user with given userId ${req.body.userId}` });

    let result = await validOtp(data._id, req.body.otp);

    if (result == null) {
      return res.status(504).send({
        msg: "OTP expired. Please try again",
      });
    } else if (!result) {
      return res.status(400).send({
        verification: false,
        msg: "Incorrect OTP",
      });
    }

    let pwdHash = await genPasswordHash(req.body.pwd);

    await Profile.findOneAndUpdate(
      { _id: data._id },
      { '$set': { pwdHash: pwdHash } }
    );
    await Profile.findOneAndUpdate(
      { _id: data._id },
      { '$unset': { otpHash: 1 } }
    );
    return res.status(200).send({ msg: "password changed successfully" });
  } catch (err) {
    console.log(`in verifyOtpChangePassword ${err}`);
    res.status(500).send("Some error occured. Please try again");
  }
};

const authenticateUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  jwt.verify(accessToken, JWT_AUTH_TOKEN, async (err, data) => {
    if (data) {
      req.id = data.id;

      next();
    } else if (err.message === "TokenExpiredError") {
      return res
        .status(403)
        .send({ success: false, msg: "Access Token Expired" });
    } else {
      res.status(403).send({ err, msg: "User Not Authenticated" });
    }
  });
};

const logout = (_, res) => {
  res.clearCookie("accessToken").clearCookie("authSession");

  res.json({
    message: "User signed out successfully",
  });
};

module.exports = {
  signup,
  login,
  logout,
  sendOtp,
  verifyOtpChangePassword,
  authenticateUser,
};
