import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const JWT_SECRET = process.env.JWT_SECRET;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ===== Auth Helpers =====

export async function verifyAdmin(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    throw new AuthError("Not authenticated.");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      throw new AuthError("Unauthorized. Admin access required.");
    }
    return decoded;
  } catch (err) {
    if (err instanceof AuthError) throw err;
    throw new AuthError("Invalid or expired session.");
  }
}

export async function verifyAnyAuth(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    throw new AuthError("Not authenticated.");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch {
    throw new AuthError("Invalid or expired session.");
  }
}

export function authErrorResponse(err) {
  if (err instanceof AuthError) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 401 }
    );
  }
  return null;
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

// ===== Error Helpers =====

export function sanitizeError(error) {
  if (process.env.NODE_ENV === "development") {
    return error.message || "Something went wrong";
  }
  return "Something went wrong";
}

export function apiError(message, status = 500) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

// ===== Regex Helper =====

export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ===== File Upload Helpers =====

export function sanitizeFileName(name) {
  return name
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function validateFileUpload(file) {
  if (!file || !(file instanceof File) || file.size === 0) {
    return { valid: false, error: "No file provided." };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }
  return { valid: true };
}

export async function handleUpload(file, subDir = "") {
  const validation = validateFileUpload(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);
  await fs.promises.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name).toLowerCase();
  const safeName = sanitizeFileName(path.basename(file.name, ext));
  const uniqueId = crypto.randomUUID();
  const fileName = `${uniqueId}-${safeName}${ext}`;

  // Prevent path traversal
  const resolved = path.resolve(uploadDir, fileName);
  if (!resolved.startsWith(path.resolve(uploadDir))) {
    throw new Error("Invalid file path.");
  }

  const bytes = await file.arrayBuffer();
  await fs.promises.writeFile(resolved, Buffer.from(bytes));

  const urlPath = subDir
    ? `/uploads/${subDir}/${fileName}`
    : `/uploads/${fileName}`;
  return urlPath;
}

export async function deleteUploadFile(imageUrl) {
  if (!imageUrl) return;
  try {
    const filePath = path.join(process.cwd(), "public", imageUrl);
    const resolved = path.resolve(filePath);
    // Prevent path traversal on delete too
    if (resolved.startsWith(path.resolve(process.cwd(), "public", "uploads"))) {
      await fs.promises.unlink(resolved);
    }
  } catch {
    // Ignore if file doesn't exist
  }
}

// ===== Field Whitelist Helper =====

export function pick(obj, fields) {
  const result = {};
  for (const field of fields) {
    if (obj[field] !== undefined) {
      result[field] = obj[field];
    }
  }
  return result;
}
