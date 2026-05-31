// app/routes/user/student/view_job/view_job.tsx
import type { Route } from "./+types/view_job";
import { redirect, useLoaderData } from "react-router";
import {
  refreshTokenOnServer,
  serverAxios,
} from "~/utils/handler/server-axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  Calendar,
  Clock,
  Briefcase,
  Mail,
  ArrowLeft,
  GraduationCap,
  Building,
  Hash,
  BookOpen,
  PhilippinePeso,
} from "lucide-react";
import { Link } from "react-router";

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data?.job ? `Job: ${data.job.title}` : "View Job" },
    {
      name: "description",
      content: data?.job?.description?.substring(0, 160) || "View job details",
    },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const fetchData = async (token?: string) => {
    const api = serverAxios(request, token);
    const [userResponse, jobResponse] = await Promise.all([
      api.get("/api/protected/profiling"),
      api.get(`/api/student/jobs/${params.job_id}`),
    ]);
    return {
      user: userResponse.data.user,
      job: jobResponse.data.job || jobResponse.data,
    };
  };

  try {
    return await fetchData();
  } catch (error: any) {
    if (error.response?.status === 401) {
      const newToken = await refreshTokenOnServer(request);
      if (!newToken) return redirect("/signin");

      try {
        return await fetchData(newToken);
      } catch {
        return redirect("/signin");
      }
    }
    return {
      error: error.response?.data?.message || "Failed to load job details",
      user: null,
      job: null,
    };
  }
}

export default function ViewJob() {
  const { job, user, error } = useLoaderData() as {
    job: any;
    user: any;
    error?: string;
  };

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Job Not Found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {error ||
                  "The job you're looking for doesn't exist or has been removed."}
              </p>
              <Link to="/student">
                <Button className="mt-4" variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Jobs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const postedBy = job.Student?.User;
  const studentName = postedBy
    ? `${postedBy.first_name} ${postedBy.middle_name ? postedBy.middle_name + " " : ""}${postedBy.last_name}`
    : "Unknown Student";
  const initials = postedBy
    ? `${postedBy.first_name?.[0] || ""}${postedBy.last_name?.[0] || ""}`
    : "??";

  const statusVariant =
    job.status === "completed"
      ? "default"
      : job.status === "in_progress"
        ? "secondary"
        : job.status === "cancelled"
          ? "destructive"
          : "outline";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <Link to="/student">
        <Button variant="ghost" className="mb-4 pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant={statusVariant} className="capitalize">
                      {job.status?.replace("_", " ")}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Job ID: #{job.ID}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              <Separator />

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <PhilippinePeso className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Amount Offer</p>
                    <p className="font-semibold text-lg">
                      ₱{Number(job.amount_offer).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Posted Date</p>
                    <p className="font-semibold">
                      {new Date(job.CreatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="font-semibold">
                      {new Date(job.UpdatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="font-semibold capitalize">
                      {job.status?.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Student details */}
              {job.Student && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Student Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.Student.YearLevel && (
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="text-xs text-gray-500">Year Level</p>
                          <p className="font-semibold">
                            {job.Student.YearLevel}
                            {job.Student.YearLevel === 1
                              ? "st"
                              : job.Student.YearLevel === 2
                                ? "nd"
                                : job.Student.YearLevel === 3
                                  ? "rd"
                                  : "th"}{" "}
                            Year
                          </p>
                        </div>
                      </div>
                    )}

                    {job.Student.Section && (
                      <div className="flex items-center gap-3">
                        <Hash className="h-5 w-5 text-teal-600" />
                        <div>
                          <p className="text-xs text-gray-500">Section</p>
                          <p className="font-semibold">{job.Student.Section}</p>
                        </div>
                      </div>
                    )}

                    {job.Student.Course?.Name && (
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-cyan-600" />
                        <div>
                          <p className="text-xs text-gray-500">Course</p>
                          <p className="font-semibold">
                            {job.Student.Course.Name}
                          </p>
                        </div>
                      </div>
                    )}

                    {job.Student.Course?.College?.Name && (
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-xs text-gray-500">College</p>
                          <p className="font-semibold">
                            {job.Student.Course.College.Name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Poster info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posted By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-red-100 text-red-700 font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{studentName}</p>
                  {postedBy?.email && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{postedBy.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold">
                  ₱{Number(job.amount_offer).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <Badge variant={statusVariant} className="capitalize">
                  {job.status?.replace("_", " ")}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Posted</span>
                <span className="font-semibold">
                  {new Date(job.CreatedAt).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Updated</span>
                <span className="font-semibold">
                  {new Date(job.UpdatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          {user && user.id !== job.Student?.UserID && (
            <Card>
              <CardContent className="pt-6">
                <Button className="w-full bg-red-700 hover:bg-red-800">
                  Apply for this Job
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
