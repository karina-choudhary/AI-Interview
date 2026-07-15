const express = require("express");
const router = express.Router();

const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/question.controller");

// Create Question
router.post("/", createQuestion);



// Get All Questions
router.get("/", getAllQuestions);

// Get Single Question
router.get("/:id", getQuestionById);
router.get("/:id", getQuestionById);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;