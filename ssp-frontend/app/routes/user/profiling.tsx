import type { Route } from "./+types/profiling";
import { redirect } from "react-router";
import cleanFormData from "~/utils/clean/clean-form-data";
import { serverAxios } from "~/utils/handler/server-axios";

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
}

export default function Profiling() {
  return <></>;
}