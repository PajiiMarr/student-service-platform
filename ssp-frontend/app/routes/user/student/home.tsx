import type { Route } from "./+types/home";
import { redirect } from "react-router";
import { serverAxios } from "~/utils/handler/server-axios";
import JobPostContainer from "~/components/user/student/job_post_container";
import PostListContainer from "~/components/user/student/post_lists";
import AxiosInstance from "~/utils/handler/axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the Student Service Platform" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  try {
    const api = serverAxios(request);
    const response = await api.get("/api/protected/profiling");
    const user = response.data.user;

    return {
      user: response.data.user,
    };
  } catch (error: any) {
    if (error.response?.status === 401) {
      return redirect("/signin");
    }
    return { error: error.response?.data?.message || "Failed to load profile" };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  
  const jobTitle = formData.get("job-title");
  const jobDescription = formData.get("job-description");
  const jobAmount = formData.get("job-amount");
  const jobStatus = formData.get("job-status");
  const jobTerms = formData.get("job-terms");

  // Validate required fields
  if (!jobTitle || !jobDescription || !jobAmount || !jobTerms) {
    return { 
      error: "Please fill in all required fields and accept the terms" 
    };
  }

  // Validate amount is positive number
  const amount = parseFloat(jobAmount as string);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Please enter a valid positive amount" };
  }

  try {
    const api = serverAxios(request);
    const response = await api.post("/api/protected/student/jobs", {
      title: jobTitle,
      description: jobDescription,
      amount: amount,
      status: jobStatus || "open",
    });

    if (response.data.success) {
      return { 
        success: true, 
        message: "Job post created successfully!",
        job: response.data.job 
      };
    } else {
      return { error: response.data.message || "Failed to create job post" };
    }
  } catch (error: any) {
    console.error("Error creating job post:", error);
    
    if (error.response?.status === 401) {
      return redirect("/signin");
    }
    
    return { 
      error: error.response?.data?.message || "An error occurred while creating the job post" 
    };
  }
}

export default function Home() {
  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center p-6 border">
      <JobPostContainer />
      <PostListContainer />
    </div>
  );
}