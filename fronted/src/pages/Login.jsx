import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "./Login.css";
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`,  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
          console.log("Response:", data);
          console.log("Status:", res.status);

      if (res.ok) {
        localStorage.setItem("token", data.token);

        setMessage("✅ Login Successful");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setMessage(data.message || data.error || "Login Failed");
      }
    } catch (error) {
      setMessage("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>

        <p>Login to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
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
            {loading ? "Please Wait..." : "Login"}
          </button>
        </form>

        {message && <div className="message">{message}</div>}

        <p className="bottom-text">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;