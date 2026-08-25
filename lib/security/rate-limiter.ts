import { NextResponse } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

// Periodic cleanup of expired entries to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
      if (now > value.resetTime) {
        store.delete(key);
      }
    }
  }, 300000); // 5 minutes

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

/**
 * Checks in-memory sliding window rate limit for an incoming request.
 * Extracts client IP from standard proxy headers or falls back to localhost.
 */
export function checkRateLimit(
  req: Request,
  limit: number = 30,
  windowMs: number = 60000,
): { allowed: boolean; headers: Record<string, string>; errorResponse?: NextResponse } {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || '127.0.0.1';

  const path = new URL(req.url).pathname;
  const key = `${ip}:${path}`;
  const now = Date.now();

  let record = store.get(key);
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + windowMs };
  }

  record.count += 1;
  store.set(key, record);

  const remaining = Math.max(0, limit - record.count);
  const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

  const headers = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetSeconds.toString(),
  };

  if (record.count > limit) {
    return {
      allowed: false,
      headers,
      errorResponse: NextResponse.json(
        { error: 'Too Many Requests. Please slow down and try again later.' },
        { status: 429, headers },
      ),
    };
  }

  return { allowed: true, headers };
}
