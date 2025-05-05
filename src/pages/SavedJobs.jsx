import React, { useEffect, useState } from 'react';
import '../styles/FindJobs.css';
import { FaMapMarkerAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const SavedJobs = () => {
  const { token, user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  useEffect(() => {
    if (token && user?.email) {
      const savedKey = `savedJobs_${user.email}`;
      const saved = JSON.parse(localStorage.getItem(savedKey)) || [];
      setSavedJobs(saved);
    }
  }, [token, user]);

  // Pagination logic
  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = savedJobs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(savedJobs.length / jobsPerPage);

  if (!token) {
    return <div className="container py-5 text-center"><h4>Please login to view saved jobs.</h4></div>;
  }

  return (
    <div className="find-jobs-page container py-5">
      <h2 className="text-center fw-bold mb-4">Your Saved Jobs</h2>
      <p className="text-center mb-5 text-muted">These are jobs you’ve liked — apply when you’re ready!</p>

      <div className="row g-4">
        {currentJobs.map((job) => (
          <div key={job.id} className="col-md-6">
            <div className="job-card shadow-sm p-4 bg-white rounded">
              <h4 className="text-primary fw-bold">{job.title}</h4>
              <p className="text-muted"><FaMapMarkerAlt className="me-1" /> {job.location}</p>
              <p className="text-muted"><FaClock className="me-1" /> {job.jobType}</p>
              <p className="text-muted"><FaMoneyBillWave className="me-1" /> ${job.salary?.toLocaleString()}</p>
              <p className="job-desc">{job.description}</p>
              <button className="btn btn-outline-primary w-100">Apply Now</button>
            </div>
          </div>
        ))}
      </div>

      {savedJobs.length > jobsPerPage && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {Array.from({ length: totalPages }).map((_, i) => (
              <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
