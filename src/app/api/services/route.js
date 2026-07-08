import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";

// GET: Fetch all services
export async function GET() {
  try {
    await dbConnect();

    const services = await Service.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch services",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new service
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const service = await Service.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully",
        data: service,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create service",
        error: error.message,
      },
      { status: 500 }
    );
  }
}