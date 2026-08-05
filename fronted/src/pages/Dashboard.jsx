import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlay,
  FaUser,
  FaRobot,
  FaArrowRight,
  FaFileAlt,
  FaUserTie,
  FaChartLine,
  FaBrain,
  FaClipboardCheck
} from "react-icons/fa";

// Dynamic API Environment Variable Configured
const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    bestScore: 0,
  });

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Dashboard Token:", token);
      
      // FIXED: Changed static render link to dynamic API_URL
      const response = await axios.get(
        `${API_URL}/api/interview/dashboard-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="dashboard">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-left">
          <span className="badge">🤖 AI Powered Interview Platform</span>

          <h1>
            Ace Your
            <br />
            <span>Next Interview</span>
          </h1>

          <p>
            Practice resume-based mock interviews, improve your confidence and
            receive AI-powered evaluation to prepare for your dream job.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/interview")}
            >
              <FaPlay /> Start Interview
            </button>

            <button
              className="btn-outline"
              onClick={() => navigate("/profile")}
            >
              <FaUser /> My Profile
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="ai-circle">
            <FaRobot size={90} />
          </div>
        </div>
      </section>

      {/* ================= STATS SUMMARY ================= */}
      <h2 className="section-title">Your Performance Stats</h2>
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Interviews</h3>
          <p>{stats.totalInterviews}</p>
        </div>

        <div className="summary-card">
          <h3>Completed</h3>
          <p>{stats.completedInterviews}</p>
        </div>

        <div className="summary-card">
          <h3>Average Score</h3>
          <p>{stats.averageScore}%</p>
        </div>

        <div className="summary-card">
          <h3>Best Score</h3>
          <p>{stats.bestScore}%</p>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <h2 className="section-title">Platform Features</h2>
      <section className="cards">
        <div className="card" onClick={() => navigate("/interview")}>
          <FaRobot />
          <h3>AI Interview</h3>
          <p>
            Practice realistic interview questions generated according to your
            profile.
          </p>
          <span>
            Start Now <FaArrowRight />
          </span>
        </div>

        <div className="card" onClick={() => navigate("/resume")}>
          <FaFileAlt />
          <h3>Resume Manager</h3>
          <p>
            Upload and manage your professional resume for interview preparation.
          </p>
          <span>
            Open Resume <FaArrowRight />
          </span>
        </div>

        <div className="card" onClick={() => navigate("/profile")}>
          <FaUserTie />
          <h3>Profile</h3>
          <p>
            Keep your personal information and interview preferences updated.
          </p>
          <span>
            Manage <FaArrowRight />
          </span>
        </div>

        <div className="card" onClick={() => navigate("/interview-history")}>
          <FaChartLine />
          <h3>Interview History</h3>
          <p>
            Review your interview reports, strengths and improvement areas.
          </p>
          <span>
            View Report <FaArrowRight />
          </span>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <h2 className="section-title">How It Works</h2>
      <section className="workflow">
        <div className="step">
          <FaFileAlt />
          <h4>Upload Resume</h4>
        </div>

        <div className="line"></div>

        <div className="step">
          <FaBrain />
          <h4>AI Interview</h4>
        </div>

        <div className="line"></div>

        <div className="step">
          <FaClipboardCheck />
          <h4>Answer Questions</h4>
        </div>

        <div className="line"></div>

        <div className="step">
          <FaChartLine />
          <h4>AI Report</h4>
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <h2 className="section-title">Why Choose Us</h2>
      <section className="benefits">
        <div className="benefit-card">✔ AI Generated Questions</div>
        <div className="benefit-card">✔ Resume Based Interviews</div>
        <div className="benefit-card">✔ Smart Performance Analysis</div>
        <div className="benefit-card">✔ Improve Interview Confidence</div>
      </section>
    </div>
  );
}

export default Dashboard;
