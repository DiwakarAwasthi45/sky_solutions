import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

// GET SINGLE TESTIMONIAL
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid testimonial id",
        },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: testimonial,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// UPDATE TESTIMONIAL
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid testimonial id",
        },
        { status: 400 }
      );
    }

    const oldTestimonial = await Testimonial.findById(id);

    if (!oldTestimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
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

    const rating = Number(ratingRaw);
    const status =
      statusRaw === "true" || statusRaw === true || statusRaw === "1";

    if (!name || !course || !message || !ratingRaw) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be filled.",
        },
        { status: 400 }
      );
    }

    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5.",
        },
        { status: 400 }
      );
    }

    let imageUrl = oldTestimonial.image;

    if (image instanceof File && image.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.promises.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
      const uploadPath = path.join(uploadDir, fileName);

      const bytes = await image.arrayBuffer();
      await fs.promises.writeFile(uploadPath, Buffer.from(bytes));

      imageUrl = `/uploads/${fileName}`;

      if (oldTestimonial.image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          oldTestimonial.image
        );
        if (fs.existsSync(oldImagePath)) {
          await fs.promises.unlink(oldImagePath);
        }
      }
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      {
        name,
        course,
        message,
        image: imageUrl,
        rating,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial updated successfully",
        data: updatedTestimonial,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE TESTIMONIAL
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid testimonial id",
        },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        { status: 404 }
      );
    }

    if (testimonial.image) {
      const imagePath = path.join(process.cwd(), "public", testimonial.image);
      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath);
      }
    }

    await Testimonial.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}