import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/db";
import Facility from "@/models/Facility";
import { verifyAdmin, authErrorResponse, sanitizeError, handleUpload, deleteUploadFile } from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET SINGLE FACILITY
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid facility id." },
        { status: 400 }
      );
    }

    const facility = await Facility.findById(id);

    if (!facility) {
      return NextResponse.json(
        { success: false, message: "Facility not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: facility }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// UPDATE FACILITY
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
        { success: false, message: "Invalid facility id." },
        { status: 400 }
      );
    }

    const existing = await Facility.findById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Facility not found." },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
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
    if (description !== undefined) {
      if (description.length > 5000) {
        return NextResponse.json(
          { success: false, message: "Description too long." },
          { status: 400 }
        );
      }
      updates.description = description;
    }
    if (statusRaw !== null) {
      updates.status = statusRaw === "true" || statusRaw === true || statusRaw === "1";
    }

    if (image instanceof File && image.size > 0) {
      const imageUrl = await handleUpload(image, "facilities");
      await deleteUploadFile(existing.image);
      updates.image = imageUrl;
    }

    const facility = await Facility.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      { success: true, message: "Facility updated successfully", data: facility },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// DELETE FACILITY
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
        { success: false, message: "Invalid facility id." },
        { status: 400 }
      );
    }

    const facility = await Facility.findByIdAndDelete(id);

    if (!facility) {
      return NextResponse.json(
        { success: false, message: "Facility not found." },
        { status: 404 }
      );
    }

    if (facility.image) {
      await deleteUploadFile(facility.image);
    }

    return NextResponse.json(
      { success: true, message: "Facility deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
