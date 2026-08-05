import React, { useEffect, useState } from "react"; 
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import { FaBrain, FaFileAlt, FaBriefcase, FaGraduationCap, FaRocket } from "react-icons/fa"; 

// Environment variable se API base URL read ho raha hai
const API_URL = import.meta.env.VITE_API_URL;

export default function Interview() { 
  const navigate = useNavigate(); 
  
  const [resumeId, setResumeId] = useState(""); 
  const [experience, setExperience] = useState(""); 
  const [difficulty, setDifficulty] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [resumes, setResumes] = useState([]); 
  const [message, setMessage] = useState(""); 

  // ========================== //
  // FETCH RESUMES              //
  // ========================== //
  const fetchResumes = async () => { 
    try { 
      setLoading(true); 
      const response = await axios.get(
        `${API_URL}/api/resume`, 
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          } 
        }
      ); 
      setResumes(response.data.resumes || []); 
      setMessage(""); 
    } catch (error) { 
      console.log(error); 
      setMessage("Please upload your resume first."); 
    } finally { 
      setLoading(false); 
    } 
  }; 

  useEffect(() => { 
    fetchResumes(); 
  }, []); 

  // ========================== //
  // START INTERVIEW            //
  // ========================== //
  const handleStart = async () => { 
    if (!resumeId || !experience || !difficulty) { 
      setMessage("Please fill all fields."); 
      return; 
    } 
    try { 
      setLoading(true); 
      const response = await axios.post(
        `${API_URL}/api/interview/start`, 
        { 
          resumeId, 
          experience, 
          difficulty 
        }, 
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          } 
        }
      ); 
      navigate(`/question/${response.data.interview._id}`); 
    } catch (error) { 
      console.log(error); 
      setMessage(error.response?.data?.message || "Something went wrong."); 
    } finally { 
      setLoading(false); 
    } 
  }; 

  return ( 
    <div className="interview-page"> 
      {/* ================= HERO ================= */} 
      <div className="interview-header"> 
        <div> 
          <span className="resume-badge"> AI Interview </span> 
          <h1>Let's Start Your <span> Mock Interview</span> </h1> 
          <p> Choose your resume, experience level and difficulty. Our AI will generate questions based on your profile. </p> 
        </div> 
        <div className="hero-icon"> 
          <FaBrain size={120}/> 
        </div> 
      </div> 

      {message && <div className="interview-message"> {message} </div>} 

      {/* ================= FORM ================= */} 
      <div className="interview-form"> 
        <div className="form-group"> 
          <label> <FaFileAlt/> Select Resume </label> 
          <select value={resumeId} onChange={(e) => setResumeId(e.target.value)}> 
            <option value=""> Choose Resume </option> 
            {resumes.map((resume) => ( 
              <option key={resume._id} value={resume._id}> 
                {resume.filename} 
              </option> 
            ))} 
          </select> 
        </div> 

        <div className="form-group"> 
          <label> <FaBriefcase/> Experience </label> 
          <select value={experience} onChange={(e) => setExperience(e.target.value)}> 
            <option value=""> Select Experience </option> 
            <option value="fresher"> Fresher </option> 
            <option value="experienced"> Experienced </option> 
          </select> 
        </div> 

        <div className="form-group"> 
          <label> <FaGraduationCap/> Difficulty </label> 
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}> 
            <option value=""> Select Difficulty </option> 
            <option value="easy"> Easy </option> 
            <option value="medium"> Medium </option> 
            <option value="hard"> Hard </option> 
          </select> 
        </div> 

        <div className="interview-actions"> 
          <button className="start-btn" onClick={handleStart} disabled={loading}> 
            <FaRocket/> {loading ? "Preparing Interview..." : "Start AI Interview"} 
          </button> 
        </div> 
      </div> 

      {/* ================= INFO SECTION ================= */} 
      <div className="interview-info"> 
        <div className="info-card"> 
          <div className="info-icon"> 📝 </div> 
          <h3> Resume Based Questions </h3> 
          <p>Questions are generated from your uploaded resume. </p> 
        </div> 
        <div className="info-card"> 
          <div className="info-icon">🧠</div> 
          <h3>AI Evaluation</h3> 
          <p> Receive intelligent feedback after completing the interview. </p> 
        </div> 
        <div className="info-card"> 
          <div className="info-icon">🚀</div> 
          <h3> Boost Confidence </h3> 
          <p> Practice multiple times and improve your interview skills. </p> 
        </div> 
      </div> 

      {/* ================= TIPS ================= */} 
      <div className="tips-section"> 
        <h2>Interview Tips</h2> 
        <div className="tips-grid"> 
          <div className="tip-card"> ✅ Read every question carefully. </div> 
          <div className="tip-card"> ✅ Speak confidently during practice. </div> 
          <div className="tip-card"> ✅ Keep your resume updated. </div> 
          <div className="tip-card"> ✅ Don't rush. Think before answering. </div> 
        </div> 
      </div> 

      {/* ================= FOOTER ================= */} 
      <div className="mini-footer"> 
        <p> Good preparation builds confidence. Practice consistently with AI Interview Platform. </p> 
      </div> 
    </div> 
  ); 
}
