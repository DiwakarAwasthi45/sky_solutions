import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { verifyAdmin, authErrorResponse, sanitizeError, handleUpload } from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET ALL TESTIMONIALS
export async function GET() {
  try {
    await dbConnect();

    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: testimonials.length, data: testimonials },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// CREATE TESTIMONIAL
export async function POST(request) {
  try {
    await verifyAdmin(request);
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    await dbConnect();

    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim();
    const course = formData.get("course")?.toString().trim();
    const message = formData.get("message")?.toString().trim();
    const ratingRaw = formData.get("rating");
    const statusRaw = formData.get("status");
    const image = formData.get("image");

    const rating = Number(ratingRaw);
    const status = statusRaw === "true" || statusRaw === true || statusRaw === "1";

    if (!name || !course || !message || !ratingRaw || !(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    if (name.length > 100 || course.length > 200) {
      return NextResponse.json(
        { success: false, message: "Name or course too long." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { success: false, message: "Message too long." },
        { status: 400 }
      );
    }

    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    const imageUrl = await handleUpload(image, "testimonials");

    const testimonial = await Testimonial.create({
      name, course, message, image: imageUrl, rating, status,
    });

    return NextResponse.json(
      { success: true, message: "Testimonial created successfully", data: testimonial },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
