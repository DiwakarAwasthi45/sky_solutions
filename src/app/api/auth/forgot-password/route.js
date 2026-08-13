import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.CONTACT_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const rlKey = getRateLimitKey(request, "forgot-password");
    const { allowed, resetMs } = rateLimit({ key: rlKey, limit: 3, windowMs: 15 * 60 * 1000 });

    if (!allowed) {
      return NextResponse.json(
        { success: false, message: `Too many attempts. Try again in ${Math.ceil(resetMs / 60000)} minutes.` },
        { status: 429 }
      );
    }

    await dbConnect();

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json(
        { success: false, message: "Invalid email format." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: true, message: "If an account exists with this email, a password reset link has been sent." },
        { status: 200 }
      );
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(rawToken, 10);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

    if (process.env.CONTACT_EMAIL && process.env.CONTACT_PASSWORD) {
      try {
        await transporter.sendMail({
          from: `"Sky Solutions Computer Institute" <${process.env.CONTACT_EMAIL}>`,
          to: user.email,
          subject: "Password Reset - Sky Solutions Computer Institute",
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
              <h2 style="color:#1C8BCA;margin-bottom:16px;">Reset Your Password</h2>
              <p style="color:#374151;line-height:1.6;">Hello ${user.name},</p>
              <p style="color:#374151;line-height:1.6;">We received a request to reset your password. Click the button below to choose a new password. This link is valid for <strong>1 hour</strong>.</p>
              <p style="text-align:center;margin:28px 0;">
                <a href="${resetUrl}" style="background:#1C8BCA;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
              </p>
              <p style="color:#6b7280;font-size:13px;line-height:1.6;">If you did not request this, you can safely ignore this email and your password will remain unchanged.</p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
              <p style="color:#9ca3af;font-size:12px;">Sky Solutions Computer Institute, Bedkot Nagarpalika-3, Shamadaiji, Kanchanpur, Nepal</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send reset email:", emailError);
        return NextResponse.json(
          { success: false, message: "Failed to send reset email. Please try again later." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: true, message: "If an account exists with this email, a password reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
