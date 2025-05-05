import React, { useState } from 'react';
import '../styles/Account.css';
import { FaEnvelope, FaLock, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Account = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'JobSeeker'
  });

  const { login, register, token, user, role, logout } = useAuth();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login(form.email, form.password);
    } else {
      register(form.fullName, form.email, form.password, form.role);
    }
  };

  if (token) {
    return (
      <div className="account-glass-wrapper d-flex align-items-center justify-content-center">
        <div className="account-glass-card shadow-lg p-4 text-center">
          <h2 className="fw-bold mb-3 text-primary">Welcome, {user?.fullName} 👋</h2>
          <p className="text-muted mb-3">Role: {role}</p>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-glass-wrapper d-flex align-items-center justify-content-center">
      <div className="account-glass-card shadow-lg p-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-3 text-primary">
            {isLogin ? <FaSignInAlt className="me-2" /> : <FaUserPlus className="me-2" />}
            {isLogin ? 'Login' : 'Register'}
          </h2>
          <div className="toggle-buttons">
            <button
              className={`btn ${isLogin ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`btn ${!isLogin ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group mb-3">
                <label><FaUser className="me-2" /> Full Name</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="form-control" required />
              </div>
              <div className="form-group mb-3">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="form-control" required>
                  <option value="JobSeeker">Job Seeker</option>
                  <option value="Recruiter">Recruiter</option>
                </select>
              </div>
            </>
          )}
          <div className="form-group mb-3">
            <label><FaEnvelope className="me-2" /> Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group mb-4">
            <label><FaLock className="me-2" /> Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required />
          </div>
          <button className="btn btn-primary w-100" type="submit">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;
