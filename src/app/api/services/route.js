import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

// GET ALL SERVICES
export async function GET() {
  try {
    await dbConnect();

    const services = await Service.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: services.length,
        data: services,
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

// CREATE SERVICE
export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim();
    const shortDescription = formData.get("shortDescription")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const features = formData.getAll("features").map((feature) => feature.toString().trim());
    const statusRaw = formData.get("status");
    const featuredRaw = formData.get("featured");
    const image = formData.get("image");

    const status = statusRaw === "true" || statusRaw === true || statusRaw === "1";
    const featured = featuredRaw === "true" || featuredRaw === true || featuredRaw === "1";

    if (
      !title ||
      !slug ||
      !shortDescription ||
      !description ||
      !features.length ||
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

    const existing = await Service.findOne({ slug });
    if (existing) {
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

    const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
    const uploadPath = path.join(uploadDir, fileName);

    const bytes = await image.arrayBuffer();
    await fs.promises.writeFile(uploadPath, Buffer.from(bytes));

    const imageUrl = `/uploads/${fileName}`;

    const service = await Service.create({
      title,
      slug,
      image: imageUrl,
      shortDescription,
      description,
      features,
      status,
      featured,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully",
        data: service,
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