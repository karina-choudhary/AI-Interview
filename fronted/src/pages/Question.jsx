  import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaArrowRight,
  FaPaperPlane,
  FaClock,
} from "react-icons/fa";



function Question() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(600);

  // Fetch Interview
  const fetchInterview = async () => {
    try {
      const response = await axios.get(
        `https://ai-interview-a2kn.onrender.com/api/interview/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setQuestions(response.data.interview.questions || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterview();
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (loading) return;

    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  // Format Timer
  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;

    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Progress %
  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  // Character Count
  const characterCount = answer.length;

  // Submit Answer
  const submitAnswer = async () => {
    try {
      await axios.post(
        `https://ai-interview-a2kn.onrender.com/api/interview/${id}/submit`,
        {
          questionId: questions[currentQuestion]._id,
          answer,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Answer Submitted");
    } catch (error) {
      console.log(error);
    }
  };

  // Next Question
  const handleNext = async () => {
    if (!answer.trim()) {
      alert("Please enter your answer.");
      return;
    }

    await submitAnswer();

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setAnswer("");
    }
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    if (!answer.trim()) {
      alert("Please enter your answer.");
      return;
    }

    await submitAnswer();

    alert("Interview Completed Successfully!");

    navigate(`/feedback/${id}`);
  };

  if (loading) {
    return (
      <div className="question-loading">
        <h2>Loading Interview...</h2>
      </div>
    );
  }
  return (
    <div className="question-page">

      {/* Header */}

      <div className="question-header">

        <div>

          <h1>
            <FaRobot /> AI Mock Interview
          </h1>

          <p>
            Answer every question carefully.
          </p>

        </div>

        <div className="timer-box">

          <FaClock />

          <span>{formatTime()}</span>

        </div>

      </div>

      {/* Progress */}

      <div className="progress-section">

        <div className="progress-text">

          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>

          <span>
            {Math.round(progress)}%
          </span>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

      </div>

      {/* Question Card */}

      <div className="question-card">

        <h2>

          {questions[currentQuestion]?.question}

        </h2>

        <textarea

          value={answer}

          onChange={(e) =>
            setAnswer(e.target.value)
          }

          placeholder="Write your answer here..."

          rows="8"

        />

        <div className="character-counter">

          {characterCount} Characters

        </div>

      </div>

      {/* Buttons */}

      <div className="question-actions">

        {currentQuestion === questions.length - 1 ? (

          <button
            className="submit-btn"
            onClick={handleFinalSubmit}
          >

            <FaPaperPlane />

            Submit Interview

          </button>

        ) : (

          <button
            className="next-btn"
            onClick={handleNext}
          >

            Next Question

            <FaArrowRight />

          </button>

        )}

      </div>

    </div>
  );
}

export default Question;