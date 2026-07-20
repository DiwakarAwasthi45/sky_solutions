import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminName = process.env.ADMIN_NAME || "Admin User";

export async function POST(request) {
  try {
    const rlKey = getRateLimitKey(request, "admin-login");
    const { allowed, resetMs } = rateLimit({ key: rlKey, limit: 5, windowMs: 15 * 60 * 1000 });

    if (!allowed) {
      return NextResponse.json(
        { success: false, message: `Too many attempts. Try again in ${Math.ceil(resetMs / 60000)} minutes.` },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { success: false, message: "Admin credentials not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel env vars." },
        { status: 500 }
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: "admin-1", email: adminEmail, name: adminName, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: { id: "admin-1", name: adminName, email: adminEmail, role: "admin" },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
