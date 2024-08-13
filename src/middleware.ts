// export { default } from "next-auth/middleware";

import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const config = {
  // matcher: ["/((?!auth/sign-up).*)"],
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/sign-up|images).*)",
  ],
};

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }
    const userRole = token.role;
    if (token.role == undefined)
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));

    if (pathname.startsWith("/admin") && userRole !== "Admin") {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    if (pathname.startsWith("/owner") && userRole !== "Owner") {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/auth/sign-in",
    },
  }
);
