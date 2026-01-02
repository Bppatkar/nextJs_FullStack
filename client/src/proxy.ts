// import { withAuth } from 'next-auth/middleware';
// import { NextResponse } from 'next/server';

// export default withAuth(
//   function proxy() {
//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//     pages: {
//       signIn: '/login',
//     },
//   }
// );

// export const config = {
//   matcher: ['/dashboard/:path*', '/clash/items/:path*'],
// };



import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/clash/items'];

  // ✅ Allow public access to clash detail pages like /clash/1, /clash/2, etc.
  const isClashDetailPage = pathname.match(/^\/clash\/\d+$/);

  // Only apply protection to routes that need it
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token && !isClashDetailPage) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    console.log('Redirecting to login for protected route:', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if logged in user tries to access login/register
  if ((pathname === '/login' || pathname === '/register') && token) {
    console.log('Redirecting logged-in user to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('Allowing request for:', pathname);
  return NextResponse.next();
}

// ✅ Only protect specific routes, NOT all /clash/*
export const config = {
  matcher: ['/dashboard/:path*', '/clash/items/:path*', '/login', '/register'],
};
