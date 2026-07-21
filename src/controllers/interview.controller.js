const { evaluateAnswer } = require("../services/gemini.service");
const Interview = require("../models/interview.model");
const Question = require("../models/question.model");

// Start Interview
const startInterview = async (req, res) => {
  try {
    const { difficulty } = req.body;

    // Frontend se "easy", "medium", "hard" aata hai
    // Database me "Easy", "Medium", "Hard" hai
    const formattedDifficulty =
      difficulty.charAt(0).toUpperCase() +
      difficulty.slice(1).toLowerCase();

    // Difficulty ke hisaab se questions lao
    const questions = await Question.aggregate([
  {
    $match: {
      difficulty: formattedDifficulty,
    },
  },
  {
    $sample: {
      size: 5,
    },
  },
]);

    // Agar questions nahi mile
    if (questions.length === 0) {
      return res.status(404).json({
        message: "No questions found for selected difficulty.",
      });
    }

    // Interview create karo
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
    const question = await Question.findById(questionId);

     const aiResult = await evaluateAnswer(
     question.question,
     answer,
     question.answer
       );

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }
     

interview.answers.push({
  questionId,
  answer,
  score: aiResult.score,
  feedback: aiResult.feedback,
});

// Calculate Overall Score
const totalScore = interview.answers.reduce(
  (sum, item) => sum + (item.score || 0),
  0
);

interview.score = Math.round(
  totalScore / interview.answers.length
);

// ⭐ Interview Complete Check
if (interview.answers.length === interview.questions.length) {
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
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};  const getInterviewHistory = async (req, res) => {
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
const getDashboardStats = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.id,
    });

    const totalInterviews = interviews.length;

    const completedInterviews = interviews.filter(
      (item) => item.status === "completed"
    ).length;

    const averageScore =
      totalInterviews > 0
        ? Math.round(
            interviews.reduce((sum, item) => sum + item.score, 0) /
              totalInterviews
          )
        : 0;

    const bestScore =
      totalInterviews > 0
        ? Math.max(...interviews.map((item) => item.score))
        : 0;

    res.status(200).json({
      totalInterviews,
      completedInterviews,
      averageScore,
      bestScore,
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
  getDashboardStats,
};