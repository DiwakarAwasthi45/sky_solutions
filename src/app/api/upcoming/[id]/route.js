import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Upcoming from "@/models/Upcoming";
import { verifyAdmin, authErrorResponse, sanitizeError, handleUpload } from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET Single Upcoming Event
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Upcoming Event ID" },
        { status: 400 }
      );
    }

    const upcomingEvent = await Upcoming.findById(id);

    if (!upcomingEvent) {
      return NextResponse.json(
        { success: false, message: "Upcoming event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: upcomingEvent });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// UPDATE Upcoming Event
export async function PUT(request, { params }) {
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
        { success: false, message: "Invalid Upcoming Event ID" },
        { status: 400 }
      );
    }

    const existing = await Upcoming.findById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Upcoming event not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim() || existing.title;
    const description = formData.get("description")?.toString().trim() ?? existing.description;
    const date = formData.get("date")?.toString().trim() || existing.date;
    const time = formData.get("time")?.toString().trim() || existing.time;
    const venue = formData.get("venue")?.toString().trim() ?? existing.venue;
    const course = formData.get("course")?.toString().trim() ?? existing.course;
    const instructor = formData.get("instructor")?.toString().trim() ?? existing.instructor;
    const status = formData.get("status")?.toString().trim() || existing.status;
    const isActiveRaw = formData.get("isActive");
    const isActive =
      isActiveRaw === null ? existing.isActive : isActiveRaw === "true";
    const maxSeats = formData.get("maxSeats") ? Number(formData.get("maxSeats")) : existing.maxSeats;
    const seatsFilled = formData.get("seatsFilled") ? Number(formData.get("seatsFilled")) : existing.seatsFilled;
    const image = formData.get("image");

    let imageDataUrl = existing.image || "";
    if (image && image.size > 0) {
      try {
        imageDataUrl = await handleUpload(image, "upcoming");
      } catch (uploadError) {
        return NextResponse.json(
          { success: false, message: uploadError.message },
          { status: 400 }
        );
      }
    }

    const upcomingEvent = await Upcoming.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date,
        time,
        venue,
        course,
        instructor,
        maxSeats,
        seatsFilled,
        status,
        isActive,
        image: imageDataUrl,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Batch updated successfully",
      data: upcomingEvent,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// DELETE Upcoming Event
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
        { success: false, message: "Invalid Upcoming Event ID" },
        { status: 400 }
      );
    }

    const upcomingEvent = await Upcoming.findByIdAndDelete(id);

    if (!upcomingEvent) {
      return NextResponse.json(
        { success: false, message: "Upcoming event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Upcoming event deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
