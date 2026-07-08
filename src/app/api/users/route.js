import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// GET all users
export async function GET() {
  try {
    await dbConnect();

    const users = await User.find().select("-password");

    return NextResponse.json({
      success: true,
      data: users,
    });
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


// POST create user
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      name,
      email,
      phone,
      password,
      role,
    } = body;


    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }


    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });


    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: user,
      },
      { status: 201 }
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