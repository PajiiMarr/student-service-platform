import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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
      }
      return config;
    });
  }

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await axios.post(
            `${API_BASE_URL}/api/refresh`,
            {},
            {
              withCredentials: true,
              headers: {
                Cookie: request?.headers.get("Cookie") || "",
              },
            },
          );

          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
}