import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'development' ? 'EmpirisysAdmin1!' : null);
    const jwtSecretStr = process.env.JWT_SECRET || (process.env.NODE_ENV === 'development' ? 'dev_jwt_secret_12345' : null);

    if (!adminPassword || !jwtSecretStr) {
      return NextResponse.json({ error: 'Server misconfiguration: Authentication is not configured.' }, { status: 500 });
    }

    const JWT_SECRET = new TextEncoder().encode(jwtSecretStr);

    if (password && password === adminPassword) {
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
