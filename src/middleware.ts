import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const url = request.nextUrl;

  const publicRoutes = ["/","/login"];

  if (publicRoutes.includes(url.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (url.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // rotas de paciente
  if (url.pathname.startsWith("/paciente")) {
    if (user.tipo !== "paciente") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (url.pathname.startsWith("/funcionario")) {
    if (user.tipo !== "funcionario") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/paciente/:path*",
    "/funcionario/:path*"
  ],
};
