import axios from "axios";

// Set your base URL here
const API = axios.create({
  baseURL: "https://exgeid-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
