const rateLimitMap = new Map();

function cleanup(key, windowMs) {
  const entry = rateLimitMap.get(key);
  if (entry && Date.now() > entry.resetAt) {
    rateLimitMap.delete(key);
  }
}

export function rateLimit({ key, limit = 5, windowMs = 15 * 60 * 1000 } = {}) {
  cleanup(key, windowMs);

  const now = Date.now();
  let entry = rateLimitMap.get(key);

  if (!entry) {
    entry = { count: 1, resetAt: now + windowMs };
    rateLimitMap.set(key, entry);
    return { allowed: true, remaining: limit - 1, resetMs: windowMs };
  }

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + windowMs;
    return { allowed: true, remaining: limit - 1, resetMs: windowMs };
  }

  entry.count++;

  if (entry.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: entry.resetAt - now,
    };
  }

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetMs: entry.resetAt - now,
  };
}

export function getRateLimitKey(request, prefix = "") {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "127.0.0.1";
  return `${prefix}:${ip}`;
}
