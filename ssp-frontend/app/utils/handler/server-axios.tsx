import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
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
            const refreshResponse = await axios.post(
              `${API_BASE_URL}/api/refresh`,
              {},
              { withCredentials: true }
            );

            const setCookie = refreshResponse.headers["set-cookie"];
            if (setCookie) {
              const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
              cookies.forEach((c: string) => {
                const [nameValue] = c.split(";");
                const [key, val] = nameValue.split("=");
                if (key === "auth_token") {
                  originalRequest.headers.Authorization = `Bearer ${val}`;
                }
              });
            }

            return api(originalRequest);
          } catch (refreshError) {
            window.location.href = "/signin";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  return api;
}