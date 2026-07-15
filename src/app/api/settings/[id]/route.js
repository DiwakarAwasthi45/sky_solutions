import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/db";
import Setting from "@/models/Setting";
import { verifyAdmin, authErrorResponse, sanitizeError, pick } from "@/lib/api-helpers";

const SETTING_FIELDS = [
  "siteName", "logo", "description", "contactEmail", "contactPhone",
  "address", "socialLinks", "seo", "favicon", "footerText",
  "primaryColor", "secondaryColor",
];

// GET Single Setting
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const setting = await Setting.findById(id);

    if (!setting) {
      return NextResponse.json(
        { success: false, message: "Setting not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// UPDATE Setting
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
        { success: false, message: "Invalid setting id." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const sanitized = pick(body, SETTING_FIELDS);

    const setting = await Setting.findByIdAndUpdate(id, sanitized, {
      new: true,
      runValidators: true,
    });

    if (!setting) {
      return NextResponse.json(
        { success: false, message: "Setting not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Setting updated successfully.",
      data: setting,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// DELETE Setting
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
        { success: false, message: "Invalid setting id." },
        { status: 400 }
      );
    }

    const setting = await Setting.findByIdAndDelete(id);

    if (!setting) {
      return NextResponse.json(
        { success: false, message: "Setting not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Setting deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
