import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import {
  FaTrophy,
  FaCheckCircle,
  FaArrowLeft,
  FaRedo,
  FaChartLine,
  FaHome,
  FaStar,
  FaRegStar,
  FaCommentDots,
  FaCalendarAlt,
} from "react-icons/fa";

// Dynamic API Environment Variable Configured
const API_URL = import.meta.env.VITE_API_URL;

function InterviewReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/interview/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setInterview(response.data.interview);
    } catch (error) {
      console.log(error);
      setError("Failed to load interview report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="report-loading">
        <h2>Loading Report...</h2>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="report-loading">
        <h2>{error || "No Interview Report Found"}</h2>

        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-primary"
        >
          <FaHome /> Back to Dashboard
        </button>
      </div>
    );
  }

  const score = Number(interview.score || 0);

  const formattedStatus = interview.status
    ? interview.status.charAt(0).toUpperCase() +
      interview.status.slice(1).toLowerCase()
    : "N/A";

  const interviewDate = interview.createdAt
    ? new Date(interview.createdAt).toLocaleString()
    : "N/A";

  const getPerformanceBadge = (currentScore) => {
    if (currentScore >= 90)
      return {
        label: "Outstanding Performance",
        stars: 5,
        color: "#22c55e",
      };

    if (currentScore >= 80)
      return {
        label: "Excellent Performance",
        stars: 4,
        color: "#3b82f6",
      };

    if (currentScore >= 70)
      return {
        label: "Good Performance",
        stars: 3,
        color: "#eab308",
      };

    if (currentScore >= 60)
      return {
        label: "Average Performance",
        stars: 2,
        color: "#f97316",
      };

    return {
      label: "Needs Improvement",
      stars: 1,
      color: "#ef4444",
    };
  };

  const badge = getPerformanceBadge(score);

  const getRecommendation = () => {
    if (score >= 90)
      return "Excellent! You're interview ready. Keep practicing to maintain this level.";

    if (score >= 80)
      return "Very Good! A little more confidence and you'll perform even better.";

    if (score >= 70)
      return "Good work! Focus on communication and technical depth.";

    if (score >= 60)
      return "Practice more mock interviews and revise your core concepts.";

    return "Start with fundamentals and practice regularly. You'll improve quickly.";
  };

  return (
    <div className="report-page">
      {/* Top Navigation */}
      <div className="report-nav">
        <button onClick={() => navigate(-1)} className="btn-back">
          <FaArrowLeft /> Go Back
        </button>

        <div className="nav-actions">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-secondary"
          >
            <FaHome /> Dashboard
          </button>

          <button
            onClick={() => navigate("/interview")}
            className="btn btn-primary"
          >
            <FaRedo /> Retake Interview
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="report-header">
        <div className="header-left">
          <span className="resume-badge">AI Performance Report</span>
          <h1>Interview Completed</h1>
          <p>
            Below is your complete interview performance. Review every answer
            carefully and improve.
          </p>

          <div className="report-date">
            <FaCalendarAlt /> {interviewDate}
          </div>

          <div
            className="premium-badge-container"
            style={{ borderColor: badge.color }}
          >
            <div className="stars-row">
              {[...Array(5)].map((_, i) =>
                i < badge.stars ? (
                  <FaStar key={i} style={{ color: badge.color }} />
                ) : (
                  <FaRegStar key={i} style={{ color: "#cbd5e1" }} />
                )
              )}
            </div>
            <h4 style={{ color: badge.color }}>{badge.label}</h4>
          </div>
        </div>

        <div className="score-circle" style={{ borderColor: badge.color }}>
          <h2 style={{ color: badge.color }}>{score}%</h2>
          <span>Overall Score</span>
        </div>
      </div>

      {/* Recommendation */}
      <div className="recommendation-box">
        <h3>Your Performance Summary</h3>
        <p>{getRecommendation()}</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <FaCheckCircle className="icon-status" />
          <h3>Status</h3>
          <p className={`status ${formattedStatus.toLowerCase()}`}>
            {formattedStatus}
          </p>
        </div>

        <div className="summary-card">
          <FaTrophy className="icon-score" />
          <h3>Overall Score</h3>
          <p>{score}/100</p>
        </div>

        <div className="summary-card">
          <FaChartLine className="icon-questions" />
          <h3>Total Questions</h3>
          <p>{interview.answers?.length || 0}</p>
        </div>
      </div>

      <h2 className="section-title">Questions & Answers</h2>

      {!interview.answers?.length ? (
        <div className="no-questions-box">
          <h3>No Questions Found.</h3>
        </div>
      ) : (
        <div className="question-list">
          {(interview.answers || []).map((item, index) => (
            <div className="question-card" key={index}>
              <div className="question-header">
                <div className="question-number">{index + 1}</div>
                <h3>Question {index + 1}</h3>
              </div>

              <div className="qa-body">
                <p>
                  <strong>Question:</strong> {item.questionId?.question || "N/A"}
                </p>

                <p className="user-answer">
                  <strong>Your Answer:</strong> {item.answer || "No answer provided."}
                </p>

                {/* Standard reference key fixed */}
                {item.questionId?.answer && (
                  <div className="correct-answer-box">
                    <strong>Correct Answer</strong>
                    <p>{item.questionId.answer}</p>
                  </div>
                )}

                {/* FIXED: Changed item.rating to item.score to map Backend Schema */}
                {item.score !== undefined && item.score !== null && (
                  <div className="ai-rating-box">
                    <FaStar className="star-icon" />
                    <strong>AI Rating :</strong>
                    <span>{item.score}/100</span>
                  </div>
                )}

                {/* Dynamic AI Feedback Container */}
                {item.feedback?.trim() && (
                  <div className="ai-feedback-box">
                    <FaCommentDots className="feedback-icon" />
                    <strong>AI Feedback</strong>
                    <p>{item.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="report-footer">
        <p className="footer-tagline">Report Generated by AI Interview Platform</p>
      </div>
    </div>
  );
}

export default InterviewReport;
