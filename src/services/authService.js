import axios from 'axios';

const API_URL = 'https://localhost:5276/api/account';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response?.data?.emailVerificationRequired) {
      throw new Error('Please verify your email before logging in.');
    }
    throw new Error(error.response?.data?.message || error.response?.data || 'Login failed');
  }
};

export const registerUser = async (fullName, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { 
      fullName, 
      email, 
      password, 
      role 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data || 'Registration failed');
  }
};