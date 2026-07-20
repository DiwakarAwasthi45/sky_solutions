import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import { verifyAdmin, authErrorResponse, sanitizeError, handleUpload } from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET ALL SERVICES
export async function GET() {
  try {
    await dbConnect();

    const services = await Service.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: services.length, data: services },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// CREATE SERVICE
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
    const slug = formData.get("slug")?.toString().trim();
    const shortDescription = formData.get("shortDescription")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const featuresRaw = formData.get("features");
    let features = [];
    try {
      features = JSON.parse(featuresRaw?.toString() || "[]");
    } catch {
      features = [];
    }
    if (!Array.isArray(features)) features = [];
    features = features.filter((f) => typeof f === "string" && f.trim()).map((f) => f.trim());
    const statusRaw = formData.get("status");
    const featuredRaw = formData.get("featured");
    const image = formData.get("image");

    const status = statusRaw === "true" || statusRaw === true || statusRaw === "1";
    const featured = featuredRaw === "true" || featuredRaw === true || featuredRaw === "1";

    if (
      !title || !slug || !shortDescription || !description ||
      !features.length || !(image instanceof File) || image.size === 0
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    if (title.length > 200 || slug.length > 100) {
      return NextResponse.json(
        { success: false, message: "Title or slug too long." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        { success: false, message: "Slug must be lowercase alphanumeric with hyphens." },
        { status: 400 }
      );
    }

    const existing = await Service.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Slug already exists." },
        { status: 400 }
      );
    }

    const imageUrl = await handleUpload(image, "services");

    const service = await Service.create({
      title, slug, image: imageUrl, shortDescription,
      description, features, status, featured,
    });

    return NextResponse.json(
      { success: true, message: "Service created successfully", data: service },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
