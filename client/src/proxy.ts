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

  console.log('Proxy running for:', pathname);
  console.log('Token exists?', !!token);

  // Protected routes
  const protectedRoutes = ['/dashboard', '/clash'];

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    console.log('Redirecting to login');
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if logged in user tries to access login/register
  if ((pathname === '/login' || pathname === '/register') && token) {
    console.log('Redirecting logged-in user to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('Allowing request');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/clash/:path*', '/login', '/register'],
};