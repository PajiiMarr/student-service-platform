import type { Route } from "./+types/profile";
import { redirect } from "react-router";
import { useLoaderData } from "react-router";
import {
  refreshTokenOnServer,
  serverAxios,
} from "~/utils/handler/server-axios";
import { UserProfile } from "~/components/user/student/profile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Profile" },
    { name: "description", content: "View your student profile" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const fetchStudentProfile = async (token?: string) => {
    const api = serverAxios(request, token);
    const response = await api.get("/api/student/profile");
    return {
      student: response.data.student,
    };
  };

  try {
    return await fetchStudentProfile();
  } catch (error: any) {
    if (error.response?.status === 401) {
      const { token: newToken, rawSetCookies } =
        await refreshTokenOnServer(request);
      if (!newToken) return redirect("/signin");

      try {
        const data = await fetchStudentProfile(newToken);
        const headers = new Headers({ "Content-Type": "application/json" });
        rawSetCookies.forEach((c) => headers.append("Set-Cookie", c));
        return new Response(JSON.stringify(data), { headers });
      } catch {
        return redirect("/signin");
      }
    }
    return {
      error: error.response?.data?.message || "Failed to load student profile",
    };
  }
}

export default function Profile() {
  const data = useLoaderData<typeof loader>();

  if ("error" in data) {
    return (
      <div className="container mx-auto py-10 text-center text-red-600">
        <p>{data.error}</p>
      </div>
    );
  }

  if (!data.student) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Transform backend student object to match UserProfile interface
  const userProfile = {
    id: data.student.User?.ID || data.student.User?.id || data.student.id,
    first_name: data.student.User?.first_name || "",
    middle_name: data.student.User?.middle_name,
    last_name: data.student.User?.last_name || "",
    email: data.student.User?.email || "",
    role: data.student.User?.role || "student",
    // Optional fields (extend User model on backend if needed)
    phone: data.student.User?.phone,
    address: data.student.User?.address,
    Student: {
      YearLevel: data.student.YearLevel,
      Section: data.student.Section,
      Course: data.student.Course
        ? {
            Name: data.student.Course.name,      // backend uses "name" (lowercase)
            College: data.student.Course.College
              ? { Name: data.student.Course.College.name }
              : undefined,
          }
        : undefined,
    },
  };

  return (
    <div className="container mx-auto py-8">
      <UserProfile user={userProfile} showEditButton={true} onEdit={() => {}} />
    </div>
  );
}