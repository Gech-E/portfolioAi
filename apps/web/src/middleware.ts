import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register', '/pricing'];
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  // Check both the session cookie (set by client on login) and the refresh_token cookie (set by API)
  const hasSession = request.cookies.has('portfolioai_session') || request.cookies.has('refresh_token');

  if (!isPublicPath && !hasSession) {
    // Redirect to login if trying to access a protected route without a session
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  if ((pathname === '/login' || pathname === '/register') && hasSession) {
    // Redirect to dashboard if trying to access auth pages while already logged in
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
