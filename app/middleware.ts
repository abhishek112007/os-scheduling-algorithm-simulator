import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Forcefully remove 'noindex' and set correct indexing headers
  res.headers.set("X-Robots-Tag", "index, follow");

  return res;
}

// Apply middleware to all routes
export const config = {
  matcher: "/:path*",
};
