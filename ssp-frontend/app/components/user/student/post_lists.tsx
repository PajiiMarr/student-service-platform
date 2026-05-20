// Define the Job interface matching backend response
// Adjust field names if your API uses different casing (e.g., ID, CreatedAt)
interface Job {
  ID: number;           // or id
  title: string;
  description: string;
  amount_offer: number;
  status: string;
  CreatedAt: string;    // or created_at
}

interface PostListContainerProps {
  jobs: Job[];
}

export default function PostListContainer({ jobs }: PostListContainerProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="w-full lg:w-[50%] p-4 text-center text-gray-500">
        No job posts yet. Be the first to create one! test commit
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[50%] space-y-4">
      <h2 className="text-xl font-semibold">All Job Posts</h2>
      {jobs.map((job) => (
        <div key={job.ID} className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-lg">{job.title}</h3>
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