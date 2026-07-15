import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import { verifyAdmin, authErrorResponse, sanitizeError, handleUpload } from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET ALL GALLERY
export async function GET() {
  try {
    await dbConnect();

    const galleries = await Gallery.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: galleries.length, data: galleries },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// CREATE GALLERY
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
    const statusRaw = formData.get("status");
    const image = formData.get("image");

    const status = statusRaw === "true" || statusRaw === true || statusRaw === "1";

    if (!title || !(image instanceof File) || image.size === 0) {
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

    const imageUrl = await handleUpload(image, "gallery");

    const gallery = await Gallery.create({ title, image: imageUrl, status });

    return NextResponse.json(
      { success: true, message: "Gallery created successfully", data: gallery },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
