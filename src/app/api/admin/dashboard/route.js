import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import Service from "@/models/Service";
import Testimonial from "@/models/Testimonial";
import { verifyAdmin } from "@/lib/api-helpers";

export async function GET(request) {
  try {
    await verifyAdmin(request);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const [totalCourses, totalEnrollments, totalServices, totalTestimonials] =
      await Promise.all([
        Course.countDocuments(),
        Enrollment.countDocuments(),
        Service.countDocuments(),
        Testimonial.countDocuments(),
      ]);

    return NextResponse.json({
      success: true,
      stats: { totalCourses, totalEnrollments, totalServices, totalTestimonials },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
