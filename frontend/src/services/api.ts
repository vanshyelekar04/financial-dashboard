import axios from 'axios';

const API = axios.create({
  baseURL: 'https://financial-dashboard-backend-f9n8.onrender.com/api',
  withCredentials: true, // 👈 Important for CORS cookies
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
