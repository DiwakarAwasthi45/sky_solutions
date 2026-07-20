import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { verifyAdmin, authErrorResponse, sanitizeError, pick } from "@/lib/api-helpers";

const ENROLLMENT_FIELDS = [
  "name", "email", "phone", "course", "courseName",
  "message", "address", "qualification", "occupation",
  "paymentMethod", "paymentStatus", "enrollmentStatus",
  "amount", "transactionId",
];

// GET Single Enrollment
export async function GET(request, { params }) {
  try {
    await verifyAdmin(request);
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Enrollment ID" },
        { status: 400 }
      );
    }

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: enrollment });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// UPDATE Enrollment
export async function PUT(request, { params }) {
  try {
    await verifyAdmin(request);
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Enrollment ID" },
        { status: 400 }
      );
    }

    const sanitized = pick(body, ENROLLMENT_FIELDS);

    const enrollment = await Enrollment.findByIdAndUpdate(id, sanitized, {
      new: true,
      runValidators: true,
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enrollment updated successfully",
      data: enrollment,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// DELETE Enrollment
export async function DELETE(request, { params }) {
  try {
    await verifyAdmin(request);
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Enrollment ID" },
        { status: 400 }
      );
    }

    const enrollment = await Enrollment.findByIdAndDelete(id);

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enrollment deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
