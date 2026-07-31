const { evaluateAnswer } = require("../services/gemini.service");
const Interview = require("../models/interview.model");
const Question = require("../models/question.model");
const asyncWrapper = require("../utils/asyncWrapper");

// Start Interview
const startInterview = asyncWrapper(async (req, res) => {
    const { difficulty } = req.body;

    if (!difficulty) {
        return res.status(400).json({ message: "Difficulty is required." });
    }

    // Format: "easy" -> "Easy"
    const formattedDifficulty =
        difficulty.charAt(0).toUpperCase() +
        difficulty.slice(1).toLowerCase();

    // Fetch 5 random questions based on difficulty
    const questions = await Question.aggregate([
        { $match: { difficulty: formattedDifficulty } },
        { $sample: { size: 5 } },
    ]);

    if (questions.length === 0) {
        return res.status(404).json({
            message: "No questions found for the selected difficulty.",
        });
    }

    // Create Interview Document
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

// Get Interview By ID
const getInterviewById = asyncWrapper(async (req, res) => {
    const interview = await Interview.findById(req.params.id)
        .populate("questions")
        .populate("answers.questionId");

    if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json({ interview });
});

// Submit Answer
const submitAnswer = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { questionId, answer } = req.body;

    const interview = await Interview.findById(id);
    if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }

    // AI Evaluation Service
    const aiResult = await evaluateAnswer(
        question.question,
        answer,
        question.answer
    );

    // Push new answer mapping
    interview.answers.push({
        questionId,
        answer,
        score: aiResult.score,
        feedback: aiResult.feedback,
    });

    // Calculate Overall Dynamic Score
    const totalScore = interview.answers.reduce(
        (sum, item) => sum + (item.score || 0),
        0
    );

    interview.score = Math.round(totalScore / interview.answers.length);

    // Check Completion Status
    if (interview.answers.length === interview.questions.length) {
        interview.status = "completed";
    }

    await interview.save();

    res.status(200).json({
        message: interview.status === "completed"
            ? "Interview completed successfully"
            : "Answer submitted successfully",
        interview,
    });
});

// Get Interview History
const getInterviewHistory = asyncWrapper(async (req, res) => {
    const interviews = await Interview.find({ user: req.user.id })
        .populate("questions")
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: "Interview history fetched successfully",
        interviews,
    });
});

// Get Dashboard Stats
const getDashboardStats = asyncWrapper(async (req, res) => {
    const interviews = await Interview.find({ user: req.user.id });

    const totalInterviews = interviews.length;

    const completedInterviews = interviews.filter(
        (item) => item.status === "completed"
    ).length;

    const averageScore = totalInterviews > 0
        ? Math.round(interviews.reduce((sum, item) => sum + (item.score || 0), 0) / totalInterviews)
        : 0;

    const bestScore = totalInterviews > 0
        ? Math.max(...interviews.map((item) => item.score || 0))
        : 0;

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
