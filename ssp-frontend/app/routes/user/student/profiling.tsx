import type { Route } from "./+types/profiling";
import { redirect, data } from "react-router";
import { useFetcher } from "react-router";
import cleanFormData from "~/utils/clean/clean-form-data";
import { serverAxios } from "~/utils/handler/server-axios";
import ProfilingForm from "~/components/user/profiling-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profiling" },
    { name: "description", content: "Complete your profile" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  try {
    const api = serverAxios(request);
    const response = await api.get("/api/protected/profiling");
    return { user: response.data.user };
  } catch (error: any) {
    if (error.response?.status === 401) {
      return redirect("/login");
    }
    return { error: error.response?.data?.message || "Failed to load profile" };
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const cleaned = cleanFormData(formData);
  const errors: Record<string, string> = {};

  const {
    first_name,
    last_name,
    middle_name,
    birthday,
    street,
    barangay,
    city,
  } = cleaned;

  // Calculate age from birthday
  let age = null;
  if (birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
  }

  // Validation
  if (!first_name?.trim()) errors.first_name = "First Name is required!";
  if (!last_name?.trim()) errors.last_name = "Last Name is required!";
  if (!birthday?.trim()) errors.birthday = "Birthday is required!";
  if (!street?.trim()) errors.street = "Street is required!";
  if (!barangay?.trim()) errors.barangay = "Barangay is required!";
  if (age !== null && age < 18)
    errors.age = "You must be at least 18 years old to proceed!";

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  const payload = {
    first_name,
    last_name,
    middle_name,
    birthday,
    street,
    barangay,
    city: city || "City of Zamboanga",
  };

  try {
    const api = serverAxios(request);
    // ↓ Send as JSON explicitly
    const response = await api.put("/api/protected/profiling", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return redirect("/dashboard");
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong";
    const status = error.response?.status || 500;
    return data({ errors: { general: errorMessage } }, { status });
  }
}

export default function Profiling() {
  const fetcher = useFetcher();
  return <ProfilingForm fetcher={fetcher} />;
}
