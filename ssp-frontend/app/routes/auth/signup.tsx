import type { Route } from "./+types/signup";
import { SignupForm } from "~/components/auth/signup-form";
import { redirect, data } from "react-router";
import { useFetcher } from "react-router";
import cleanFormData from "~/utils/clean/clean-form-data";
import { serverAxios } from "~/utils/handler/server-axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Signup" },
    { name: "description", content: "Create your account" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  return null;
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const cleaned = cleanFormData(formData);
  const errors: Record<string, string> = {};
  const { email, username, password, confirm_password } = cleaned;

  if (!email.trim()) errors.email = "Email is required";
  if (!username.trim()) errors.username = "Username is required";
  if (!password.trim()) errors.password = "Password is required";
  if (password !== confirm_password)
    errors.confirm_password = "Passwords do not match";

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  const payload = { email, username, password, confirm_password };

  try {
    const api = serverAxios(request);
    const response = await api.post("/api/signup", payload);

    const setCookie = response.headers["set-cookie"];
    const headers = new Headers();
    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
    }

    return redirect("/profiling", { headers });
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    const status = error.response?.status || 500;
    return data({ errors: { general: errorMessage } }, { status });
  }
}

export default function Signup() {
  const fetcher = useFetcher();
  return <SignupForm fetcher={fetcher} />;
}
