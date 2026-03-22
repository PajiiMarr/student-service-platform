import axios from "axios";

// process.env works in Node.js SSR — VITE_ vars do NOT
const ServerAxios = axios.create({
  baseURL: process.env.API_URL ?? "http://127.0.0.1:8080",
  timeout: 60000,
  headers: { accept: "application/json" },
});

export function serverAxios(request: Request) {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const headers = { Cookie: cookieHeader };

  return {
    get:     (url: string, config = {}) => ServerAxios.get(url, { ...config, headers }),
    post:    (url: string, data?: any, config = {}) => ServerAxios.post(url, data, { ...config, headers }),
    put:     (url: string, data?: any, config = {}) => ServerAxios.put(url, data, { ...config, headers }),
    patch:   (url: string, data?: any, config = {}) => ServerAxios.patch(url, data, { ...config, headers }),
    delete:  (url: string, config = {}) => ServerAxios.delete(url, { ...config, headers }),
    head:    (url: string, config = {}) => ServerAxios.head(url, { ...config, headers }),
    options: (url: string, config = {}) => ServerAxios.options(url, { ...config, headers }),
  };
}