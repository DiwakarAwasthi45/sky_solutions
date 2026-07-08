import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";

// GET Single Gallery Item
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Gallery Item ID",
        },
        { status: 400 }
      );
    }

    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: galleryItem,
    });
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

// UPDATE Gallery Item
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Gallery Item ID",
        },
        { status: 400 }
      );
    }

    const galleryItem = await Gallery.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!galleryItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gallery item updated successfully",
      data: galleryItem,
    });
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

// DELETE Gallery Item
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Gallery Item ID",
        },
        { status: 400 }
      );
    }

    const galleryItem = await Gallery.findByIdAndDelete(id);

    if (!galleryItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
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