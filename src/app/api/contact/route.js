import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/db";
import Contact from "@/models/Contact";
import { sanitizeError, sanitizeInput } from "@/lib/api-helpers";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.CONTACT_PASSWORD,
  },
});

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const name = sanitizeInput(body.name);
    const email = sanitizeInput(body.email);
    const message = sanitizeInput(body.message);

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (name.length > 100 || email.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { success: false, message: "Input too long." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    const contact = await Contact.create({ name, email, message });

    if (process.env.CONTACT_EMAIL && process.env.CONTACT_PASSWORD) {
      try {
        await transporter.sendMail({
          from: `"${name}" <${process.env.CONTACT_EMAIL}>`,
          to: process.env.CONTACT_EMAIL,
          subject: `New Contact Message from ${name}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <hr>
            <p style="color:#666;font-size:12px;">Sent from Sky Solutions contact form</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully!", data: contact },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: sanitizeError(error) },
      { status: 500 }
    );
  }
}
