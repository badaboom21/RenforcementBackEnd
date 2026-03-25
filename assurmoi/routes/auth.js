const express = require("express");
const router = express.Router();

const {
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
} = require("../services/auth");

router.post("/login", login);
router.post("/logout", logout);
router.get("/profil", getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
