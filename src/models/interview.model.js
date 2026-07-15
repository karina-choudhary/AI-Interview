mongoose = require("mongoose");
const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        answer: String,
      },
    ],

    score: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["started", "completed"],
      default: "started",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Interview", interviewSchema);