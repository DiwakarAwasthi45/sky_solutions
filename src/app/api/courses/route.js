import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    const courses = await Course.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: courses.length,
        data: courses,
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

export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const durationRaw = formData.get("duration");
    const level = formData.get("level")?.toString().trim();
    const priceRaw = formData.get("price");
    const status = formData.get("status")?.toString().trim() || "Active";
    const syllabusRaw = formData.get("syllabus");
    const image = formData.get("image");

    const duration = Number(durationRaw);
    const price = Number(priceRaw);

    let syllabus = [];
    try {
      syllabus = JSON.parse(syllabusRaw?.toString() || "[]");
    } catch {
      syllabus = [];
    }

    if (
      !title ||
      !slug ||
      !description ||
      !durationRaw ||
      !level ||
      !priceRaw ||
      !image ||
      !(image instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    if (Number.isNaN(duration) || Number.isNaN(price)) {
      return NextResponse.json(
        {
          success: false,
          message: "Duration and price must be valid numbers.",
        },
        { status: 400 }
      );
    }

    const existingCourse = await Course.findOne({ slug });

    if (existingCourse) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists.",
        },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const safeFileName = image.name.replace(/\s+/g, "-");
    const fileName = `${Date.now()}-${safeFileName}`;
    const uploadPath = path.join(uploadDir, fileName);

    const bytes = await image.arrayBuffer();
    await fs.promises.writeFile(uploadPath, Buffer.from(bytes));

    const imageUrl = `/uploads/${fileName}`;

    const course = await Course.create({
      title,
      slug,
      image: imageUrl,
      description,
      duration,
      level,
      price,
      status,
      syllabus,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully.",
        data: course,
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