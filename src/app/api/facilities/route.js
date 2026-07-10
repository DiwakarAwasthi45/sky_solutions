import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Facility from "@/models/Facility";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

export const runtime = "nodejs";

// GET ALL FACILITY
export async function GET() {
  try {
    await dbConnect();

    const facilities = await Facility.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: facilities.length,
        data: facilities,
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

// CREATE FACILITY
export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const statusRaw = formData.get("status");
    const image = formData.get("image");

    const status =
      statusRaw === "true" || statusRaw === true || statusRaw === "1";

    if (
      !title ||
      !description ||
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

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
    const uploadPath = path.join(uploadDir, fileName);

    const bytes = await image.arrayBuffer();
    await fs.promises.writeFile(uploadPath, Buffer.from(bytes));

    const imageUrl = `/uploads/${fileName}`;

    const facility = await Facility.create({
      title,
      description,
      image: imageUrl,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Facility created successfully",
        data: facility,
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