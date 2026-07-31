import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaUpload,
  FaEye,
  FaTrash,
} from "react-icons/fa";


export default function Resume() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  // File Select
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setMessage("");
    }
  };

  // Get All Resume
  const fetchResumes = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "https://ai-interview-a2kn.onrender.com/api/resume",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setResumes(response.data.resumes || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Upload Resume
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please Select Resume");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const response = await axios.post(
        "https://ai-interview-a2kn.onrender.com/api/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage("Resume Uploaded Successfully");

        setSelectedFile(null);
        document.getElementById("resume-input").value = "";

        fetchResumes();
      }
    } catch (error) {
      console.log(error);
      setMessage("Upload Failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Resume
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`https://ai-interview-a2kn.onrender.com/api/resume/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessage("Resume Deleted Successfully");

      fetchResumes();
    } catch (error) {
      console.log(error);
      setMessage("Delete Failed");
    }
  };

 return (
  <div className="resume-page">

    {/* Hero */}

    <section className="resume-hero">

      <div>

        <span className="resume-badge">
          Resume Manager
        </span>

        <h1>Upload Your Resume</h1>

        <p>
          Keep your resume updated for AI powered
          interview practice.
        </p>

      </div>

    </section>

    {/* Upload Card */}

    <section className="upload-card">

      <div className="upload-icon">
        <FaCloudUploadAlt />
      </div>

      <h2>Choose Resume</h2>

      <p>
        PDF, DOC or DOCX
      </p>

      <input
        id="resume-input"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      {selectedFile && (

        <div className="selected-file">

          <FaFilePdf />

          <span>{selectedFile.name}</span>

        </div>

      )}

      <button

        className="upload-btn"

        onClick={handleUpload}

        disabled={!selectedFile || isUploading}

      >

        <FaUpload />

        {isUploading
          ? "Uploading..."
          : "Upload Resume"}

      </button>

      {message && (

        <p className="upload-message">

          {message}

        </p>

      )}

    </section>

    {/* Resume List */}

    <section className="resume-list">

      <h2>My Resume</h2>

      {loading ? (

        <p>Loading...</p>

      ) : resumes.length === 0 ? (

        <div className="empty-box">

          <FaFilePdf size={50} />

          <h3>No Resume Uploaded</h3>

          <p>
            Upload your first resume to begin.
          </p>

        </div>

      ) : (

        resumes.map((resume) => (

          <div
            key={resume._id}
            className="resume-card"
          >

            <div className="resume-left">

              <FaFilePdf />

              <div>

                <h3>

                  {resume.filename}

                </h3>

                <p>

                  {resume.mimetype}

                </p>

                <p>

                  {(resume.size / 1024).toFixed(2)} KB

                </p>

              </div>

            </div>

            <div className="resume-actions">

              <button

                className="view-btn"

                onClick={() =>
                  window.open(
                    `https://ai-interview-a2kn.onrender.com/${resume.path.replace(
                      /\\/g,
                      "/"
                    )}`,
                    "_blank"
                  )
                }

              >

                <FaEye />

                View

              </button>

              <button

                className="delete-btn"

                onClick={() =>
                  handleDelete(resume._id)
                }

              >

                <FaTrash />

                Delete

              </button>

            </div>

          </div>

        ))

      )}

    </section>

  </div>
);
}