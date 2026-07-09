import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Setting from "@/models/Setting";

// GET Single Setting
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const setting = await Setting.findById(id);

    if (!setting) {
      return NextResponse.json(
        {
          success: false,
          message: "Setting not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: setting,
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

// UPDATE Setting
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    const setting = await Setting.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!setting) {
      return NextResponse.json(
        {
          success: false,
          message: "Setting not found.",
        },
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
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE Setting
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const setting = await Setting.findByIdAndDelete(id);

    if (!setting) {
      return NextResponse.json(
        {
          success: false,
          message: "Setting not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Setting deleted successfully.",
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