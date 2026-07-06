import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login"];
const PUBLIC_PREFIXES = ["/login", "/api/auth"];

async function verifySession(request: NextRequest): Promise<{ role: string; member_id: string | null } | null> {
  const cookie = request.cookies.get("sabhara-session")?.value;
  if (!cookie) return null;
  try {
    const parsed = JSON.parse(atob(cookie)) as { role: string; member_id: string | null; exp: number };
    if (parsed.exp * 1000 < Date.now()) return null;
    return { role: parsed.role, member_id: parsed.member_id };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname) || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = await verifySession(request);

  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "admin") {
      const loginUrl = new URL("/login?tab=admin", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } else if (pathname.startsWith("/feed") || pathname.startsWith("/submit")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
