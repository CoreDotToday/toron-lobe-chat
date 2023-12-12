import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // // Redirect logged in users to organization selection page if they are not active in an organization
    // if (auth.userId && !auth.orgId && req.nextUrl.pathname !== '/org-selection') {
    //   const orgSelection = new URL('/org-selection', req.url);
    //   return NextResponse.redirect(orgSelection);
    // }
    // If the user is logged in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }
    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
  publicRoutes: ['/'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

// import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL('/home', request.url));
// }

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/about/:path*',
// };
