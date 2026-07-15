const express = require("express");
const router = express.Router();
const authMiddleware = require("../config/middlware/auth.middleware");


const authcontroller = require("../controllers/auth.controller");

router.post("/register", authcontroller.register);
router.post("/login", authcontroller.login);
router.get("/profile", authMiddleware, authcontroller.profile);

module.exports = router;
