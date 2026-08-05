const { evaluateAnswer } = require("../services/gemini.service");
const Interview = require("../models/interview.model");
const Question = require("../models/question.model");
const asyncWrapper = require("../utils/asyncWrapper");

// ==========================
// Start Interview
// ==========================
const startInterview = asyncWrapper(async (req, res) => {
  const { difficulty } = req.body;

  if (!difficulty) {
    return res.status(400).json({ message: "Difficulty is required." });
  }

  const formattedDifficulty =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

  const questions = await Question.aggregate([
    { $match: { difficulty: formattedDifficulty } },
    { $sample: { size: 5 } },
  ]);

  if (questions.length === 0) {
    return res.status(404).json({ message: "No questions found" });
  }

  const interview = await Interview.create({
    user: req.user.id,
    questions: questions.map((q) => q._id),
    answers: [],
    score: 0,
    status: "started",
  });

  res.status(201).json({
    message: "Interview started successfully",
    interview,
  });
});

// ==========================
// Get Interview
// ==========================
const getInterviewById = asyncWrapper(async (req, res) => {
  const interview = await Interview.findById(req.params.id)
    .populate("questions")
    .populate("answers.questionId");

  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  res.status(200).json({ interview });
});

// ==========================
// Submit Answer
// ==========================
const submitAnswer = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { questionId, answer } = req.body;

  // 1. Check Empty Answer
  if (!answer || !answer.trim()) {
    return res.status(400).json({
      message: "Answer text cannot be blank.",
    });
  }

  const interview = await Interview.findById(id);
  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  // 2. Already completed check
  if (interview.status === "completed") {
    return res.status(400).json({
      message: "Interview is already completed and submitted.",
    });
  }

  // Validate question belongs to this interview
  const validQuestion = interview.questions.some(
    (item) => item.toString() === questionId
  );
  if (!validQuestion) {
    return res.status(400).json({ message: "Invalid Question" });
  }

  const question = await Question.findById(questionId);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  // Call Gemini Service
  const aiResult = await evaluateAnswer(
    question.question,
    answer,
    question.answer
  );

  // FIXED: Overwrite or update existing answer entry to prevent 400 Bad Request
  const existingAnswerIndex = interview.answers.findIndex(
    (item) => item.questionId.toString() === questionId
  );

  if (existingAnswerIndex !== -1) {
    interview.answers[existingAnswerIndex] = {
      questionId,
      answer,
      score: aiResult.score || 0,
      feedback: aiResult.feedback || "No feedback provided",
    };
  } else {
    interview.answers.push({
      questionId,
      answer,
      score: aiResult.score || 0,
      feedback: aiResult.feedback || "No feedback provided",
    });
  }

  // Calculate Running Average Score
  const totalScore = interview.answers.reduce(
    (sum, item) => sum + (item.score || 0),
    0
  );
  interview.score = Math.round(totalScore / interview.answers.length);

  // Auto-complete status check
  if (interview.answers.length >= interview.questions.length) {
    interview.status = "completed";
  }

  await interview.save();

  res.status(200).json({
    message:
      interview.status === "completed"
        ? "Interview completed successfully"
        : "Answer submitted successfully",
    interview,
  });
});

// ==========================
// Interview History
// ==========================
const getInterviewHistory = asyncWrapper(async (req, res) => {
  const interviews = await Interview.find({ user: req.user.id })
    .populate("questions")
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "Interview history fetched successfully",
    interviews,
  });
});

// ==========================
// Dashboard Stats
// ==========================
const getDashboardStats = asyncWrapper(async (req, res) => {
  const interviews = await Interview.find({ user: req.user.id });
  const totalInterviews = interviews.length;

  if (totalInterviews === 0) {
    return res.status(200).json({
      totalInterviews: 0,
      completedInterviews: 0,
      averageScore: 0,
      bestScore: 0,
    });
  }

  const completedInterviews = interviews.filter(
    (item) => item.status === "completed"
  ).length;

  const averageScore = Math.round(
    interviews.reduce((sum, item) => sum + (item.score || 0), 0) / totalInterviews
  );

  // Fixed the spread operator crash bug for new profiles with empty arrays
  const bestScore = Math.max(...interviews.map((item) => item.score || 0));

  res.status(200).json({
    totalInterviews,
    completedInterviews,
    averageScore,
    bestScore,
  });
});

module.exports = {
  startInterview,
  getInterviewById,
  submitAnswer,
  getInterviewHistory,
  getDashboardStats,
};
