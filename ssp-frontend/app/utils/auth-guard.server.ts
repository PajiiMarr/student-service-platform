import { redirect } from "react-router";
import { serverAxios } from "./handler/server-axios";
import { refreshTokenOnServer } from "./handler/server-axios"; // adjust import as needed

/**
 * Checks if the user is authenticated by calling a protected endpoint.
 * Returns a redirect response if authenticated, otherwise null.
 */
export async function requireUnauthenticated(request: Request) {
  const fetchAuthStatus = async (token?: string) => {
    const api = serverAxios(request, token);
    try {
      const response = await api.get("/api/protected/profiling");
      return response.data.user;
    } catch {
      return null;
    }
  };

  let user = null;
  try {
    user = await fetchAuthStatus();
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Try refresh token
      const { token: newToken } = await refreshTokenOnServer(request);
      if (newToken) {
        user = await fetchAuthStatus(newToken);
      }
    }
  }

  if (user) {
    // User is authenticated – redirect to their role-based dashboard
    if (user.role === "admin") {
      throw redirect("/admin");
    } else if (user.role === "student") {
      throw redirect("/student");
    } else {
      throw redirect("/");
    }
  }
  return null;
}