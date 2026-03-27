import type { Route } from "./+types/signin";
import { useFetcher } from "react-router";
import cleanFormData from "~/utils/clean/clean-form-data";
import { redirect, data } from "react-router";
import { LoginForm } from "~/components/auth/signin-form";
import { serverAxios } from "~/utils/handler/server-axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Login to your account" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  
  // Optional: Check if user is already logged in
  const authToken = request.headers
    .get("Cookie")
    ?.match(/auth_token=([^;]+)/)?.[1];

  if (authToken) {
    try {
      const api = serverAxios(request);
      const response = await api.get("/api/auth/verify");

      if (response.data.user.role === "admin") {
        return redirect("/admin/");
      } else if (response.data.user.role === "student") {
        return redirect("/student/");
      }
    } catch (error) {
      // Token invalid, continue to login page
    }
  }

  // const csrfToken = generateCSRFToken();
  // return { csrfToken };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const cleaned = cleanFormData(formData);
  const errors: Record<string, string> = {};
  const { username, password } = cleaned;

  // Input validation
  if (!username || username.trim().length === 0) {
    errors.username = "Username is required";
  } else if (username.length > 100) {
    errors.username = "Username is too long";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  const payload = {
    username: username.trim(),
    password: password, // Send as is, backend will hash comparison
  };

  try {
    const api = serverAxios(request);

    // FIXED: Use signin endpoint, not signup
    const response = await api.post("/api/signin", payload);

    const setCookie = response.headers["set-cookie"];
    const headers = new Headers();

    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookies.forEach((cookie) => {
        // Enhance cookie security if backend didn't set proper attributes
        let enhancedCookie = cookie;

        // Ensure secure flags are set (if not in development)
        if (process.env.NODE_ENV === "production") {
          if (!cookie.includes("Secure")) {
            enhancedCookie += "; Secure";
          }
          if (!cookie.includes("HttpOnly")) {
            enhancedCookie += "; HttpOnly";
          }
          if (!cookie.includes("SameSite")) {
            enhancedCookie += "; SameSite=Strict";
          }
        }

        headers.append("Set-Cookie", enhancedCookie);
      });
    }

    // Check if user has completed profiling
    const needsProfiling =
      !response.data.user.first_name ||
      !response.data.user.last_name ||
      !response.data.user.birthday;

    // Redirect based on role and profiling status
    if (response.data.user.role === "admin") {
      return redirect("/admin/dashboard", { headers });
    } else if (response.data.user.role === "student") {
      if (needsProfiling) {
        return redirect("/student/profiling", { headers });
      }
      return redirect("/student/dashboard", { headers });
    }

    // Fallback for user role
    return redirect("/dashboard", { headers });
  } catch (error: any) {
    // Don't expose specific error details to client
    let errorMessage = "Invalid username or password";
    let status = 401;

    // Only show specific error for rate limiting or account lockout
    if (error.response?.status === 429) {
      errorMessage = "Too many attempts. Please try again later.";
      status = 429;
    } else if (error.response?.data?.message === "Account locked") {
      errorMessage = "Account temporarily locked. Please try again later.";
      status = 403;
    }

    return data({ errors: { general: errorMessage } }, { status });
  }
}

export default function Login() {
  const fetcher = useFetcher();
  return <LoginForm fetcher={fetcher} />;
}
function generateCSRFToken() {
  throw new Error("Function not implemented.");
}
