import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { request } from "http";
import Link from "next/link";
import { NextResponse } from "next/server";
import React from "react";

const Dashboard = async () => {
	const session = await auth();

	if (!session?.user?.id)
		return NextResponse.redirect(new URL("/auth/signin"));

	const [applications, postedJobs] = await Promise.all([
		// Application Query
		prisma.application.findMany({
			where: {
				userId: session.user.id,
			},
			include: {
				job: {
					include: {
						postedBy: true,
					},
				},
			},
			orderBy: {
				appliedAt: "desc",
			},
		}),

		// Jobs Query
		prisma.job.findMany({
			where: {
				postedById: session.user.id,
			},
			include: {
				_count: {
					select: {
						applications: true,
					},
				},
			},
			orderBy: {
				postAt: "desc",
			},
		}),
	]);
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
			<div className="grid gap-8 md:grid-cols-2">
				<div>
					<div className="flex justify-between-items-center mb-6">
						<h2 className="text-xl font-semibold text-gray-900">
							Posted Jobs
						</h2>
						<Link
							href="/jobs/post
                    "
							className="text-indigo-600 hover:text-indigo-700 font-medium"
						>
							Post New Job
						</Link>
					</div>
					<div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
						{postedJobs.length === 0 ? (
							<p className="p-6 text-gray-500 text-center">
								You haven't posted any jobs yet.
							</p>
						) : (
							postedJobs.map((job) => {
								const typedJob = job as typeof job & { _count: { applications: number } };
								return (
									<div key={typedJob.id} className="p-6">
										<div className="flex justify-between items-start">
											<div>
												<h3 className="text-lg font-medium text-gray-800 mb-1">
													{typedJob.tittle}
												</h3>
												<p className="text-gray-900 mb-2">
													{typedJob.company}
												</p>
												<div className="flex items-center text-sm text-gray-500">
													<span>{typedJob.location}</span>
													<span className="mx-2">
														{" "}
														|{" "}
													</span>
													<span>{typedJob.type}</span>
													<span className="mx-2">
														{" "}
														|{" "}
													</span>
													<span>
														{formatDistanceToNow(
															new Date(typedJob.postAt),
															{
																addSuffix: true,
															}
														)}
													</span>
												</div>
											</div>
											<div className="text-right">
												<span className="inline-flex items-center px-2.5 py-0.6 rounded-full text-sm font-medium bg-indigo-100 text-indigo-300">
													{typedJob._count.applications}{" "}
													applications
												</span>
											</div>
										</div>
										<div className="mt-4 flex justify-end space-x-4">
											<Link
												href={`/jobs/${typedJob.id}`}
												className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
											>
												{" "}
												View Job
											</Link>
											<Link
												href={`/dashboard/applications/${typedJob.id}`}
												className=" text-indigo-600 hover:text-indigo-700 font-medium text-sm"
											>
												View Applications
											</Link>
										</div>
									</div>
								);
							})							
						)}
					</div>
				</div>
				<div>
					<h2 className="text-xl font-semibold text-gray-900 mb-6">
						Your Applications
					</h2>
					<div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200"></div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
