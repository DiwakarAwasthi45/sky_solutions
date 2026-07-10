import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";

// GET Single Enrollment
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Enrollment ID",
        },
        { status: 400 }
      );
    }

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          message: "Enrollment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// UPDATE Enrollment
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Enrollment ID",
        },
        { status: 400 }
      );
    }

    const enrollment = await Enrollment.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          message: "Enrollment not found",
        },
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
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE Enrollment
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Enrollment ID",
        },
        { status: 400 }
      );
    }

    const enrollment = await Enrollment.findByIdAndDelete(id);

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          message: "Enrollment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enrollment deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}