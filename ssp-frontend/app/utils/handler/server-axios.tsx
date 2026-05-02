// utils/handler/server-axios.ts
import axios from "axios";

const ServerAxios = axios.create({
  baseURL: process.env.API_URL ?? "http://127.0.0.1:8080",
  timeout: 60000,
  headers: { accept: "application/json" },
});

export function serverAxios(request: Request) {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  
  // Extract token from cookie
  let authToken = "";
  const tokenMatch = cookieHeader.match(/auth_token=([^;]+)/);
  if (tokenMatch) {
    authToken = tokenMatch[1];
  }
  
  const headers: Record<string, string> = {
    Cookie: cookieHeader,
  };
  
  // Add Authorization header if token exists
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  
  return {
    get: (url: string, config = {}) => ServerAxios.get(url, { ...config, headers }),
    post: (url: string, data?: any, config = {}) => ServerAxios.post(url, data, { ...config, headers }),
    put: (url: string, data?: any, config = {}) => ServerAxios.put(url, data, { ...config, headers }),
    patch: (url: string, data?: any, config = {}) => ServerAxios.patch(url, data, { ...config, headers }),
    delete: (url: string, config = {}) => ServerAxios.delete(url, { ...config, headers }),
    head: (url: string, config = {}) => ServerAxios.head(url, { ...config, headers }),
    options: (url: string, config = {}) => ServerAxios.options(url, { ...config, headers }),
  };
}