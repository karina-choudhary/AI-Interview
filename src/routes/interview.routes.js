const express = require("express");
const router = express.Router();

const authMiddleware = require("../config/middlware/auth.middleware");

const {
  startInterview,
  getInterviewById,
  submitAnswer,
  getInterviewHistory
} = require("../controllers/interview.controller");

router.post("/start", authMiddleware, startInterview);
router.get("/history", authMiddleware, getInterviewHistory);
router.get("/:id", authMiddleware, getInterviewById);
router.post("/:id/submit", authMiddleware, submitAnswer);


module.exports = router;