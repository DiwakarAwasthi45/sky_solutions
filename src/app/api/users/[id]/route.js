import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const SALT_ROUNDS = 10;

async function deleteImageFile(imageUrl) {
  if (!imageUrl) return;
  try {
    const filePath = path.join(process.cwd(), "public", imageUrl);
    await fs.promises.unlink(filePath);
  } catch {
    // Ignore if file doesn't exist or can't be removed
  }
}

// GET SINGLE USER
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user id." },
        { status: 400 }
      );
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// UPDATE USER
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user id." },
        { status: 400 }
      );
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const phone = formData.get("phone")?.toString().trim();
    const password = formData.get("password")?.toString();
    const roleRaw = formData.get("role")?.toString();
    const isActiveRaw = formData.get("isActive");
    const image = formData.get("image");

    const updates = {};

    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (roleRaw && ["admin", "user", "instructor"].includes(roleRaw)) {
      updates.role = roleRaw;
    }
    if (isActiveRaw !== null) {
      updates.isActive =
        isActiveRaw === "true" || isActiveRaw === true || isActiveRaw === "1";
    }

    if (email && email !== existingUser.email) {
      const emailTaken = await User.findOne({ email, _id: { $ne: id } });
      if (emailTaken) {
        return NextResponse.json(
          { success: false, message: "Another user already uses this email." },
          { status: 400 }
        );
      }
      updates.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { success: false, message: "Password must be at least 6 characters." },
          { status: 400 }
        );
      }
      updates.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    if (image instanceof File && image.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.promises.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
      const uploadPath = path.join(uploadDir, fileName);

      const bytes = await image.arrayBuffer();
      await fs.promises.writeFile(uploadPath, Buffer.from(bytes));

      await deleteImageFile(existingUser.image);
      updates.image = `/uploads/${fileName}`;
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Email already in use." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE USER
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user id." },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    await deleteImageFile(user.image);

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}