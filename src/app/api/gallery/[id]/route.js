import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

export const runtime = "nodejs";

// GET SINGLE GALLERY
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery id",
        },
        { status: 400 }
      );
    }

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: gallery,
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

// UPDATE GALLERY
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery id",
        },
        { status: 400 }
      );
    }

    const oldGallery = await Gallery.findById(id);

    if (!oldGallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery not found",
        },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const statusRaw = formData.get("status");
    const image = formData.get("image");

    const status =
      statusRaw === "true" || statusRaw === true || statusRaw === "1";

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required.",
        },
        { status: 400 }
      );
    }

    let imageUrl = oldGallery.image;

    if (image instanceof File && image.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.promises.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
      const uploadPath = path.join(uploadDir, fileName);

      const bytes = await image.arrayBuffer();
      await fs.promises.writeFile(uploadPath, Buffer.from(bytes));

      imageUrl = `/uploads/${fileName}`;

      if (oldGallery.image) {
        const oldImagePath = path.join(process.cwd(), "public", oldGallery.image);
        if (fs.existsSync(oldImagePath)) {
          await fs.promises.unlink(oldImagePath);
        }
      }
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      {
        title,
        image: imageUrl,
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
        message: "Gallery updated successfully",
        data: updatedGallery,
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

// DELETE GALLERY
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery id",
        },
        { status: 400 }
      );
    }

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery not found",
        },
        { status: 404 }
      );
    }

    if (gallery.image) {
      const imagePath = path.join(process.cwd(), "public", gallery.image);
      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath);
      }
    }

    await Gallery.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Gallery deleted successfully",
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