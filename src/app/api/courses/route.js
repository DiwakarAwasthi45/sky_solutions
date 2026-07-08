import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

// GET: Fetch all courses
export async function GET() {
  try {
    await dbConnect();

    const courses = await Course.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch courses",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new course
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const course = await Course.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        data: course,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create course",
        error: error.message,
      },
      { status: 500 }
    );
  }
}