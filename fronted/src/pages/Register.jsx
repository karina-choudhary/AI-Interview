
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Ye function missing tha
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registration Successful");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setMessage(data.message || data.error || "Registration Failed");
      }
    } catch (err) {
      setMessage("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <p>Join AI Interview</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {loading ? "Please Wait..." : "Create Account"}
          </button>
        </form>

        {message && <div className="message">{message}</div>}

        <p className="bottom-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;