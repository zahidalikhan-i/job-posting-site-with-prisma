"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function PostJobPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to sign-in if not authenticated
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      tittle: formData.get("tittle") as string,
      company: formData.get("company") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as string,
      salary: formData.get("salary") as string,
    };

    // Client-side validation
    if (!data.company) {
      setError("Company is required");
      setIsSubmitting(false);
      return;
    }
    if (!data.location) {
      setError("Location is required");
      setIsSubmitting(false);
      return;
    }
    if (!data.description) {
      setError("Description is required");
      setIsSubmitting(false);
      return;
    }
    if (!data.type) {
      setError("Job type is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to post job");
      }

      // Redirect to dashboard or jobs page on success
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error posting job:", error);
      setError(error.message || "An error occurred while posting the job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a Job</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="tittle"
            className="block text-sm font-medium text-gray-700"
          >
            Job Title
          </label>
          <input
            type="text"
            id="tittle"
            name="tittle"
            className="text-gray-900 mt-1 block w-full rounded-md px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            className="text-gray-900 mt-1 block w-full rounded-md px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            className="text-gray-900 mt-1 block w-full rounded-md px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Job Type
          </label>
          <select
            id="type"
            name="type"
            required
            className="text-gray-900 mt-1 block w-full rounded-md px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a Type</option>
            <option value="internship">Internship</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="text-gray-900 mt-1 block w-full rounded-md px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700"
          >
            Salary
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            placeholder="e.g., $80,000 - $100,000"
            className="text-gray-900 mt-1 block w-full rounded-md px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}

export default PostJobPage;