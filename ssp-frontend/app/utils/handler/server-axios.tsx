// app/utils/handler/server-axios.ts
import axios from "axios";

export function serverAxios(request?: Request) {
  const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  // Add request interceptor to forward cookies
  if (request) {
    api.interceptors.request.use((config) => {
      const cookie = request.headers.get("Cookie");
      if (cookie) {
        config.headers.Cookie = cookie;
      }
      return config;
    });
  }

  // Add response interceptor for automatic token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If 401 and not already retried
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh the token
          await axios.post(
            "http://localhost:8080/api/refresh",
            {},
            {
              withCredentials: true,
              headers: {
                Cookie: request?.headers.get("Cookie") || "",
              },
            },
          );

          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to signin
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
}
