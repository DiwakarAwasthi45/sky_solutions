import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import Service from "@/models/Service";
import Testimonial from "@/models/Testimonial";
import Contact from "@/models/Contact";
import Gallery from "@/models/Gallery";
import { verifyAdmin } from "@/lib/api-helpers";

export const runtime = "nodejs";

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

    const [
      totalCourses,
      totalEnrollments,
      totalServices,
      totalTestimonials,
      totalContacts,
      totalGallery,
      pendingEnrollments,
      recentEnrollments,
      recentContacts,
      recentTestimonials,
    ] = await Promise.all([
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Service.countDocuments(),
      Testimonial.countDocuments(),
      Contact.countDocuments(),
      Gallery.countDocuments(),
      Enrollment.countDocuments({ enrollmentStatus: "pending" }),
      Enrollment.find()
        .populate("course", "title")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
      Testimonial.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalCourses,
        totalEnrollments,
        totalServices,
        totalTestimonials,
        totalContacts,
        totalGallery,
        pendingEnrollments,
      },
      recent: {
        enrollments: recentEnrollments,
        contacts: recentContacts,
        testimonials: recentTestimonials,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
