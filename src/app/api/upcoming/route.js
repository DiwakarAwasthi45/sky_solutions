import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Upcoming from "@/models/Upcoming";

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
      {
        success: false,
        message: "Failed to fetch upcoming events",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new upcoming event
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const upcomingEvent = await Upcoming.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Upcoming event created successfully",
        data: upcomingEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create upcoming event",
        error: error.message,
      },
      { status: 500 }
    );
  }
}