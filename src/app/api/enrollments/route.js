import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { verifyAdmin, authErrorResponse, sanitizeError, pick } from "@/lib/api-helpers";

const ENROLLMENT_FIELDS = [
  "fullName", "email", "phone", "dob", "gender", "course", "batch",
  "address", "message", "paymentStatus", "enrollmentStatus",
];

// GET: Fetch all enrollments (admin only)
export async function GET(request) {
  try {
    await verifyAdmin(request);
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    await dbConnect();

    const enrollments = await Enrollment.find()
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// POST: Create a new enrollment
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const sanitized = pick(body, ENROLLMENT_FIELDS);

    const enrollment = await Enrollment.create(sanitized);

    return NextResponse.json(
      { success: true, message: "Enrollment created successfully", data: enrollment },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
