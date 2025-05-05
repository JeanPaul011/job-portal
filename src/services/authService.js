// src/services/authService.js
import axios from 'axios';

const API_URL = 'https://localhost:5276/api/account';

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const registerUser = async (fullName, email, password, role) => {
  const response = await axios.post(`${API_URL}/register`, { fullName, email, password, role });
  return response.data;
};
