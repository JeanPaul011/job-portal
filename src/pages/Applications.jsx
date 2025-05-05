import React from 'react';
import '../styles/Applications.css';
import { FaEnvelope, FaTrash, FaUser, FaCheckCircle } from 'react-icons/fa';

const dummyApplications = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    jobTitle: "Frontend Developer",
    status: "Pending"
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    jobTitle: "Backend Engineer",
    status: "Reviewing"
  },
  {
    id: 3,
    name: "Catherine Lee",
    email: "catherine@example.com",
    jobTitle: "UI/UX Designer",
    status: "Accepted"
  }
];

const statusColors = {
  Pending: 'warning',
  Reviewing: 'info',
  Accepted: 'success',
  Rejected: 'danger',
  Withdrawn: 'secondary'
};

const Applications = () => {
  return (
    <div className="applications-page container py-5">
      <h2 className="text-center fw-bold mb-4">Job Applications</h2>

      <div className="table-responsive">
        <table className="table table-bordered align-middle shadow-sm bg-white">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyApplications.map(app => (
              <tr key={app.id}>
                <td><FaUser className="me-2 text-primary" />{app.name}</td>
                <td><FaEnvelope className="me-2 text-muted" />{app.email}</td>
                <td>{app.jobTitle}</td>
                <td>
                  <span className={`badge bg-${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                </td>
                <td>
                  <select className="form-select form-select-sm d-inline w-auto me-2">
                    {Object.keys(statusColors).map(status => (
                      <option key={status} value={status} selected={status === app.status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-outline-danger btn-sm">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;
