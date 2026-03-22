import type { Route } from "./+types/signup";
import AxiosInstance from "~/utils/handler/axios";
import { SignupForm } from "~/components/auth/signup-form";
import { redirect, data } from "react-router";
import { useFetcher } from "react-router";
import cleanFormData from "~/utils/clean/clean-form-data";

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
  if (password != confirm_password) errors.password = "Password do not match";

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  const payload = { email, username, password, confirm_password };

  try {
    const response = await AxiosInstance.post("/api/signup", payload);
    
    console.log("Signup successful:", response.data);
    
  } catch (error: any) {
    console.log("Signup failed:", error.response.data);
    const message = error.response?.data?.message || "Something went wrong";

    return data(
      {
        errors: {
          general: error.response.data.message || "Something went wrong",
        },
      },
      { status: error.response.status },
    );
  }
}

export default function Signup() {
  const fetcher = useFetcher();
  return (
    <>
      <SignupForm fetcher={fetcher} />
    </>
  );
}
