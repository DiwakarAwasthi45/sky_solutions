import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";

// GET: Fetch all testimonials
export async function GET() {
  try {
    await dbConnect();

    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch testimonials",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new testimonial
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const testimonial = await Testimonial.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial created successfully",
        data: testimonial,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create testimonial",
        error: error.message,
      },
      { status: 500 }
    );
  }
}