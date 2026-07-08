import { NextResponse} from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";

// GET Single Testimonial
export async function GET(request, { params }) {
  try {
    await dbConnect();  
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Testimonial ID",
        },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch testimonial",
        error: error.message,
      },
      { status: 500 }
    );
  }
}   

// UPDATE Testimonial
export async function PUT(request, { params }) {
  try {
    await dbConnect();  
    const { id } = params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Testimonial ID",
        },
        { status: 400 }
      );
    }   

    const testimonial = await Testimonial.findByIdAndUpdate(id, body, { new: true });

    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        { status: 404 }
         );
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update testimonial",
        error: error.message,
      },
      { status: 500 }
    );
  } 
}

// DELETE Testimonial
export async function DELETE(request, { params }) {
  try {
    await dbConnect();  
    const { id } = params;  

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Testimonial ID",
        },
        { status: 400 }
      );
    }
        
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        { status: 404 }
      );
    }   

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete testimonial",
        error: error.message,
      },
      { status: 500 }
    );
  }}