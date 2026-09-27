import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    if (isLoggedIn) {
      const dashboardUrl =
        userRole === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }
    return NextResponse.next();
  }

  // Allow API auth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Redirect root to login or dashboard
  if (pathname === "/") {
    if (isLoggedIn) {
      const dashboardUrl =
        userRole === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect all dashboard routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/user", req.url));
  }

  // User-only routes
  if (pathname.startsWith("/dashboard/user") && userRole !== "USER") {
    return NextResponse.redirect(new URL("/dashboard/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|uploads).*)"],
};
