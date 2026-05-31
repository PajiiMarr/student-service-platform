import type { Route } from "./+types/home";
import { redirect } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { refreshTokenOnServer, serverAxios } from "~/utils/handler/server-axios";
import JobPostContainer from "~/components/user/student/job_post_container";
import PostListContainer from "~/components/user/student/post_lists";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the Student Service Platform" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const fetchData = async (token?: string) => {
    const api = serverAxios(request, token);
    const [userResponse, jobsResponse] = await Promise.all([
      api.get("/api/protected/profiling"),
      api.get("/api/student/jobs"),
    ]);
    return {
      user: userResponse.data.user,
      jobs: jobsResponse.data.jobs || [],
    };
  };

  try {
    return await fetchData();
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Token expired — try refresh once
      const newToken = await refreshTokenOnServer(request);
      if (!newToken) return redirect("/signin");

      try {
        return await fetchData(newToken);
      } catch {
        return redirect("/signin");
      }
    }
    return {
      error: error.response?.data?.message || "Failed to load profile",
      jobs: [],
    };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const jobTitle = formData.get("title");
  const jobDescription = formData.get("description");
  const jobAmount = formData.get("amount_offer");

  const postJob = async (token?: string) => {
    const api = serverAxios(request, token);
    return await api.post("/api/student/jobs", {
      title: jobTitle,
      description: jobDescription,
      amount_offer: parseFloat(jobAmount as string),
    });
  };

  try {
    const response = await postJob();
    if (response.data.success) {
      return { success: true, message: response.data.message, job: response.data.job };
    }
    return { error: response.data.message || "Failed to create job post" };
  } catch (error: any) {
    if (error.response?.status === 401) {
      const newToken = await refreshTokenOnServer(request);
      if (!newToken) return redirect("/signin");

      try {
        const response = await postJob(newToken);
        if (response.data.success) {
          return { success: true, message: response.data.message, job: response.data.job };
        }
        return { error: response.data.message || "Failed to create job post" };
      } catch {
        return redirect("/signin");
      }
    }
    return { error: error.response?.data?.message || "An error occurred" };
  }
}

export default function Home() {
  const fetcher = useFetcher();
  const { jobs } = useLoaderData<typeof loader>();

  // Show toast when the fetcher completes
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        toast.success(
          fetcher.data.message || "Job post created successfully!",
          {
            description: "Your job posting has been published.",
            duration: 4000,
            position: "bottom-right",
          },
        );
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error, {
          description: "Please check your input and try again.",
          duration: 5000,
          position: "bottom-right",
        });
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center p-6 border">
      <JobPostContainer fetcher={fetcher} />
      <PostListContainer
        jobs={jobs}
        onEdit={(job) => console.log("Edit", job)}
        onDelete={(job) => console.log("Delete", job)}
        onMarkComplete={(job) => console.log("Complete", job)}
      />
    </div>
  );
}
