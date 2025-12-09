import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to /employee routes
  if (request.nextUrl.pathname.startsWith('/employee')) {
    // Allow access to the access-denied page to avoid redirect loops
    if (request.nextUrl.pathname === '/employee/access-denied') {
      return NextResponse.next();
    }

    // Get Client IP
    // Note: In development (localhost), this might be ::1 or 127.0.0.1
    let ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // request.ip is available in Next.js middleware but sometimes TypeScript complains
    // depending on the environment or type definitions. Safest to cast if needed,
    // or rely on headers which are standard for proxies/edge.
    if ((request as any).ip) {
        ip = (request as any).ip;
    }
    
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    // Allowed IPs (Office IPs)
    const ALLOWED_IPS = [
      '106.200.31.34','183.82.102.34'      // Office IPv4
    ];

    // For local development, we typically allow localhost (127.0.0.1, ::1)
    // But since we want to strictly test the IP restriction, we will comment this out.
    // If you want to work locally, you must either uncomment this OR 
    // temporarily add your local IP (127.0.0.1) to the ALLOWED_IPS list above.
    
   
    if (process.env.NODE_ENV === 'development') {
      ALLOWED_IPS.push('127.0.0.1');
      ALLOWED_IPS.push('::1');
    }
  

    // Check if the request IP is in the allowed list
    if (!ALLOWED_IPS.includes(ip)) {
      // Redirect to access denied page
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
