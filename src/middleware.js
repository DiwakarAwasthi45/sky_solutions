import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const PUBLIC_GET_API_ROUTES = [
  "/api/courses",
  "/api/services",
  "/api/gallery",
  "/api/facilities",
  "/api/testimonials",
  "/api/settings",
  "/api/upcoming",
];

async function isValidAdmin(token) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

async function isValidAnyUser(token) {
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const method = request.method;

  // === Admin page protection (exclude /adminlog) ===
  if (pathname.startsWith("/admin") && pathname !== "/adminlog") {
    const valid = await isValidAdmin(token);
    if (!valid) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // === Instructor page protection ===
  if (pathname.startsWith("/instructor")) {
    const valid = await isValidAnyUser(token);
    if (!valid) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // === Redirect logged-in users away from login/adminlog ===
  if (pathname === "/login" || pathname === "/adminlog") {
    const valid = await isValidAdmin(token);
    if (valid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // === API route protection ===
  if (pathname.startsWith("/api/")) {
    // Auth routes — allow public access
    if (
      pathname === "/api/auth/login" ||
      pathname === "/api/auth/admin-login" ||
      pathname === "/api/auth/register"
    ) {
      return NextResponse.next();
    }

    // Public GET routes for content listing
    if (method === "GET") {
      const isPublicGet = PUBLIC_GET_API_ROUTES.some(
        (route) => pathname === route || pathname === route + "/"
      );
      // Allow GET /api/courses/[slug] (single course by slug)
      const isPublicCourseGet =
        pathname.startsWith("/api/courses/") &&
        !pathname.match(/\/api\/courses\/[a-f0-9]{24}/);
      // Allow GET /api/services/[slug]
      const isPublicServiceGet =
        pathname.startsWith("/api/services/") &&
        !pathname.match(/\/api\/services\/[a-f0-9]{24}/);
      // Allow GET /api/settings/[id] (public site settings)
      const isPublicSettingGet = pathname.startsWith("/api/settings/");

      if (
        isPublicGet ||
        isPublicCourseGet ||
        isPublicServiceGet ||
        isPublicSettingGet
      ) {
        return NextResponse.next();
      }
    }

    // Admin-only routes: users, settings (write), enrollments
    const adminOnlyRoutes = ["/api/users", "/api/enrollments", "/api/settings"];
    const isAdminOnly = adminOnlyRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isAdminOnly) {
      const valid = await isValidAdmin(token);
      if (!valid) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }
      return NextResponse.next();
    }

    // Write operations on content routes require admin
    if (method !== "GET") {
      const contentRoutes = [
        "/api/courses",
        "/api/services",
        "/api/gallery",
        "/api/facilities",
        "/api/testimonials",
        "/api/upcoming",
      ];
      const isContentWrite = contentRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
      );

      if (isContentWrite) {
        const valid = await isValidAdmin(token);
        if (!valid) {
          return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
          );
        }
        return NextResponse.next();
      }
    }

    // /api/auth/me — require any auth
    if (pathname === "/api/auth/me") {
      const valid = await isValidAnyUser(token);
      if (!valid) {
        return NextResponse.json(
          { success: false, message: "Not authenticated" },
          { status: 401 }
        );
      }
      return NextResponse.next();
    }

    // All other API routes — require auth
    const valid = await isValidAnyUser(token);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/instructor/:path*",
    "/login",
    "/adminlog",
    "/api/:path*",
  ],
};
