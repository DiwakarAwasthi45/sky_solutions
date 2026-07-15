import { NextResponse } from "next/server";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import { verifyAdmin, authErrorResponse, sanitizeError, handleUpload, deleteUploadFile } from "@/lib/api-helpers";

export const runtime = "nodejs";

// GET SINGLE COURSE (by slug)
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    const course = await Course.findOne({ slug: id });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: course }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// UPDATE COURSE (by Mongo _id)
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
        { success: false, message: "Invalid course id" },
        { status: 400 }
      );
    }

    const oldCourse = await Course.findById(id);

    if (!oldCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const durationRaw = formData.get("duration");
    const level = formData.get("level")?.toString().trim();
    const priceRaw = formData.get("price");
    const status = formData.get("status")?.toString().trim() || "Active";
    const syllabusRaw = formData.get("syllabus");
    const image = formData.get("image");

    const duration = Number(durationRaw);
    const price = Number(priceRaw);

    let syllabus = [];
    try {
      syllabus = JSON.parse(syllabusRaw?.toString() || "[]");
    } catch {
      syllabus = [];
    }

    if (!title || !slug || !description || !durationRaw || !level || !priceRaw) {
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

    if (Number.isNaN(duration) || Number.isNaN(price)) {
      return NextResponse.json(
        { success: false, message: "Duration and price must be valid numbers." },
        { status: 400 }
      );
    }

    const duplicateCourse = await Course.findOne({ slug, _id: { $ne: id } });
    if (duplicateCourse) {
      return NextResponse.json(
        { success: false, message: "Slug already exists." },
        { status: 400 }
      );
    }

    let imageUrl = oldCourse.image;

    if (image instanceof File && image.size > 0) {
      imageUrl = await handleUpload(image, "courses");
      if (oldCourse.image) {
        await deleteUploadFile(oldCourse.image);
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { title, slug, description, duration, level, price, status, syllabus, image: imageUrl },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, message: "Course updated successfully", data: updatedCourse },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

// DELETE COURSE (by Mongo _id)
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
        { success: false, message: "Invalid course id" },
        { status: 400 }
      );
    }

    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    if (course.image) {
      await deleteUploadFile(course.image);
    }

    await Course.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
