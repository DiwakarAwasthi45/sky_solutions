import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

// GET ALL TESTIMONIALS
export async function GET() {
  try {
    await dbConnect();

    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: testimonials.length,
        data: testimonials,
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

// CREATE TESTIMONIAL
export async function POST(request) {
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
    const status =
      statusRaw === "true" || statusRaw === true || statusRaw === "1";

    if (
      !name ||
      !course ||
      !message ||
      !ratingRaw ||
      !(image instanceof File) ||
      image.size === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
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

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
    const uploadPath = path.join(uploadDir, fileName);

    const bytes = await image.arrayBuffer();
    await fs.promises.writeFile(uploadPath, Buffer.from(bytes));

    const imageUrl = `/uploads/${fileName}`;

    const testimonial = await Testimonial.create({
      name,
      course,
      message,
      image: imageUrl,
      rating,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial created successfully",
        data: testimonial,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}