import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Upcoming from "@/models/Upcoming";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(request) {
  try {
    const rlKey = getRateLimitKey(request, "reserve-seat");
    const { allowed, resetMs } = rateLimit({ key: rlKey, limit: 5, windowMs: 60 * 60 * 1000 });

    if (!allowed) {
      return NextResponse.json(
        { success: false, message: `Too many reservation attempts. Try again in ${Math.ceil(resetMs / 60000)} minutes.` },
        { status: 429 }
      );
    }

    const { upcomingId } = await request.json();

    if (!upcomingId || !mongoose.Types.ObjectId.isValid(upcomingId)) {
      return NextResponse.json(
        { success: false, message: "Invalid class id." },
        { status: 400 }
      );
    }

    await dbConnect();

    const upcoming = await Upcoming.findById(upcomingId);

    if (!upcoming || !upcoming.isActive) {
      return NextResponse.json(
        { success: false, message: "Class not found." },
        { status: 404 }
      );
    }

    if (upcoming.status === "Admission Closed" || upcoming.status === "Completed") {
      return NextResponse.json(
        { success: false, message: "Admission is closed for this batch." },
        { status: 400 }
      );
    }

    if (upcoming.seatsFilled >= upcoming.maxSeats) {
      return NextResponse.json(
        { success: false, message: "Sorry, this batch is already full." },
        { status: 400 }
      );
    }

    upcoming.seatsFilled += 1;

    if (upcoming.seatsFilled >= upcoming.maxSeats) {
      upcoming.status = "Seats Full";
    } else if (upcoming.maxSeats - upcoming.seatsFilled <= 3) {
      upcoming.status = "Few Seats Left";
    }

    await upcoming.save();

    return NextResponse.json(
      {
        success: true,
        message: "Seat reserved! Complete your enrollment to confirm.",
        data: {
          seatsFilled: upcoming.seatsFilled,
          seatsLeft: upcoming.maxSeats - upcoming.seatsFilled,
          status: upcoming.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
