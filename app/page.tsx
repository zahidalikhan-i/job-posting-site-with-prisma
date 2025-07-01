// app/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default async function Home() {
  // Fetch all jobs
  const jobs = await prisma.job.findMany({
    where: {}, // Add filters if needed
    orderBy: {
      postAt: "desc", // Sort by most recent
    },
    include: {
      postedBy: true, // Include the user who posted the job
      _count: {
        select: { applications: true }, // Count applications for each job
      },
    },
  });

  // Get the current session (optional, for user-specific features)
  const session = await auth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
        {session?.user ? (
          <Link
            href="/jobs/post"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Post a Job
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Sign In to Post a Job
          </Link>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {jobs.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">
            No jobs available at the moment.
          </p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-1">
                    {job.tittle || "Untitled"}
                  </h2>
                  <p className="text-gray-900 mb-2">{job.company}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{job.location}</span>
                    <span className="mx-2"> | </span>
                    <span>{job.type}</span>
                    <span className="mx-2"> | </span>
                    <span>
                      Posted{" "}
                      {formatDistanceToNow(new Date(job.postAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Description:</strong> {job.description}
                  </p>
                  {job.salary && (
                    <p className="text-sm text-gray-500 mt-1">
                      <strong>Salary:</strong> {job.salary}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Posted by:</strong> {job.postedBy?.name || "Unknown"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.6 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {job._count.applications} applications
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  View Job
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}