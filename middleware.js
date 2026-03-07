// Vercel Edge Middleware for auth gating
// Checks if subdomain should be auth-gated

const ALLOWED_EMAILS = ['mybotpetunia@gmail.com'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip auth page and API routes
  if (pathname.startsWith('/auth') || pathname.startsWith('/api')) {
    return;
  }
  
  // Check for auth session cookie
  const session = request.cookies.get('auth-session');
  
  if (!session) {
    // Redirect to auth page
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('return', pathname);
    return Response.redirect(url);
  }
  
  // TODO: Verify session token and check email allowlist
  // For now, just check if cookie exists
  
  return;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
