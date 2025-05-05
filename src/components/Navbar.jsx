import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import {
  FaHome,
  FaInfoCircle,
  FaSearch,
  FaFileAlt,
  FaBuilding,
  FaPlus,
  FaUser,
  FaHeart,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { token, role, user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm px-4 py-3 custom-navbar">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold fs-3 text-primary">
          JobFinder
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-3 align-items-center">
            <li className="nav-item"><Link to="/" className="nav-link"><FaHome className="me-1" /> Home</Link></li>
            <li className="nav-item"><Link to="/about" className="nav-link"><FaInfoCircle className="me-1" /> About Us</Link></li>
            <li className="nav-item"><Link to="/jobs" className="nav-link"><FaSearch className="me-1" /> Find Jobs</Link></li>
            <li className="nav-item"><Link to="/saved-jobs" className="nav-link"><FaHeart className="me-1" /> Saved Jobs</Link></li>
            <li className="nav-item"><Link to="/applications" className="nav-link"><FaFileAlt className="me-1" /> My Applications</Link></li>
            <li className="nav-item"><Link to="/companies" className="nav-link"><FaBuilding className="me-1" /> View Companies</Link></li>
            <li className="nav-item"><Link to="/post-job" className="nav-link"><FaPlus className="me-1" /> Post Jobs</Link></li>

            {!token ? (
              <li className="nav-item"><Link to="/account" className="nav-link"><FaUser className="me-1" /> Account</Link></li>
            ) : (
              <>
                <li className="nav-item text-muted small">
                  <span className="d-none d-md-inline">Logged in as: </span>{user?.fullName} ({role})
                </li>
                <li className="nav-item">
                  <button className="btn btn-sm btn-outline-danger" onClick={logout}>
                    <FaSignOutAlt className="me-1" /> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
