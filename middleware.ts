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

/**
 * Constant-time string compare for the Edge runtime (no Node crypto).
 * Length differences still take a full pass so a short secret is not obvious.
 */
function timingSafeEqualString(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  const length = Math.max(left.length, right.length, 1);
  let mismatch = left.length === right.length ? 0 : 1;
  for (let i = 0; i < length; i++) {
    const leftByte = i < left.length ? left[i] : 0;
    const rightByte = i < right.length ? right[i] : 0;
    mismatch |= leftByte ^ rightByte;
  }
  return mismatch === 0;
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
      const userOk = timingSafeEqualString(user, adminUser);
      const passwordOk = timingSafeEqualString(password, adminPassword);
      if (userOk && passwordOk) {
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
