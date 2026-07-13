import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Replace this with your database lookup
const fakeAdmin = {
  id: "1",
  name: "Admin User",
  email: "diwakarawasthi45@gmail.com",
  role: "admin",
  passwordHash: await bcrypt.hash("admin@#$4593", 10),
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (email.toLowerCase() !== fakeAdmin.email) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, fakeAdmin.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: fakeAdmin.id,
        name: fakeAdmin.name,
        email: fakeAdmin.email,
        role: fakeAdmin.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}