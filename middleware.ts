import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routes } from "./helpers/data";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login" && request.cookies.has("userAuth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    (pathname === "/" || routes.includes(pathname)) &&
    !request.cookies.has("userAuth")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/users",
    "/users/identity-verification",
    "/users/activity-history",
    "/users/customer-support",
    "/games",
    "/games/history",
    "/games/live",
    "/games/settings",
    "/staff",
    "/staff/activity-monitoring",
    "/staff/training-and-awareness",
    "/reports/financial",
    "/reports/game",
    "/reports/security",
    "/reports/custom",
    "/reports/room",
    "/payments",
    "/payments/withdrawal-process",
    "/payments/balances-and-movements",
    "/payments/gateway-settings",
    "/referrals/program-overview",
    "/referrals/referrals-management",
    "/referrals/rewards",
  ],
};
