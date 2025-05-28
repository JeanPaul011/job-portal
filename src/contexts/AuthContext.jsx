// Updated AuthContext.jsx with email verification support
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext();

const AUTO_LOGOUT_TIME = 60 * 60 * 1000; // 60 minutes

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [loginTime, setLoginTime] = useState(localStorage.getItem('loginTime'));
  const [logoutTimer, setLogoutTimer] = useState(null);

  const startLogoutTimer = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    if (loginTime) {
      const currentTime = Date.now();
      const loginTimestamp = parseInt(loginTime);
      const elapsedTime = currentTime - loginTimestamp;
      const remainingTime = AUTO_LOGOUT_TIME - elapsedTime;

      if (remainingTime <= 0) {
        handleAutoLogout();
      } else {
        const timer = setTimeout(() => {
          handleAutoLogout();
        }, remainingTime);
        setLogoutTimer(timer);
      }
    }
  };

  const handleAutoLogout = () => {
    alert('Your session has expired due to inactivity. You will be logged out.');
    logout();
  };

  useEffect(() => {
    startLogoutTimer();
    
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, [loginTime]);

  const login = async (email, password) => {
    try {
      const res = await loginUser(email, password);
      
      // Check if email verification is required
      if (res.emailVerificationRequired) {
        throw new Error('Please verify your email before logging in.');
      }
      
      const { token, refreshToken, role, fullName, email: userEmail, emailVerified } = res;
  
      const userData = { 
        email: userEmail, 
        fullName,
        emailVerified: emailVerified || false
      };
  
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('loginTime', Date.now().toString());
  
      setToken(token);
      setUser(userData);
      setRole(role);
      setLoginTime(Date.now().toString());
      startLogoutTimer();
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw so component can handle it
    }
  };
  
  const register = async (fullName, email, password, role) => {
    try {
      const response = await registerUser(fullName, email, password, role);
      
      // Check if the response includes verification info
      if (response.verificationRequired) {
        // Return verification info to component
        return {
          verificationRequired: true,
          verificationLink: response.verificationLink,
          message: response.message
        };
      } else {
        alert('Registration successful. You can now log in.');
        navigate('/account');
        return { verificationRequired: false };
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
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
    <AuthContext.Provider value={{ 
      token, 
      user, 
      role, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);