import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Upcoming from "@/models/Upcoming";
import { verifyAdmin, authErrorResponse, sanitizeError, pick } from "@/lib/api-helpers";

const UPCOMING_FIELDS = [
  "title", "description", "date", "time", "venue",
  "course", "instructor", "maxSeats", "status", "image",
];

// GET: Fetch all upcoming events
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

    const body = await request.json();
    const sanitized = pick(body, UPCOMING_FIELDS);

    if (!sanitized.title) {
      return NextResponse.json(
        { success: false, message: "Title is required." },
        { status: 400 }
      );
    }

    const upcomingEvent = await Upcoming.create(sanitized);

    return NextResponse.json(
      { success: true, message: "Upcoming event created successfully", data: upcomingEvent },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
