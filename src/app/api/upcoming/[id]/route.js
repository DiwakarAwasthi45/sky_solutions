import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Upcoming from "@/models/Upcoming";

// ---- Helpers ----
function errorResponse(message, status) {
  return NextResponse.json({ success: false, message }, { status });
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function getErrorMessage(error) {
  return process.env.NODE_ENV === "development"
    ? error.message
    : "Something went wrong";
}

// GET Single Upcoming Event
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!isValidId(id)) {
      return errorResponse("Invalid Upcoming Event ID", 400);
    }

    const upcomingEvent = await Upcoming.findById(id);

    if (!upcomingEvent) {
      return errorResponse("Upcoming event not found", 404);
    }

    return NextResponse.json({
      success: true,
      data: upcomingEvent,
    });
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500);
  }
}

// UPDATE Upcoming Event
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    if (!isValidId(id)) {
      return errorResponse("Invalid Upcoming Event ID", 400);
    }

    // Prevent overwriting immutable fields
    delete body._id;
    delete body.__v;

    const upcomingEvent = await Upcoming.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!upcomingEvent) {
      return errorResponse("Upcoming event not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: "Upcoming event updated successfully",
      data: upcomingEvent,
    });
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500);
  }
}

// DELETE Upcoming Event
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!isValidId(id)) {
      return errorResponse("Invalid Upcoming Event ID", 400);
    }

    const upcomingEvent = await Upcoming.findByIdAndDelete(id);

    if (!upcomingEvent) {
      return errorResponse("Upcoming event not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: "Upcoming event deleted successfully",
    });
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500);
  }
}