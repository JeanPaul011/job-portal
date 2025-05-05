import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const AuthContext = createContext();

// For testing purposes, you can adjust this (in milliseconds)
const AUTO_LOGOUT_TIME = 60 * 60 * 1000; // 60 minutes
// For testing, you might want to use a shorter time like:
// const AUTO_LOGOUT_TIME = 1 * 60 * 1000; // 1 minute

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [loginTime, setLoginTime] = useState(localStorage.getItem('loginTime'));
  const [logoutTimer, setLogoutTimer] = useState(null);

  const startLogoutTimer = () => {
    // Clear any existing timer
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    if (loginTime) {
      const currentTime = Date.now();
      const loginTimestamp = parseInt(loginTime);
      const elapsedTime = currentTime - loginTimestamp;
      const remainingTime = AUTO_LOGOUT_TIME - elapsedTime;

      if (remainingTime <= 0) {
        // Time has already expired
        handleAutoLogout();
      } else {
        // Set new timer
        const timer = setTimeout(() => {
          handleAutoLogout();
        }, remainingTime);
        setLogoutTimer(timer);
      }
    }
  };

  const handleAutoLogout = () => {
    // Show alert to user
    alert('Your session has expired due to inactivity. You will be logged out.');
    logout();
  };

  // Initialize timer on mount and when loginTime changes
  useEffect(() => {
    startLogoutTimer();
    
    // Cleanup timer on unmount
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, [loginTime]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('https://localhost:5276/api/account/login', {
        email,
        password,
      });

      const { token, refreshToken, role, fullName, email: userEmail } = res.data;

      const userData = { email: userEmail, fullName };

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('loginTime', Date.now().toString());

      setToken(token);
      setUser(userData);
      setRole(role);
      setLoginTime(Date.now().toString());

      // Start the logout timer after successful login
      startLogoutTimer();

      navigate('/'); // redirect after login
    } catch (error) {
      alert('Login failed: ' + (error.response?.data || error.message));
    }
  };

  const register = async (fullName, email, password, role) => {
    try {
      const res = await axios.post('https://localhost:5276/api/account/register', {
        fullName,
        email,
        password,
        role
      });

      if (res.status === 200) {
        alert('Registration successful. You can now log in.');
        navigate('/account');
      }
    } catch (error) {
      alert('Registration failed: ' + error.response?.data || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    setToken(null);
    setUser(null);
    setRole(null);
    setLoginTime(null);
    navigate('/account');
  };

  return (
    <AuthContext.Provider value={{ token, user, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
