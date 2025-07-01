import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";

const JobsPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	const { q, type, location } = await searchParams;
	const jobs = await prisma.job.findMany({
		where: {
			AND: [
				q
					? {
							OR: [
								{
									tittle: {
										contains: q as string,
										mode: "insensitive",
									},
								},
								{
									company: {
										contains: q as string,
										mode: "insensitive",
									},
								},
								{
									location: {
										contains: q as string,
										mode: "insensitive",
									},
								},
								{
									description: {
										contains: q as string,
										mode: "insensitive",
									},
								},
							],
					  }
					: {},
				type ? { type: type as string } : {},
				location ? { location: location as string } : {},
			],
		},
		orderBy: {
			tittle: "desc", // Replace 'tittle' with the correct field name from your Prisma Job model, e.g., 'createdAt' if you want to order by creation date
		},
		include: {
			postedBy: true,
		},
	});
	return (
		<div className="space-y-8">
			<div className="bg-white p-6 rounded-lg shadow-sm">
				<h1 className="text-2xl font-bold text-gray-900 mb-6">
					Find Jobs
				</h1>
				<form className="grid gap-4 md:grid-cols-3">
					<input
						type="text"
						name="q"
						placeholder="Search jobs..."
						className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
					/>
					<select
						name="type"
						className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
					>
						<option value="">All Types</option>
						<option value="internship">Internship</option>
						<option value="full-time">Full Time</option>
						<option value="part-time">Part Time</option>
						<option value="contract">Contract</option>
					</select>
					<input
						type="text"
						name="location"
						placeholder="Location"
						className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
					/>

					<button
						type="submit"
						className="md:col-span-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
					>
						Search
					</button>
				</form>

				<div className="grid gap-6">
					{jobs.map((job) => (
						<div
							key={job.id}
							className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="flex justify-between items-start">
								<div>
									<h2 className="text-xl font-semi-bold text-gray-900 mb-2">
										{job.tittle}
									</h2>
									<p className="text-gray-600 mb-2">
										{job.company}
									</p>
									<div className="flex items-center text-sm text-gray-500 mb-4">
										<span className="mr-4">
											{job.location}
										</span>
										<span>{job.type}</span>
									</div>
									<p className="text-gray-600 mb-4 line-clamp-2">
										{job.description}
									</p>
								</div>
								{job.salary && (
									<>
										<span className="text-lg font-semibold text-gray-900">
											{job.salary}
										</span>
									</>
								)}
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-500">
									Posted by {job.postedBy.name}
								</span>
								<Link
									href={`/jobs/${job.id}`}
									className="text-indigo-600 hover:text-indigo-700 font-medium"
								>
									View Details →{" "}
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default JobsPage;
