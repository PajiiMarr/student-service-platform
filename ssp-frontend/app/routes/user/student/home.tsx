import type { Route } from "./+types/home";
import { redirect } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { serverAxios } from "~/utils/handler/server-axios";
import JobPostContainer from "~/components/user/student/job_post_container";
import PostListContainer from "~/components/user/student/post_lists";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the Student Service Platform" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const api = serverAxios(request);
    // Fetch user profile
    const userResponse = await api.get("/api/protected/profiling");
    // Fetch all jobs (ordered by created_at)
    const jobsResponse = await api.get("/api/student/jobs");

    return {
      user: userResponse.data.user,
      jobs: jobsResponse.data.jobs || [],
    };
  } catch (error: any) {
    if (error.response?.status === 401) return redirect("/signin");
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

  try {
    const api = serverAxios(request);
    const response = await api.post("/api/student/jobs", {
      title: jobTitle,
      description: jobDescription,
      amount_offer: parseFloat(jobAmount as string),
    });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || "Job post created successfully!",
        job: response.data.job,
      };
    } else {
      return { error: response.data.message || "Failed to create job post" };
    }
  } catch (error: any) {
    console.error("Error creating job post:", error);
    if (error.response?.status === 401) return redirect("/signin");
    return {
      error:
        error.response?.data?.message ||
        "An error occurred while creating the job post",
    };
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
