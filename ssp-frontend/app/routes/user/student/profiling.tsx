import type { Route } from "./+types/profiling";
import { redirect, data } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
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
    const response_colleges_and_courses = await api.get("/api/protected/colleges-courses");

    return { 
      user: response.data.user,
      colleges: response_colleges_and_courses.data.colleges
    };
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
    college,
    course,
    year_level,
    section,
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
  if (age !== null && age < 18) errors.age = "You must be at least 18 years old to proceed!";
  if (!course?.trim()) errors.course = "Course is required!";
  if (!year_level?.trim()) errors.year_level = "Year level is required!";
  if (!section?.trim()) errors.section = "Section is required!";

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
    college_id: parseInt(college),
    course_id: parseInt(course),
    year_level: parseInt(year_level),
    section,
  };

  try {
    const api = serverAxios(request);
    const response = await api.put("/api/protected/profiling", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return redirect("/student");
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
  const loaderData = useLoaderData();

  return <ProfilingForm fetcher={fetcher} collegesData={loaderData?.colleges || []} />;
}