import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/employee')) {

    if (request.nextUrl.pathname === '/employee/access-denied') {
      return NextResponse.next();
    }

    let ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      (request as any).ip ||
      '';

    if (ip.startsWith('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    console.log("Final IP:", ip);

    const ALLOWED_IPS = [
      '106.200.31.34',
      '183.82.102.34',
      '106.214.2.84',
    ];

    if (process.env.NODE_ENV === 'development') {
      ALLOWED_IPS.push('127.0.0.1', '::1');
    }

    if (!ALLOWED_IPS.includes(ip)) {
      const url = request.nextUrl.clone();
      url.pathname = '/employee/access-denied';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/employee/:path*',
};
