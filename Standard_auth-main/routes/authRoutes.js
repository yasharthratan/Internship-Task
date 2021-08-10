const express = require("express");
const router = express.Router();
const { signup, login, logout, sendOtp,verifyOtpChangePassword} = require("../controllers/Auth");

router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);
router.post("/getOtp", sendOtp);
router.put("/verifyOtpChangePassword", verifyOtpChangePassword);

module.exports = router;