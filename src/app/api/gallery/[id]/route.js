import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import { verifyAdmin, authErrorResponse, sanitizeError, handleUpload, deleteUploadFile } from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET SINGLE GALLERY
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid gallery id." },
        { status: 400 }
      );
    }

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gallery }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// UPDATE GALLERY
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
        { success: false, message: "Invalid gallery id." },
        { status: 400 }
      );
    }

    const existing = await Gallery.findById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found." },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const statusRaw = formData.get("status");
    const image = formData.get("image");

    const updates = {};

    if (title) {
      if (title.length > 200) {
        return NextResponse.json(
          { success: false, message: "Title too long." },
          { status: 400 }
        );
      }
      updates.title = title;
    }

    if (statusRaw !== null) {
      updates.status = statusRaw === "true" || statusRaw === true || statusRaw === "1";
    }

    if (image instanceof File && image.size > 0) {
      const imageUrl = await handleUpload(image, "gallery");
      await deleteUploadFile(existing.image);
      updates.image = imageUrl;
    }

    const gallery = await Gallery.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      { success: true, message: "Gallery updated successfully", data: gallery },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// DELETE GALLERY
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
        { success: false, message: "Invalid gallery id." },
        { status: 400 }
      );
    }

    const gallery = await Gallery.findByIdAndDelete(id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found." },
        { status: 404 }
      );
    }

    if (gallery.image) {
      await deleteUploadFile(gallery.image);
    }

    return NextResponse.json(
      { success: true, message: "Gallery deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
