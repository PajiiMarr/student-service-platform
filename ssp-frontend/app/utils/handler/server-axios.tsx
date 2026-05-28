import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const isServer = typeof window === "undefined";

export function serverAxios(request?: Request) {
  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  if (request) {
    api.interceptors.request.use((config) => {
      const cookie = request.headers.get("Cookie");
      if (cookie) {
        config.headers.Cookie = cookie;
        const tokenMatch = cookie.match(/auth_token=([^;]+)/);
        if (tokenMatch) {
          config.headers.Authorization = `Bearer ${tokenMatch[1]}`;
        }
      }
      return config;
    });
  }

  if (!isServer) {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // Just call refresh — browser sets the new cookies automatically
            await axios.post(
              `${API_BASE_URL}/api/refresh`,
              {},
              { withCredentials: true },
            );

            // Remove stale Authorization header so the retry
            // relies purely on the fresh cookie the browser just stored
            delete originalRequest.headers["Authorization"];

            // Small tick to ensure cookies are committed before retry
            return api(originalRequest);
          } catch (refreshError) {
            window.location.href = "/signin";
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );
  }

  return api;
}
