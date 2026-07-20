import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import { verifyAdmin, authErrorResponse, sanitizeError, handleUpload, deleteUploadFile } from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET SINGLE SERVICE (by id or slug)
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Id or slug is required" },
        { status: 400 }
      );
    }

    let service;
    if (mongoose.Types.ObjectId.isValid(id)) {
      service = await Service.findById(id);
    }
    if (!service) {
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// UPDATE SERVICE
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
        { success: false, message: "Invalid service id" },
        { status: 400 }
      );
    }

    const oldService = await Service.findById(id);

    if (!oldService) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

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

    if (!title || !slug || !shortDescription || !description || !features.length) {
      return NextResponse.json(
        { success: false, message: "All required fields are missing." },
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

    const duplicate = await Service.findOne({ slug, _id: { $ne: id } });
    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "Slug already exists." },
        { status: 400 }
      );
    }

    let imageUrl = oldService.image;

    if (image instanceof File && image.size > 0) {
      imageUrl = await handleUpload(image, "services");
      if (oldService.image) {
        await deleteUploadFile(oldService.image);
      }
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { title, slug, shortDescription, description, features, status, featured, image: imageUrl },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, message: "Service updated successfully", data: updatedService },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// DELETE SERVICE
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
        { success: false, message: "Invalid service id" },
        { status: 400 }
      );
    }

    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    if (service.image) {
      await deleteUploadFile(service.image);
    }

    await Service.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
