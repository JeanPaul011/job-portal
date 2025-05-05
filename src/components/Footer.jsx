import React from 'react';
import '../styles/Footer.css';
import { FaBriefcase, FaUserTie, FaBuilding } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          {/* JOB SEEKERS */}
          <div className="col-md-4 mb-4">
            <h5><FaUserTie className="me-2" />Job Seekers</h5>
            <ul className="list-unstyled">
              <li><a href="/jobs">Find Jobs</a></li>
              <li><a href="/applications">My Applications</a></li>
              <li><a href="/account">Create Account</a></li>
              <li><a href="/resume-tips">Resume Tips</a></li>
            </ul>
          </div>

          {/* EMPLOYERS */}
          <div className="col-md-4 mb-4">
            <h5><FaBriefcase className="me-2" />Employers</h5>
            <ul className="list-unstyled">
              <li><a href="/post-job">Post a Job</a></li>
              <li><a href="/companies">View Companies</a></li>
              <li><a href="/plans">Subscription Plans</a></li>
              <li><a href="/support">Employer Support</a></li>
            </ul>
          </div>

          {/* COMPANY INFO */}
          <div className="col-md-4 mb-4">
            <h5><FaBuilding className="me-2" />Company</h5>
            <ul className="list-unstyled">
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4">
          <small>&copy; {new Date().getFullYear()} JobFinder Inc. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
