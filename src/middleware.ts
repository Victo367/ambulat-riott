import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const url = request.nextUrl;

  const publicRoutes = ["/", "/login"];

  if (publicRoutes.includes(url.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/paciente/:path*",
    "/funcionario/:path*"
  ],
};
