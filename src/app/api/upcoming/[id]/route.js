import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Upcoming from "@/models/Upcoming";

// GET Single Upcoming Event
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Upcoming Event ID",
        },
        { status: 400 }
      );
    }

    const upcomingEvent = await Upcoming.findById(id);

    if (!upcomingEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Upcoming event not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: upcomingEvent,
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

// UPDATE Upcoming Event
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Upcoming Event ID",
        },
        { status: 400 }
      );
    }

    const upcomingEvent = await Upcoming.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!upcomingEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Upcoming event not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Upcoming event updated successfully",
      data: upcomingEvent,
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

// DELETE Upcoming Event
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Upcoming Event ID",
        },
        { status: 400 }
      );
    }

    const upcomingEvent = await Upcoming.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
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