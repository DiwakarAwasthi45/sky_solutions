import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dbConnect from "@/lib/db";
import User from "@/models/User";


export async function POST(request) {

  try {

    await dbConnect();


    const { email, password } = await request.json();



    if(!email || !password){

      return NextResponse.json(
        {
          success:false,
          message:"Email and password are required"
        },
        {
          status:400
        }
      );

    }




    const user = await User.findOne({
      email: email.toLowerCase()
    });



    if(!user){

      return NextResponse.json(
        {
          success:false,
          message:"Invalid email or password"
        },
        {
          status:401
        }
      );

    }





    const isMatch = await bcrypt.compare(
      password,
      user.password
    );



    if(!isMatch){

      return NextResponse.json(
        {
          success:false,
          message:"Invalid email or password"
        },
        {
          status:401
        }
      );

    }





    const token = jwt.sign(

      {
        id:user._id,
        email:user.email,
        role:user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn:"1d"
      }

    );






    const response = NextResponse.json(
      {
        success:true,
        message:"Login successful",

        user:{
          id:user._id,
          name:user.name,
          email:user.email,
          role:user.role
        }
      }
    );





    response.cookies.set(
      "token",
      token,
      {
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"lax",
        maxAge:60*60*24*7,
        path:"/"
      }
    );




    return response;



  } catch(error){


    return NextResponse.json(
      {
        success:false,
        message:error.message
      },
      {
        status:500
      }
    );


  }

}