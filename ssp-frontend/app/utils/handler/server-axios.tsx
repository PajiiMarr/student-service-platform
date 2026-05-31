import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const isServer = typeof window === "undefined";

export async function refreshTokenOnServer(request: Request): Promise<string | null> {
  const cookie = request.headers.get("Cookie");
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/refresh`,
      {},
      {
        headers: { Cookie: cookie || "" },
        withCredentials: true,
      }
    );

    // On server, set-cookie IS readable
    const setCookieHeader = response.headers["set-cookie"];
    if (!setCookieHeader) return null;

    const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    const authCookie = cookies.find((c) => c.startsWith("auth_token="));
    if (!authCookie) return null;

    return authCookie.split(";")[0].split("=")[1];
  } catch {
    return null;
  }
}

export function serverAxios(request?: Request, overrideToken?: string) {
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

      // Use override token if provided (after refresh), else parse from cookie
      if (overrideToken) {
        config.headers.Authorization = `Bearer ${overrideToken}`;
      } else if (cookie) {
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
            await axios.post(
              `${API_BASE_URL}/api/refresh`,
              {},
              { withCredentials: true }
            );
            delete originalRequest.headers["Authorization"];
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