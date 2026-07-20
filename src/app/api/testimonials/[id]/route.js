import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { verifyAdmin, authErrorResponse, sanitizeError, handleUpload, deleteUploadFile } from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET SINGLE TESTIMONIAL
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid testimonial id." },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: testimonial }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// UPDATE TESTIMONIAL
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
        { success: false, message: "Invalid testimonial id." },
        { status: 400 }
      );
    }

    const existing = await Testimonial.findById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found." },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim();
    const course = formData.get("course")?.toString().trim();
    const message = formData.get("message")?.toString().trim();
    const ratingRaw = formData.get("rating");
    const statusRaw = formData.get("status");
    const image = formData.get("image");

    const updates = {};

    if (name) {
      if (name.length > 100) {
        return NextResponse.json(
          { success: false, message: "Name too long." },
          { status: 400 }
        );
      }
      updates.name = name;
    }
    if (course !== undefined) {
      if (course.length > 200) {
        return NextResponse.json(
          { success: false, message: "Course too long." },
          { status: 400 }
        );
      }
      updates.course = course;
    }
    if (message !== undefined) {
      if (message.length > 5000) {
        return NextResponse.json(
          { success: false, message: "Message too long." },
          { status: 400 }
        );
      }
      updates.message = message;
    }
    if (ratingRaw !== null && ratingRaw !== undefined) {
      const rating = Number(ratingRaw);
      if (Number.isNaN(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { success: false, message: "Rating must be between 1 and 5." },
          { status: 400 }
        );
      }
      updates.rating = rating;
    }
    if (statusRaw !== null) {
      updates.status = statusRaw === "true" || statusRaw === true || statusRaw === "1";
    }

    if (image instanceof File && image.size > 0) {
      const imageUrl = await handleUpload(image, "testimonials");
      await deleteUploadFile(existing.image);
      updates.image = imageUrl;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      { success: true, message: "Testimonial updated successfully", data: testimonial },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// DELETE TESTIMONIAL
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
        { success: false, message: "Invalid testimonial id." },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found." },
        { status: 404 }
      );
    }

    if (testimonial.image) {
      await deleteUploadFile(testimonial.image);
    }

    return NextResponse.json(
      { success: true, message: "Testimonial deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
