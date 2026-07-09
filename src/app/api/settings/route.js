import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Setting from "@/models/Setting";

// GET Website Settings
export async function GET() {
  try {
    await dbConnect();

    const setting = await Setting.findOne();

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

// POST Create Settings (Only Once)
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const existing = await Setting.findOne();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Settings already exist. Use PUT to update.",
        },
        { status: 400 }
      );
    }

    const setting = await Setting.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Settings created successfully.",
        data: setting,
      },
      { status: 201 }
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



 