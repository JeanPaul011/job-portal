import React, { useState, useEffect } from 'react';
import '../styles/Account.css';
import { FaEnvelope, FaLock, FaUser, FaSignInAlt, FaUserPlus, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Account = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationLink, setVerificationLink] = useState('');
  const [form, setForm] = useState({
    fullName: '',    email: '',
    password: '',
    role: 'JobSeeker'
  });

  const { login, register, token, user, role, logout } = useAuth();

  // Check URL for email verification
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const verificationToken = urlParams.get('token');
    
    if (userId && verificationToken) {
      handleEmailVerification(userId, verificationToken);
    }
  }, []);

  const handleEmailVerification = async (userId, token) => {
    try {
      const response = await fetch(`https://localhost:5276/api/account/verify-email?userId=${userId}&token=${encodeURIComponent(token)}`);
      const data = await response.json();
      
      if (response.ok) {
        alert('✅ ' + data.message);
        setIsLogin(true); // Switch to login view
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      alert('❌ Email verification failed: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      try {
        await login(form.email, form.password);
      } catch (error) {
        // Check if it's an email verification error
        if (error.message.includes('verify your email')) {
          setShowVerification(true);
          setVerificationEmail(form.email);
        }
      }
    } else {
      try {
        const result = await register(form.fullName, form.email, form.password, form.role);
        
        // Check if verification is required
        if (result && result.verificationRequired) {
          setShowVerification(true);
          setVerificationEmail(form.email);
          setVerificationLink(result.verificationLink);
          alert('📧 Registration successful! Please check your email to verify your account.');
        }
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch('https://localhost:5276/api/account/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: verificationEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('📧 Verification email sent!');
        if (data.verificationLink) {
          setVerificationLink(data.verificationLink);
        }
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      alert('❌ Failed to resend verification email');
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

  if (showVerification) {
    return (
      <div className="account-glass-wrapper d-flex align-items-center justify-content-center">
        <div className="account-glass-card shadow-lg p-4 text-center">
          <FaCheckCircle className="text-success mb-3" size={48} />
          <h2 className="fw-bold mb-3 text-primary">Check Your Email</h2>
          <p className="text-muted mb-3">
            We've sent a verification link to:
            <br />
            <strong>{verificationEmail}</strong>
          </p>
          
          {/* Demo purposes - show verification link */}
          {verificationLink && (
            <div className="alert alert-info mb-3">
              <small className="text-muted">
                <strong>Demo Link:</strong><br />
                <a href={verificationLink} className="text-break">
                  Click here to verify your email
                </a>
              </small>
            </div>
          )}
          
          <div className="d-grid gap-2">
            <button 
              className="btn btn-outline-primary" 
              onClick={handleResendVerification}
            >
              📧 Resend Verification Email
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setShowVerification(false);
                setIsLogin(true);
              }}
            >
              Back to Login
            </button>
          </div>
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
                <input 
                  type="text" 
                  name="fullName" 
                  value={form.fullName} 
                  onChange={handleChange} 
                  className="form-control" 
                  required 
                />
              </div>
              <div className="form-group mb-3">
                <label>Role</label>
                <select 
                  name="role" 
                  value={form.role} 
                  onChange={handleChange} 
                  className="form-control" 
                  required
                >
                  <option value="JobSeeker">Job Seeker</option>
                  <option value="Recruiter">Recruiter</option>
                </select>
              </div>
            </>
          )}
          
          <div className="form-group mb-3">
            <label><FaEnvelope className="me-2" /> Email</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              className="form-control" 
              required 
            />
          </div>
          
          <div className="form-group mb-4">
            <label><FaLock className="me-2" /> Password</label>
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              className="form-control" 
              required 
            />
          </div>
          
          <button className="btn btn-primary w-100" type="submit">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {isLogin && (
          <div className="text-center mt-3">
            <small className="text-muted">
              Need to verify your email? 
              <button 
                className="btn btn-link btn-sm p-0 ms-1"
                onClick={() => {
                  setShowVerification(true);
                  setVerificationEmail(form.email);
                }}
              >
                Resend verification
              </button>
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;