const express = require("express");
const router = express.Router();

const { getProfile } = require("../controllers/user.controller");
const authMiddleware = require("../config/middlware/auth.middleware");
const { updateProfile } = require("../controllers/user.controller");

// Sab routes protected rahenge
router.use(authMiddleware);
router.put("/profile", updateProfile);

// GET Profile
router.get("/profile", getProfile);

module.exports = router;