import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Facility from "@/models/Facility";
import { verifyAdmin, authErrorResponse, sanitizeError, handleUpload } from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET ALL FACILITY
export async function GET() {
  try {
    await dbConnect();

    const facilities = await Facility.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: facilities.length, data: facilities },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// CREATE FACILITY
export async function POST(request) {
  try {
    await verifyAdmin(request);
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    await dbConnect();

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const statusRaw = formData.get("status");
    const image = formData.get("image");

    const status = statusRaw === "true" || statusRaw === true || statusRaw === "1";

    if (!title || !description || !(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { success: false, message: "Title too long." },
        { status: 400 }
      );
    }

    if (description.length > 5000) {
      return NextResponse.json(
        { success: false, message: "Description too long." },
        { status: 400 }
      );
    }

    const imageUrl = await handleUpload(image, "facilities");

    const facility = await Facility.create({
      title, description, image: imageUrl, status,
    });

    return NextResponse.json(
      { success: true, message: "Facility created successfully", data: facility },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
