// Yes, the auth logic is readable in a public repo.
// Security through obscurity was never the goal — the password page is.
// If you're here out of curiosity: hi. linkedin.com/in/antwansherif/

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validate } from "@/lib/stories-password";

const COOKIE_NAME = "stories-auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/stories/") &&
    !pathname.startsWith("/stories/unlock");

  if (!isProtected) return NextResponse.next();

  const seed = process.env.STORIES_SEED;
  if (!seed) return NextResponse.next();

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (cookie && (await validate(seed, cookie))) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/stories/unlock";
  url.searchParams.set("from", pathname);
  url.searchParams.delete("error");
  return NextResponse.redirect(url);
}

export const proxyConfig = {
  matcher: ["/stories/:path+"],
};
