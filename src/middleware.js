import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function isValidToken(token) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const valid = await isValidToken(token);

  // Block access to /admin/* unless logged in
  if (pathname.startsWith("/admin")) {
    if (!valid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // If already logged in, don't let them see the login page again
  if (pathname === "/login" && valid) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};