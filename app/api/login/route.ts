import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-development-do-not-use-in-prod'
);

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password === 'Empirisys1' || password === process.env.ADMIN_PASSWORD) {
      // Create a secure JWT payload
      const token = await new SignJWT({ auth: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

      const response = NextResponse.json({ success: true });
      
      // Set HttpOnly, Secure cookie
      response.cookies.set('eih_auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 86400 // 24 hours
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
