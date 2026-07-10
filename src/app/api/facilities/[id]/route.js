import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Facility from "@/models/Facility";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

export const runtime = "nodejs";

// GET SINGLE FACILITY
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid facility id",
        },
        { status: 400 }
      );
    }

    const facility = await Facility.findById(id);

    if (!facility) {
      return NextResponse.json(
        {
          success: false,
          message: "Facility not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: facility,
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

// UPDATE FACILITY
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid facility id",
        },
        { status: 400 }
      );
    }

    const oldFacility = await Facility.findById(id);

    if (!oldFacility) {
      return NextResponse.json(
        {
          success: false,
          message: "Facility not found",
        },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const statusRaw = formData.get("status");
    const image = formData.get("image");

    const status =
      statusRaw === "true" || statusRaw === true || statusRaw === "1";

    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and description are required.",
        },
        { status: 400 }
      );
    }

    let imageUrl = oldFacility.image;

    if (image instanceof File && image.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.promises.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
      const uploadPath = path.join(uploadDir, fileName);

      const bytes = await image.arrayBuffer();
      await fs.promises.writeFile(uploadPath, Buffer.from(bytes));

      imageUrl = `/uploads/${fileName}`;

      if (oldFacility.image) {
        const oldImagePath = path.join(process.cwd(), "public", oldFacility.image);
        if (fs.existsSync(oldImagePath)) {
          await fs.promises.unlink(oldImagePath);
        }
      }
    }

    const updatedFacility = await Facility.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
        image: imageUrl,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Facility updated successfully",
        data: updatedFacility,
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

// DELETE FACILITY
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid facility id",
        },
        { status: 400 }
      );
    }

    const facility = await Facility.findById(id);

    if (!facility) {
      return NextResponse.json(
        {
          success: false,
          message: "Facility not found",
        },
        { status: 404 }
      );
    }

    if (facility.image) {
      const imagePath = path.join(process.cwd(), "public", facility.image);
      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath);
      }
    }

    await Facility.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Facility deleted successfully",
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