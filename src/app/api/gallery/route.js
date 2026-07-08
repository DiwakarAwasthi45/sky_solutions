import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";

// GET: Fetch all galleries
export async function GET() {
  try {
    await dbConnect();

    const galleries = await Gallery.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: galleries.length,
      data: galleries,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch galleries",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new gallery
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const gallery = await Gallery.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Gallery created successfully",
        data: gallery,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create gallery",
        error: error.message,
      },
      { status: 500 }
    );
  }
}