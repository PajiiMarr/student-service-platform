import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// Define the Job interface matching backend response
interface Job {
  ID: number;
  title: string;
  description: string;
  amount_offer: number;
  status: string;
  CreatedAt: string;
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
    <div className="w-full lg:w-[50%] space-y-4">
      <h2 className="text-xl font-semibold">All Job Posts</h2>
      {jobs.map((job) => (
        <div key={job.ID} className="border rounded-lg p-4 shadow-sm relative">
          {/* Header row with title and dropdown trigger */}
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg pr-2">{job.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  aria-label="Post options"
                >
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onEdit?.(job)}
                  className="cursor-pointer"
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(job)}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  Delete
                </DropdownMenuItem>
                {job.status !== "completed" && (
                  <DropdownMenuItem
                    onClick={() => onMarkComplete?.(job)}
                    className="cursor-pointer"
                  >
                    Mark as Completed
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-gray-600 mt-1">{job.description}</p>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>₱{job.amount_offer}</span>
            <span>Status: {job.status}</span>
            <span>Posted: {new Date(job.CreatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}