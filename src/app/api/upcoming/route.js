import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Upcoming from "@/models/Upcoming";
import { verifyAdmin, authErrorResponse, sanitizeError, handleUpload } from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET: Fetch all upcoming events (active first, then by date)
export async function GET() {
  try {
    await dbConnect();

    const upcomingEvents = await Upcoming.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: upcomingEvents.length,
      data: upcomingEvents,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// POST: Create a new upcoming event
export async function POST(request) {
  try {
    await verifyAdmin(request);
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    await dbConnect();

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || "";
    const date = formData.get("date")?.toString().trim();
    const time = formData.get("time")?.toString().trim();
    const venue = formData.get("venue")?.toString().trim() || "";
    const course = formData.get("course")?.toString().trim() || "";
    const instructor = formData.get("instructor")?.toString().trim() || "";
    const status = formData.get("status")?.toString().trim() || "Open";
    const isActive = formData.get("isActive") === "true";
    const maxSeats = Number(formData.get("maxSeats")) || 20;
    const seatsFilled = Number(formData.get("seatsFilled")) || 0;
    const image = formData.get("image");

    if (!title || !date || !time) {
      return NextResponse.json(
        { success: false, message: "Title, date, and time are required." },
        { status: 400 }
      );
    }

    let imageDataUrl = "";
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

    const upcomingEvent = await Upcoming.create({
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
    });

    return NextResponse.json(
      { success: true, message: "Batch created successfully", data: upcomingEvent },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
