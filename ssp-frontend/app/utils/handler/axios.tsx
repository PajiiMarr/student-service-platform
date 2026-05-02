// lib/axios.ts or wherever your AxiosInstance is
import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  withCredentials: true, // Keep for cookie support
  headers: { 
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add interceptor to also send Authorization header when needed
AxiosInstance.interceptors.request.use((config) => {
  // Get token from cookie (client-side)
  const token = document.cookie.match(/auth_token=([^;]+)/)?.[1];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default AxiosInstance;