import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const SALT_ROUNDS = 10;

// GET ALL USERS
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit")) || 10, 1), 100);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const isActiveParam = searchParams.get("isActive");

    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }

    if (role) {
      filter.role = role;
    }

    if (isActiveParam !== null) {
      filter.isActive = isActiveParam === "true";
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        count: users.length,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// CREATE USER
export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const phone = formData.get("phone")?.toString().trim();
    const password = formData.get("password")?.toString();
    const roleRaw = formData.get("role")?.toString();
    const isActiveRaw = formData.get("isActive");
    const image = formData.get("image");

    const role = ["admin", "user", "instructor"].includes(roleRaw) ? roleRaw : "user";
    const isActive =
      isActiveRaw === null
        ? true
        : isActiveRaw === "true" || isActiveRaw === true || isActiveRaw === "1";

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with this email already exists.",
        },
        { status: 400 }
      );
    }

    let imageUrl = "";

    if (image instanceof File && image.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.promises.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
      const uploadPath = path.join(uploadDir, fileName);

      const bytes = await image.arrayBuffer();
      await fs.promises.writeFile(uploadPath, Buffer.from(bytes));

      imageUrl = `/uploads/${fileName}`;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      image: imageUrl,
      isActive,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: userObj,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already in use.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}