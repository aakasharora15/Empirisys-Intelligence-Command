import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Fallback in-memory rate limiter (used when Upstash Redis is not configured)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 50;
const WINDOW_MS = 60_000;

function checkMemoryRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  // Probabilistic cleanup to prevent memory growth
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.timestamp < windowStart) rateLimitMap.delete(key);
    }
  }
  const record = rateLimitMap.get(ip);
  if (!record || record.timestamp < windowStart) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count += 1;
  return true;
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const authCookie = request.cookies.get('eih_auth');
  if (!authCookie?.value) return false;
  
  const jwtSecretStr = process.env.JWT_SECRET || (process.env.NODE_ENV === 'development' ? 'dev_jwt_secret_12345' : null);
  if (!jwtSecretStr) return false;

  try {
    const JWT_SECRET = new TextEncoder().encode(jwtSecretStr);
    await jwtVerify(authCookie.value, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── API route enforcement ─────────────────────────────────────────────────
  if (pathname.startsWith('/api') && pathname !== '/api/login') {

    // Cron-only route: requires dedicated secret, not user JWT
    if (pathname === '/api/discover-competitors') {
      const cronSecret = request.headers.get('Authorization');
      const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : undefined;
      if (!expected || cronSecret !== expected) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      // API Authentication Restored: Block unauthenticated requests to AI routes
      if (!(await isAuthenticated(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Global rate limit applied
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const ratelimit = new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(RATE_LIMIT, '1 m'),
          analytics: true,
        });
        const { success } = await ratelimit.limit(`global_limit_${ip}`);
        if (!success) {
          console.warn(`[MW] Redis rate limit exceeded — IP: ${ip}`);
          return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
      } catch {
        // Redis unavailable — fall back to in-memory
        if (!checkMemoryRateLimit(ip)) {
          return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
      }
    } else if (!checkMemoryRateLimit(ip)) {
      console.warn(`[MW] In-memory rate limit exceeded — IP: ${ip}`);
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  // ── Protected page enforcement ────────────────────────────────────────────
  const protectedPages = [
    '/', '/assistant', '/competitors',
    '/marketing/lead-scoring', '/marketing/market-analyst', '/marketing/threats',
    '/training-data', '/settings',
  ];
  if (protectedPages.includes(pathname)) {
    if (!(await isAuthenticated(request))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ── Security headers on every response ───────────────────────────────────
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
