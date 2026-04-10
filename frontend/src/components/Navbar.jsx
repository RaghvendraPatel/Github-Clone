import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="brand-content">
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            className="navbar-logo"
          />
          <h3>GitHub Clone</h3>
        </div>
      </Link>
      <div className="navbar-links">
        <Link to="/issues" className="nav-link">
          <span>🔴 Issues</span>
        </Link>
        <Link to="/create" className="nav-link">
          <span>+ Create</span>
        </Link>
        <Link to="/profile" className="nav-link">
          <span>Profile</span>
        </Link>
        <button onClick={handleLogout} className="nav-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;