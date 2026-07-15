const Interview = require("../models/interview.model");
const Question = require("../models/question.model");

// Start Interview
const startInterview = async (req, res) => {
  try {
    const questions = await Question.find().limit(5);

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
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Interview By ID
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("questions")
      .populate("answers.questionId");

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json({
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Submit Answer
const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionId, answer } = req.body;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    interview.answers.push({
      questionId,
      answer,
    });

    await interview.save();

    res.status(200).json({
      message: "Answer submitted successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.id,
    })
      .populate("questions")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Interview history fetched successfully",
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  startInterview,
  getInterviewById,
  submitAnswer,
  getInterviewHistory,
};