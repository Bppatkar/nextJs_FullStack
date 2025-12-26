// export { default } from 'next-auth/middleware';

// export const config = { matcher: ['/dashboard', '/clash/items/:path*'] };

// src/proxy.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const proxy = withAuth(
  function proxy(request) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export default proxy;

export const config = {
  matcher: ['/dashboard/:path*', '/clash/items/:path*'],
};
