import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";

// GET: Fetch all enrollments
export async function GET() {
  try {
    await dbConnect();

    const enrollments = await Enrollment.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch enrollments",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new enrollment
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const enrollment = await Enrollment.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Enrollment created successfully",
        data: enrollment,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create enrollment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}