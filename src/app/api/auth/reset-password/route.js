import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(request) {
  try {
    const rlKey = getRateLimitKey(request, "reset-password");
    const { allowed, resetMs } = rateLimit({ key: rlKey, limit: 5, windowMs: 15 * 60 * 1000 });

    if (!allowed) {
      return NextResponse.json(
        { success: false, message: `Too many attempts. Try again in ${Math.ceil(resetMs / 60000)} minutes.` },
        { status: 429 }
      );
    }

    await dbConnect();

    const { token, password } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Reset token is required." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, message: "Password must contain at least one letter and one number." },
        { status: 400 }
      );
    }

    const candidates = await User.find({
      resetPasswordToken: { $ne: null },
      resetPasswordExpires: { $gt: new Date() },
    });

    let user = null;
    for (const candidate of candidates) {
      const isMatch = candidate.resetPasswordToken
        ? await bcrypt.compare(token, candidate.resetPasswordToken)
        : false;
      if (isMatch) {
        user = candidate;
        break;
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password reset successfully. You can now login." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
