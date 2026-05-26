import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Link } from "react-router";

// Define the Job interface matching backend response
interface Job {
  ID: number;
  title: string;
  description: string;
  amount_offer: number;
  status: string;
  CreatedAt: string;
  Student?: {
    User?: {
      first_name: string;
      middle_name: string;
      last_name: string;
    };
  };
}

interface PostListContainerProps {
  jobs: Job[];
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
  onMarkComplete?: (job: Job) => void;
}

export default function PostListContainer({
  jobs,
  onEdit,
  onDelete,
  onMarkComplete,
}: PostListContainerProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="w-full lg:w-[50%] p-4 text-center text-gray-500">
        No job posts yet. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[50%] space-y-4 py-4">
      {jobs.map((job) => {
        const studentName = job.Student?.User
          ? `${job.Student.User.first_name} ${job.Student.User.middle_name ? job.Student.User.middle_name + " " : ""}${job.Student.User.last_name}`
          : "Unknown Student";

        return (
          <Link
            key={job.ID}
            to={`/student/view_job/${job.ID}`}
            className="block border rounded-lg p-4 shadow-sm relative hover:bg-red-950 group ease-in-out duration-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg pr-2 text-gray-900 group-hover:text-white">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-white">
                  Posted by: {studentName}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-md hover:bg-white/20 group-hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Post options"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-500 group-hover:text-white" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(job);
                    }}
                    className="cursor-pointer"
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(job);
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                  {job.status !== "completed" && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkComplete?.(job);
                      }}
                      className="cursor-pointer"
                    >
                      Mark as Completed
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-gray-600 mt-1 group-hover:text-white">
              {job.description}
            </p>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span className="group-hover:text-white">
                ₱{job.amount_offer}
              </span>
              <span className="group-hover:text-white">
                Status: {job.status}
              </span>
              <span className="group-hover:text-white">
                Posted: {new Date(job.CreatedAt).toLocaleDateString()}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
