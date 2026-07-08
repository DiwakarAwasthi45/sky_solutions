import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Facility from "@/models/Facility";

// GET: Fetch all facilities
export async function GET() {
  try {
    await dbConnect();

    const facilities = await Facility.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch facilities",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new facility
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const facility = await Facility.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Facility created successfully",
        data: facility,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create facility",
        error: error.message,
      },
      { status: 500 }
    );
  }
}