// app/api/admin/verify/route.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  const { valid, user, error } = verifyToken(request);

  if (!valid) {
    return NextResponse.json({ success: false, message: error }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ success: true, message: "Welcome to the admin dashboard", user });
}