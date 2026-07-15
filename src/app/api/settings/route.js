import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Setting from "@/models/Setting";
import { verifyAdmin, authErrorResponse, sanitizeError, pick } from "@/lib/api-helpers";

const SETTING_FIELDS = [
  "siteName", "logo", "description", "contactEmail", "contactPhone",
  "address", "socialLinks", "seo", "favicon", "footerText",
  "primaryColor", "secondaryColor",
];

// GET Website Settings
export async function GET() {
  try {
    await dbConnect();

    const setting = await Setting.findOne();

    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// POST Create Settings (Only Once)
export async function POST(request) {
  try {
    await verifyAdmin(request);
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    await dbConnect();

    const body = await request.json();
    const sanitized = pick(body, SETTING_FIELDS);

    const existing = await Setting.findOne();

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Settings already exist. Use PUT to update." },
        { status: 400 }
      );
    }

    const setting = await Setting.create(sanitized);

    return NextResponse.json(
      { success: true, message: "Settings created successfully.", data: setting },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
