import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: { accept: "application/json" },
});

export default AxiosInstance;