import { NextResponse, NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Guard protected routes: admin, dashboard, onboarding
  if (!sessionToken) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only intercept authenticated routes — never touch /signup, /login, public assets, or _next/HMR
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/onboarding/:path*',
  ],
};
