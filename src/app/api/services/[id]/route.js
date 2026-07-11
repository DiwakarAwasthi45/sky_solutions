import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

// ======================
// GET SINGLE SERVICE (by slug)
// ======================
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // this is actually the slug coming from the URL

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug is required",
        },
        { status: 400 }
      );
    }

    const service = await Service.findOne({ slug: id });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: service,
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

// ======================
// UPDATE SERVICE (by Mongo _id)
// ======================
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid service id",
        },
        { status: 400 }
      );
    }

    const oldService = await Service.findById(id);
    if (!oldService) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim();
    const shortDescription = formData.get("shortDescription")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const statusRaw = formData.get("status");
    const featuredRaw = formData.get("featured");
    const image = formData.get("image");

    const status = statusRaw === "true" || statusRaw === true || statusRaw === "1";
    const featured = featuredRaw === "true" || featuredRaw === true || featuredRaw === "1";

    if (!title || !slug || !shortDescription || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be filled.",
        },
        { status: 400 }
      );
    }

    const duplicate = await Service.findOne({ slug, _id: { $ne: id } });
    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists.",
        },
        { status: 400 }
      );
    }

    let imageUrl = oldService.image;

    if (image instanceof File && image.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.promises.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
      const uploadPath = path.join(uploadDir, fileName);

      const bytes = await image.arrayBuffer();
      await fs.promises.writeFile(uploadPath, Buffer.from(bytes));

      imageUrl = `/uploads/${fileName}`;

      if (oldService.image) {
        const oldImagePath = path.join(process.cwd(), "public", oldService.image);
        if (fs.existsSync(oldImagePath)) {
          await fs.promises.unlink(oldImagePath);
        }
      }
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        image: imageUrl,
        shortDescription,
        description,
        status,
        featured,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Service updated successfully",
        data: updatedService,
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

// ======================
// DELETE SERVICE (by Mongo _id)
// ======================
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid service id",
        },
        { status: 400 }
      );
    }

    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    if (service.image) {
      const imagePath = path.join(process.cwd(), "public", service.image);
      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath);
      }
    }

    await Service.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Service deleted successfully",
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