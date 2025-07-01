// app/api/jobs/route.ts
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let company: string | undefined;
  try {
    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    company = body.company;
    const { tittle, location, description, type, salary } = body;

    // Validate required fields
    if (!company || !location || !description || !type) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: company, location, description, and type are required",
        },
        { status: 400 }
      );
    }

    // Create the job
    const job = await prisma.job.create({
      data: {
        tittle: body.tittle || null, // Optional field
        company,
        location,
        description,
        type,
        salary: salary || null, // Optional field
        postedBy: {
          connect: {
            id: session.user.id, // Use session user ID
          },
        },
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error: any) {
    console.error("Error Creating Job:", error);

    // Handle Prisma unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: `A job with the company name "${company ?? ""}" already exists` },
        { status: 400 }
      );
    }

    // Handle Prisma validation errors
    if (error.name === "PrismaClientValidationError") {
      return NextResponse.json(
        { error: "Invalid data provided. Please check your input." },
        { status: 400 }
      );
    }

    // Handle database connection or other Prisma errors
    if (error.name === "PrismaClientInitializationError") {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}