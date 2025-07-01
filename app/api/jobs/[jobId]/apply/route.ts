import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
    const session = await auth();

    if (!session?.user || !session.user.id) return NextResponse.redirect(new URL("/auth/signin", request.url));

    try {
        const { jobId } = await params;
        const job = await prisma.job.findUnique({
            where: {
                id: jobId
            }
        })

        if (!job) {
            return new NextResponse("Job not found", { status: 404 })
        }

        const existingApplication = await prisma.application.findFirst({
            where: {
                jobId: job.id,
                userId: session.user.id
            }
        })

        if (existingApplication) {
            return new NextResponse("You have already applied for this job", { status: 400 })
        }

        const application = await prisma.application.create({
            data: {
                jobId: job.id,
                userId: session.user.id,
                status: "PENDING"
            }
        })

        return NextResponse.json(application)
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}