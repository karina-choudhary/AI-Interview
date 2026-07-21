import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaBars } from "react-icons/fa";

// FIX: Parent (Layout) se setShowSidebar prop liya
function Navbar({ setShowSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      
      {/* Hamburger button - Is par click karne se sidebar open hoga */}
      <button
        className="menu-btn"
        onClick={() => setShowSidebar(true)}
      >
        <FaBars />
      </button>

      <div className="navbar-logo">
        <Link to="/dashboard">
          <span>🤖</span> AI Interview
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/profile" className="profile-btn">
          <FaUserCircle />
          <span>Profile</span>
        </Link>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </nav>
  );
}

export default Navbar;
