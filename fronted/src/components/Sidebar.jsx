import React from "react";
import {
  FaHome,
  FaFileAlt,
  FaMicrophone,
  FaUserCircle,
  FaTimes
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

// FIX: Parent (Layout) se dono props liye
function Sidebar({ showSidebar, setShowSidebar }) {
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Resume",
      path: "/resume",
      icon: <FaFileAlt />,
    },
    {
      name: "Interview",
      path: "/interview",
      icon: <FaMicrophone />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUserCircle />,
    },
  ];

  return (
    // FIX: Backticks use karke show class dynamically add ki
    <aside className={`sidebar ${showSidebar ? "show" : ""}`}>

      {/* Close button - Is par click karne se sidebar chhup jayega */}
      <button
          className="close-btn"
          onClick={() => setShowSidebar(false)}
      >
          <FaTimes />
      </button>

      <div className="logo">
        AI Interview
      </div>

      <ul>
        {menu.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={
                location.pathname.startsWith(item.path)
                  ? "active"
                  : ""
              }
              // Mobile par link click hote hi sidebar automatic band ho jaye uske liye
              onClick={() => setShowSidebar(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

    </aside>
  );
}

export default Sidebar;

