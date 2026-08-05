import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaRobot, FaArrowRight, FaPaperPlane, FaClock } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function Question() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600);

  const fetchInterview = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/interview/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const characterCount = answer.length;

  const submitAnswer = async () => {
    try {
      await axios.post(
        `${API_URL}/api/interview/${id}/submit`,
        {
          questionId: questions[currentQuestion]?._id,
          answer: answer.trim(),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.log(error);
      throw error; // UI execution rokne ke liye error throw kiya
    }
  };

  const handleNext = async () => {
    if (!answer || !answer.trim()) {
      alert("Please enter your answer before proceeding.");
      return;
    }

    try {
      await submitAnswer();
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setAnswer(""); // Purely blank string se state reset
      }
    } catch (e) {
      alert("Failed to save answer. Try again.");
    }
  };

  const handleFinalSubmit = async () => {
    if (!answer || !answer.trim()) {
      alert("Please enter your answer before submitting.");
      return;
    }

    try {
      await submitAnswer();
      alert("Interview Completed Successfully!");
      navigate(`/feedback/${id}`);
    } catch (e) {
      alert("Failed to complete interview. Try again.");
    }
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
      <div className="question-header">
        <div>
          <h1><FaRobot /> AI Mock Interview</h1>
          <p>Answer every question carefully.</p>
        </div>
        <div className="timer-box">
          <FaClock />
          <span>{formatTime()}</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-text">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="question-card">
        <h2>{questions[currentQuestion]?.question}</h2>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here..."
          rows={8}
        />
        <div className="character-counter">{characterCount} Characters</div>
      </div>

      <div className="question-actions">
        {currentQuestion === questions.length - 1 ? (
          <button className="submit-btn" onClick={handleFinalSubmit}>
            <FaPaperPlane /> Submit Interview
          </button>
        ) : (
          <button className="next-btn" onClick={handleNext}>
            Next Question <FaArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}

export default Question;
