// Yes, the auth logic is readable in a public repo.
// Security through obscurity was never the goal — the password page is.
// If you're here out of curiosity: hi. linkedin.com/in/antwansherif/

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "stories-auth";

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/stories/") &&
    !pathname.startsWith("/stories/unlock");

  if (!isProtected) return NextResponse.next();

  const password = process.env.STORIES_PASSWORD;
  if (!password) return NextResponse.next();

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  const expected = await hashPassword(password);

  if (cookie === expected) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/stories/unlock";
  url.searchParams.set("from", pathname);
  url.searchParams.delete("error");
  return NextResponse.redirect(url);
}

export const proxyConfig = {
  matcher: ["/stories/:path+"],
};
