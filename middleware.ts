import { NextResponse, type NextRequest } from "next/server";
import { updateClientSession } from "@/lib/supabase-middleware";

/**
 * Route protection:
 * - /admin/* → HTTP Basic Auth (ADMIN_USER / ADMIN_PASSWORD)
 * - /client/* → Supabase session refresh + dashboard gate
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return protectAdmin(request);
  }

  if (pathname.startsWith("/client")) {
    return updateClientSession(request);
  }

  return NextResponse.next();
}

function protectAdmin(request: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return new NextResponse("Admin area is not configured.", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    try {
      const decoded = atob(authHeader.slice(6));
      const separator = decoded.indexOf(":");
      const user = decoded.slice(0, separator);
      const password = decoded.slice(separator + 1);
      if (user === adminUser && password === adminPassword) {
        return NextResponse.next();
      }
    } catch {
      // Malformed header — fall through to the challenge.
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Build With Innocent Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};
