import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Facility from "@/models/Facility";

// GET Single Facility
export async function   GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Facility ID",
        },
        { status: 400 }
      );
    }

    const facility = await Facility.findById(id);

    if (!facility) {
      return NextResponse.json(
        {
          success: false,
          message: "Facility not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: facility,
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

// UPDATE Facility
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Facility ID",
        },
        { status: 400 }
      );
    }

    const facility = await Facility.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!facility) {
      return NextResponse.json(
        {
          success: false,
          message: "Facility not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Facility updated successfully",
      data: facility,
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

// DELETE Facility
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Facility ID",
        },
        { status: 400 }
      );
    }

    const facility = await Facility.findByIdAndDelete(id);

    if (!facility) {
      return NextResponse.json(
        {
          success: false,
          message: "Facility not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Facility deleted successfully",
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